"""Production checks with preview running on :4173. Requires Playwright + Chrome.
Set CHROME_PATH for another Chromium browser; AXE_PATH enables axe checks.
"""
import json
import os
import pathlib
import sys
from xml.etree import ElementTree

cached = pathlib.Path('.codex-tmp/browser-python')
if cached.exists():
    sys.path.insert(0, str(cached.resolve()))
from playwright.sync_api import sync_playwright

base = os.environ.get('PREVIEW_URL', 'http://127.0.0.1:4173')
errors, results = [], []
artifacts = pathlib.Path('.codex-tmp/redesign') / os.environ.get('BROWSER_NAME', 'chrome')
artifacts.mkdir(parents=True, exist_ok=True)
axe_path = os.environ.get('AXE_PATH')
if not axe_path:
    candidates = list(pathlib.Path('.codex-tmp/npm-cache/_npx').glob('*/node_modules/axe-core/axe.min.js'))
    axe_path = str(candidates[0]) if candidates else None

with sync_playwright() as p:
    chrome = os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
    browser = p.chromium.launch(executable_path=chrome if os.path.exists(chrome) else None, headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, color_scheme='light', permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
    def mark_root(route):
        response = route.fetch()
        route.fulfill(response=response, body='window.__staticHeading = document.querySelector("h1");\n' + response.text())
    page.route('**/assets/*.js', mark_root)
    page.goto(base, wait_until='networkidle')
    assert page.evaluate('window.__staticHeading === document.querySelector("h1")')
    assert page.get_by_role('heading', level=1).count() == 1
    for theme in ['dark', 'light']:
        page.get_by_role('button', name=f'Switch to {theme} mode').click()
        page.wait_for_function('theme => document.documentElement.dataset.theme === theme', arg=theme)
        page.reload(wait_until='networkidle')
        assert page.evaluate('window.__staticHeading === document.querySelector("h1")')
        assert page.evaluate('document.documentElement.dataset.theme') == theme
    results.append('Hydration retains static nodes; both themes and persistence: PASS')
    action = page.get_by_role('link', name='Explore my work')
    action.hover(); page.wait_for_timeout(250)
    assert action.evaluate('el => getComputedStyle(el).transform') == 'matrix(1, 0, 0, 1, 0, -3)'
    page.emulate_media(reduced_motion='reduce')
    assert action.evaluate('el => getComputedStyle(el).transitionDuration') == '0s'
    assert page.locator('html').evaluate('el => getComputedStyle(el).scrollBehavior') == 'auto'
    page.emulate_media(reduced_motion='no-preference')
    details = page.locator('.project-details')
    assert details.count() == 4
    assert all(details.nth(i).get_attribute('open') is not None for i in range(4))
    details.first.locator('summary').click()
    assert details.first.get_attribute('open') is None
    details.first.locator('summary').click()
    assert details.first.get_attribute('open') is not None
    results.append('Hover/reduced motion; all contributions open by default and native disclosure: PASS')
    page.get_by_role('button', name='Copy email address').click()
    page.wait_for_function('document.querySelector("[role=status]").textContent === "Copied to clipboard."')
    assert page.evaluate('navigator.clipboard.readText()') == 'rohithiremath05@gmail.com'
    with page.expect_download() as download:
        page.get_by_role('link', name='Download CV').click()
    assert download.value.suggested_filename == 'Rohit_N_Hiremath_Resume.pdf'
    for path in ['/resume', '/resume.pdf', page.get_by_role('link', name='Download CV').get_attribute('href')]:
        response = context.request.get(base + path)
        assert response.ok and response.body().startswith(b'%PDF'), path
    results.append('Clipboard, resume download, original PDF URL and /resume: PASS')

    # Lazy images only load as they approach the viewport. Decode each local logo
    # before judging its presentation or taking skill-section screenshots.
    for logo in page.locator('.skill-card__icon img').all():
        logo.scroll_into_view_if_needed()
        logo.evaluate('el => el.decode()')
        assert logo.evaluate('el => el.complete && el.naturalWidth > 0')
    results.append('All local technology logos load and decode successfully: PASS')

    for theme in ['light', 'dark']:
        page.evaluate('t => { document.documentElement.dataset.theme = t; document.documentElement.style.colorScheme = t; }', theme)
        for width in [320, 375, 390, 425, 650, 768, 900, 1024, 1280, 1440, 1920]:
            page.set_viewport_size({'width': width, 'height': 900})
            page.evaluate('window.scrollTo(0,0)')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (theme, width)
            assert page.locator('.skill-card__name').evaluate_all('els => els.every(el => el.scrollWidth <= el.clientWidth)'), (theme, width, 'skill labels')
            assert page.locator('.project-card').evaluate_all('els => els.every((a, i) => els.every((b, j) => { if (i >= j) return true; const x=a.getBoundingClientRect(), y=b.getBoundingClientRect(); return x.right <= y.left + 1 || y.right <= x.left + 1 || x.bottom <= y.top + 1 || y.bottom <= x.top + 1; }))'), (theme, width, 'project overlap')
            assert page.locator('.hero-description').evaluate('el => parseFloat(getComputedStyle(el).fontSize)') >= 16
            if width in [1440, 768, 390, 320]:
                page.screenshot(path=str(artifacts / f'validated-{theme}-{width}.png'), full_page=True)
            if width in [768, 390, 320]:
                menu = page.get_by_role('button', name='Open navigation')
                menu.click()
                assert page.locator('#main-menu').is_visible()
                assert page.locator('#main-menu a').first.evaluate('el => el === document.activeElement')
                assert page.get_by_role('button', name='Close navigation').get_attribute('aria-expanded') == 'true'
                page.keyboard.press('Escape')
                assert not page.locator('#main-menu').is_visible()
                assert menu.evaluate('el => el === document.activeElement')
                menu.click()
                page.locator('#main-menu').get_by_role('link', name='Work', exact=True).click()
                page.wait_for_function('location.hash === "#projects"')
                assert not page.locator('#main-menu').is_visible()
                assert page.locator('#projects').evaluate('el => el === document.activeElement')
    results.append('No overflow, clipped skill labels or overlapping projects at eleven widths (320-1920) in both themes; mobile menu, ARIA, Escape, focus and anchors: PASS')
    page.set_viewport_size({'width': 1440, 'height': 1000})
    page.emulate_media(reduced_motion='reduce')
    page.reload(wait_until='networkidle')
    page.keyboard.press('Tab')
    assert page.get_by_role('link', name='Skip to content').evaluate('el => el === document.activeElement')
    page.keyboard.press('Enter')
    assert page.locator('main').evaluate('el => el === document.activeElement')
    for label, anchor in [('Work', 'projects'), ('Experience', 'experience'), ('About', 'about'), ('Skills', 'skills'), ('Contact', 'contact')]:
        page.locator('#main-menu').get_by_role('link', name=label, exact=True).click()
        page.wait_for_function('id => document.querySelector(`#main-menu a[href="#${id}"]`).getAttribute("aria-current") === "location"', arg=anchor)
        assert page.locator('#' + anchor).bounding_box()['y'] >= page.locator('.header').bounding_box()['height']
    page.get_by_role('link', name='Back to top', exact=True).click()
    page.wait_for_function('window.scrollY === 0')
    results.append('Keyboard skip link, active navigation, header offsets and back to top: PASS')
    page.goto(base, wait_until='networkidle')
    expected = page.evaluate('''() => {
      const elements = [...document.querySelectorAll('a[href], button:not([disabled]), summary')].filter(el => el.offsetWidth && el.offsetHeight);
      elements.forEach((el, index) => el.dataset.qaKeyboard = String(index));
      document.activeElement.blur();
      return elements.length;
    }''')
    visited = set()
    for _ in range(expected):
        page.keyboard.press('Tab')
        focused = page.evaluate('''() => {
          const el = document.activeElement;
          return {id:el.dataset.qaKeyboard, outline:getComputedStyle(el).outlineStyle, width:parseFloat(getComputedStyle(el).outlineWidth)};
        }''')
        assert focused['id'] is not None, focused
        assert focused['outline'] != 'none' and focused['width'] >= 2, focused
        visited.add(focused['id'])
    assert len(visited) == expected, (len(visited), expected)
    results.append(f'Keyboard traversal: all {expected} visible links/buttons/disclosures reachable with visible focus')

    responses = {}
    for path, mime in [('/profile.json','application/json'),('/profile.md','text/markdown'),('/robots.txt','text/plain'),('/sitemap.xml','application/xml'),('/llms.txt','text/plain')]:
        response = context.request.get(base + path)
        assert response.ok, path
        assert response.headers['content-type'].startswith(mime), (path, response.headers)
        responses[path] = response.text()
        assert not response.text().lstrip().startswith('<!DOCTYPE html>'), path
    assert json.loads(responses['/profile.json'])['name'] == 'Rohit N Hiremath'
    ElementTree.fromstring(responses['/sitemap.xml'])
    for extension in ['json', 'md', 'xml', 'txt', 'pdf']:
        assert context.request.get(base + '/does-not-exist.' + extension).status == 404
    results.append('Profile endpoints, MIME types, valid JSON/XML and missing-document 404s: PASS')

    if axe_path:
        accessibility = []
        for theme, width in [(theme, width) for theme in ['light','dark'] for width in [320,375,425,768,1024,1440,1920]]:
            page.set_viewport_size({'width':width,'height':1000})
            page.evaluate('theme => {document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme}', theme)
            page.add_script_tag(path=axe_path)
            report = page.evaluate('async () => { const r = await axe.run(document, {runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa","best-practice"]}}); return {violations:r.violations,incomplete:r.incomplete}; }')
            accessibility.append({'theme':theme,'width':width,**report})
        (artifacts / 'axe.json').write_text(json.dumps(accessibility, indent=2), encoding='utf-8')
        violations = [(report['theme'], report['width'], item['id'], [node['target'] for node in item['nodes']]) for report in accessibility for item in report['violations']]
        assert not violations, violations
        results.append('axe WCAG 2.2 AA: zero violations in fourteen theme/viewport combinations')
    else:
        results.append('axe: NOT RUN (set AXE_PATH)')

    for blocked in [False, True]:
        ctx = browser.new_context(color_scheme='dark')
        if blocked:
            ctx.add_init_script("Object.defineProperty(window, 'localStorage', {get() {throw new Error('Storage unavailable')}})")
        tab = ctx.new_page()
        tab.on('pageerror', lambda error: errors.append(str(error)))
        tab.goto(base, wait_until='domcontentloaded')
        tab.get_by_role('button', name='Switch to light mode').wait_for()
        tab.emulate_media(color_scheme='light')
        tab.get_by_role('button', name='Switch to dark mode').wait_for()
        tab.get_by_role('button', name='Switch to dark mode').click()
        tab.wait_for_function("document.documentElement.dataset.theme === 'dark'")
        ctx.close()
    results.append('System theme updates and unavailable storage: PASS')
    denied = browser.new_context()
    denied.add_init_script("Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('Clipboard denied'))}})")
    tab = denied.new_page()
    tab.goto(base, wait_until='networkidle')
    tab.get_by_role('button', name='Copy email address').click()
    tab.get_by_role('status').filter(has_text='Please select and copy the email address above.').wait_for()
    denied.close()
    results.append('Clipboard denied: accessible manual-copy fallback: PASS')
    no_js = browser.new_context(java_script_enabled=False, viewport={'width':390,'height':844})
    tab = no_js.new_page()
    tab.goto(base, wait_until='domcontentloaded')
    for section in ['home','about','projects','experience','skills','education','contact']:
        assert tab.locator('#' + section).is_visible(), section
    assert tab.locator('#main-menu').is_visible()
    assert tab.get_by_role('link', name='Work', exact=True).is_visible()
    assert all(tab.locator('.project-details').nth(i).get_attribute('open') is not None for i in range(4))
    assert tab.locator('a[href="mailto:rohithiremath05@gmail.com"]').count() > 0
    assert tab.evaluate('document.documentElement.scrollWidth <= innerWidth')
    results.append('JavaScript disabled: all sections, full contributions, mobile navigation, email: PASS')
    assert not errors, errors
    results.append('Runtime/console/hydration errors: NONE')
    browser.close()

print(json.dumps(results, indent=2))
(artifacts / 'browser-results.json').write_text(json.dumps(results, indent=2) + '\n', encoding='utf-8')
