"""Production chatbot UI checks with mocked /api/chat responses, never Gemini.
Run with the production preview on :4173. Uses existing local Playwright/Chrome.
"""
import json
import os
import pathlib
import sys

cache = pathlib.Path('.codex-tmp/browser-python')
if cache.exists():
    sys.path.insert(0, str(cache.resolve()))
from playwright.sync_api import sync_playwright, expect

base = os.environ.get('PREVIEW_URL', 'http://127.0.0.1:4173')
artifacts = pathlib.Path('.codex-tmp/chatbot')
artifacts.mkdir(parents=True, exist_ok=True)
reports, errors, requests, pending = [], [], [], []
mode = 'success'
mock_reply = 'He lists Node.js and PostgreSQL in his portfolio.\n\n- His data ingestion project uses PostgreSQL.\n- Additional role details remain in the experience section.'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe'), headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda event: errors.append(event.text) if event.type == 'error' and 'status of 429' not in event.text and 'status of 503' not in event.text else None)

    def route_chat(route):
        requests.append(route.request.post_data_json)
        if mode == 'hold':
            pending.append(route)
        elif mode == 'quota':
            route.fulfill(status=429, content_type='application/json', body=json.dumps({'success': False, 'code': 'RATE_LIMITED', 'message': 'raw provider error must never be shown'}))
        elif mode == 'invalid':
            route.fulfill(status=200, content_type='application/json', body='{"success":true,"reply":null}')
        else:
            route.fulfill(status=200, content_type='application/json', body=json.dumps({'success': True, 'reply': mock_reply}))

    page.route('**/api/chat', route_chat)
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' and not ('/api/chat' in message.location.get('url', '') and 'Failed to load resource' in message.text) else None)
    page.goto(base, wait_until='networkidle')
    launcher = page.get_by_role('button', name='Open portfolio assistant')
    expect(launcher).to_be_visible()
    assert page.get_by_role('dialog').count() == 0
    assert not requests
    launcher.click()
    dialog = page.get_by_role('dialog', name='AI Portfolio Assistant')
    expect(dialog).to_be_visible()
    textarea = dialog.get_by_role('textbox')
    expect(textarea).to_be_focused()
    assert not requests
    assert dialog.get_attribute('aria-modal') is None
    expect(dialog.get_by_role('button', name='Send question')).to_be_disabled()
    dialog.get_by_role('button', name='What are his technical skills?', exact=True).click()
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    expect(dialog.locator('.chat-message--assistant')).to_contain_text('LangChain')
    assert not requests
    page.keyboard.press('Escape')
    expect(dialog).not_to_be_visible()
    expect(launcher).to_be_focused()
    launcher.click()
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    page.reload(wait_until='networkidle')
    page.get_by_role('button', name='Open portfolio assistant').click()
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    reports.append('Closed by default; lazy panel, FAQ suggestions without API calls, Escape/focus, reopen/refresh history: PASS')

    def clear_chat():
        dialog.get_by_role('button', name='Clear conversation').click()
        expect(dialog.locator('.chat-message')).to_have_count(0)

    def send(value):
        textarea.fill(value)
        expect(dialog.get_by_role('button', name='Send question')).to_be_enabled(timeout=4000)
        dialog.get_by_role('button', name='Send question').click()

    clear_chat()
    mode = 'hold'
    send('Which work demonstrates backend experience?')
    expect(dialog.get_by_role('button', name='Stop response')).to_be_visible()
    expect(dialog.get_by_role('status').filter(has_text='Preparing')).to_be_visible()
    textarea.fill('Do not submit a duplicate')
    textarea.press('Enter')
    assert len(requests) == 1
    assert len(pending) == 1
    pending.pop().fulfill(status=200, content_type='application/json', body=json.dumps({'success': True, 'reply': mock_reply}))
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    expect(dialog.locator('.chat-message--assistant ul li')).to_have_count(2)
    assert requests[-1]['history'] == []
    mode = 'success'
    send('Which databases has he used?')
    expect(dialog.locator('.chat-message--assistant')).to_have_count(2)
    assert len(requests[-1]['history']) == 2
    assert requests[-1]['history'][0]['role'] == 'user'
    dialog.get_by_role('button', name='Copy assistant response').last.click()
    expect(dialog.get_by_role('status').filter(has_text='Response copied.')).to_be_visible()
    assert page.evaluate('navigator.clipboard.readText()').replace('\r\n', '\n') == mock_reply
    reports.append('Mocked request, loading, duplicate prevention, follow-up context, safe bullets and copy response: PASS')

    request_count = len(requests)
    page.keyboard.press('Escape')
    expect(page.get_by_role('button', name='Open portfolio assistant')).to_be_focused()
    page.get_by_role('button', name='Open portfolio assistant').click()
    expect(dialog.locator('.chat-message')).to_have_count(4)
    page.reload(wait_until='networkidle')
    page.get_by_role('button', name='Open portfolio assistant').click()
    expect(dialog.locator('.chat-message')).to_have_count(4)
    assert len(requests) == request_count
    reports.append('Escape restores launcher focus; closing/reopening and reloading retain history without API calls: PASS')

    clear_chat()
    mode = 'quota'
    send('Explain his PostgreSQL project work.')
    expect(dialog.get_by_role('alert')).to_contain_text('temporary usage limit')
    assert 'raw provider error' not in dialog.inner_text()
    mode = 'success'
    retry = dialog.get_by_role('button', name='Retry question')
    expect(retry).to_be_enabled(timeout=4000)
    retry.click()
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    assert dialog.locator('.chat-message--user').count() == 1
    reports.append('Quota error is friendly and hides provider text; explicit retry adds no duplicate user message: PASS')

    clear_chat()
    mode = 'hold'
    send('Summarize his React dashboard work.')
    expect(dialog.get_by_role('button', name='Stop response')).to_be_visible()
    dialog.get_by_role('button', name='Stop response').click()
    expect(dialog.get_by_role('alert')).to_contain_text('Response stopped')
    if pending:
        pending.pop().abort()
    clear_chat()
    send('Explain his AI-related project contributions.')
    expect(dialog.get_by_role('button', name='Stop response')).to_be_visible()
    dialog.get_by_role('button', name='Clear conversation').click()
    if pending:
        pending.pop().fulfill(status=200, content_type='application/json', body=json.dumps({'success': True, 'reply': 'Stale reply must not appear.'}))
    expect(dialog.locator('.chat-message')).to_have_count(0)
    reports.append('Stop and clear cancel pending work; late responses cannot restore cleared conversations: PASS')

    mode = 'invalid'
    send('How do his skills match a frontend role?')
    expect(dialog.get_by_role('alert')).to_contain_text('temporarily unavailable')
    clear_chat()
    mode = 'success'
    mock_reply = '<img src=x onerror="window.chatInjected=true">\n\n' + ('A long safely rendered response. ' * 110)
    send('Describe relevant frontend work in more detail.')
    expect(dialog.locator('.chat-message--assistant')).to_have_count(1)
    assert dialog.locator('.chat-message img').count() == 0
    assert not page.evaluate('window.chatInjected || false')
    expect(dialog.locator('.chat-message--assistant')).to_contain_text('<img')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    textarea.fill('x' * 510)
    assert len(textarea.input_value()) == 500
    textarea.fill('First line')
    textarea.press('Shift+Enter')
    textarea.type('Second line')
    assert '\n' in textarea.input_value()
    reports.append('Invalid responses fail safely; long answers and literal HTML remain safe; 500-char limit and Shift+Enter: PASS')

    clear_chat()
    for theme in ['light', 'dark']:
        page.evaluate('t => {document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}', theme)
        for width in [320, 375, 425, 768, 1024, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 800})
            box = dialog.bounding_box()
            assert box['x'] >= 0 and box['x'] + box['width'] <= width + 1, (theme, width, box)
            assert box['y'] >= 0 and box['y'] + box['height'] <= 800, (theme, width, box)
            expect(textarea).to_be_visible()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            if width in [375, 1440]:
                page.screenshot(path=str(artifacts / f'{theme}-{width}.png'))
    page.emulate_media(reduced_motion='reduce')
    assert dialog.evaluate('el => getComputedStyle(el).animationName') == 'none'
    for width, height in [(375, 260), (320, 320), (768, 360)]:
        page.set_viewport_size({'width': width, 'height': height})
        expect(dialog).to_have_attribute('data-compact', 'true')
        panel_box = dialog.bounding_box()
        composer_box = dialog.locator('.chat-composer').bounding_box()
        assert panel_box['y'] >= 0
        assert composer_box['y'] + composer_box['height'] <= panel_box['y'] + panel_box['height'] + 1
        expect(textarea).to_be_visible()
    page.keyboard.press('Escape')
    expect(page.get_by_role('button', name='Open portfolio assistant')).to_be_focused()
    page.get_by_role('button', name='Open portfolio assistant').click()
    page.set_viewport_size({'width': 1440, 'height': 900})
    expect(dialog).not_to_have_attribute('data-compact', 'true')
    reports.append('Short visual viewports keep the full composer inside the panel; compact close restores focus: PASS')
    reports.append('Panel bounds and input at seven widths in both themes; reduced motion: PASS')

    axe_candidates = list(pathlib.Path('.codex-tmp/npm-cache/_npx').glob('*/node_modules/axe-core/axe.min.js'))
    scans = []
    if axe_candidates:
        for theme in ['light', 'dark']:
            for width in [320, 1440]:
                page.set_viewport_size({'width': width, 'height': 900})
                page.evaluate('t => {document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}', theme)
                page.add_script_tag(path=str(axe_candidates[0]))
                result = page.evaluate('async () => (await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}})).violations')
                scans.append({'theme': theme, 'width': width, 'violations': result})
        (artifacts / 'axe.json').write_text(json.dumps(scans, indent=2), encoding='utf-8')
        assert not any(scan['violations'] for scan in scans), scans
        reports.append('Open chatbot: axe WCAG 2.2 AA, zero violations in four light/dark/mobile/desktop combinations: PASS')

    page.get_by_role('button', name='Close assistant window').click()
    expect(page.get_by_role('button', name='Open portfolio assistant')).to_be_focused()
    page.locator('#main-menu a[href="#projects"]').click()
    expect(page.locator('#projects')).to_be_focused()
    assert not errors, errors
    reports.append('Underlying navigation remains usable; no browser runtime/hydration errors: PASS')

    stored = browser.new_context()
    stored.add_init_script("sessionStorage.setItem('portfolio-chat-v1',JSON.stringify(Array.from({length:50},(_,i)=>({role:i%2?'assistant':'user',content:'Restored message '+i}))))")
    tab = stored.new_page()
    tab.goto(base, wait_until='networkidle')
    tab.get_by_role('button', name='Open portfolio assistant').click()
    expect(tab.locator('.chat-message')).to_have_count(30)
    stored.close()
    blocked = browser.new_context()
    blocked.add_init_script("Object.defineProperty(window,'sessionStorage',{get(){throw new Error('Unavailable')}})")
    tab = blocked.new_page()
    tab.goto(base, wait_until='networkidle')
    tab.get_by_role('button', name='Open portfolio assistant').click()
    tab.get_by_role('button', name='What are his technical skills?', exact=True).click()
    expect(tab.locator('.chat-message--assistant')).to_have_count(1)
    blocked.close()
    reports.append('Stored conversation capped at 30; unavailable browser storage preserves in-memory chat: PASS')
    browser.close()

(artifacts / 'browser-results.json').write_text(json.dumps(reports, indent=2), encoding='utf-8')
print(json.dumps(reports, indent=2))
