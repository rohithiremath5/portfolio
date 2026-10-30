"""Optional production smoke check: pip install playwright, then run with preview on :4173.
Uses installed Chrome by default; set CHROME_PATH or install Playwright Chromium.
"""
import json
import os
from playwright.sync_api import sync_playwright

errors = []
results = []
with sync_playwright() as p:
    chrome = os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
    browser = p.chromium.launch(executable_path=chrome if os.path.exists(chrome) else None, headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, color_scheme='light', permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('console', lambda message: errors.append(message.text) if message.type == 'error' and 'hydr' in message.text.lower() else None)
    # Record a server-rendered node just before the client bundle executes.
    def mark_root(route):
        response = route.fetch()
        route.fulfill(response=response, body='window.__staticHeading = document.querySelector("h1");\n' + response.text())
    page.route('**/assets/*.js', mark_root)
    page.goto('http://127.0.0.1:4173/', wait_until='domcontentloaded')
    page.get_by_role('button', name='Switch to dark mode').click()
    page.wait_for_function("document.documentElement.dataset.theme === 'dark'")
    assert page.evaluate('window.__staticHeading === document.querySelector("h1")')
    page.reload(wait_until='domcontentloaded')
    page.get_by_role('button', name='Switch to light mode').wait_for()
    assert page.evaluate('window.__staticHeading === document.querySelector("h1")')
    results.append('Hydration retains static nodes, light/dark toggle and persistence: PASS')
    action = page.get_by_role('link', name='Explore my work')
    action.hover()
    page.wait_for_timeout(250)
    assert action.evaluate("el => getComputedStyle(el).transform") == 'matrix(1, 0, 0, 1, 0, -3)'
    page.emulate_media(reduced_motion='reduce')
    assert action.evaluate("el => getComputedStyle(el).transitionDuration") == '0s'
    page.emulate_media(reduced_motion='no-preference')
    results.append('Existing hover motion and reduced-motion override: PASS')
    page.locator('.project-details summary').first.click()
    assert page.locator('.project-details').first.get_attribute('open') is not None
    page.get_by_role('button', name='Copy email address').click()
    page.wait_for_function("document.querySelector('[role=status]').textContent === 'Copied to clipboard.'")
    assert page.evaluate('navigator.clipboard.readText()') == 'rohithiremath05@gmail.com'
    with page.expect_download() as download:
        page.get_by_role('link', name='Download CV').click()
    assert download.value.suggested_filename == 'Rohit_N_Hiremath_Resume.pdf'
    pdf = context.request.get('http://127.0.0.1:4173' + page.get_by_role('link', name='Download CV').get_attribute('href'))
    assert pdf.ok and pdf.body().startswith(b'%PDF')
    results.append('Project details, clipboard and resume download: PASS')
    for width in [320, 375, 390, 600, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), width
        if width == 390:
            page.get_by_role('button', name='Open navigation').click()
            assert page.locator('#main-menu').is_visible()
            page.keyboard.press('Escape')
            assert not page.locator('#main-menu').is_visible()
            page.get_by_role('button', name='Open navigation').click()
            page.locator('#main-menu').get_by_role('link', name='Work', exact=True).click()
            assert page.url.endswith('#projects')
            assert not page.locator('#main-menu').is_visible()
    results.append('Responsive overflow at seven widths; mobile menu, Escape and navigation: PASS')
    for blocked in [False, True]:
        ctx = browser.new_context(color_scheme='dark')
        if blocked:
            ctx.add_init_script("Object.defineProperty(window, 'localStorage', {get() {throw new Error('Storage unavailable')}})")
        tab = ctx.new_page()
        tab.on('pageerror', lambda error: errors.append(str(error)))
        tab.goto('http://127.0.0.1:4173/', wait_until='domcontentloaded')
        tab.get_by_role('button', name='Switch to light mode').wait_for()
        tab.emulate_media(color_scheme='light')
        tab.get_by_role('button', name='Switch to dark mode').wait_for()
        tab.get_by_role('button', name='Switch to dark mode').click()
        tab.wait_for_function("document.documentElement.dataset.theme === 'dark'")
        ctx.close()
    results.append('System theme changes and unavailable localStorage: PASS')
    no_js = browser.new_context(java_script_enabled=False, viewport={'width': 390, 'height': 844})
    tab = no_js.new_page()
    tab.goto('http://127.0.0.1:4173/', wait_until='domcontentloaded')
    for section in ['home', 'about', 'projects', 'experience', 'skills', 'contact']:
        assert tab.locator('#' + section).is_visible(), section
    assert tab.locator('#main-menu').is_visible()
    assert tab.get_by_role('link', name='Work', exact=True).is_visible()
    tab.locator('.project-details summary').first.click()
    assert tab.locator('.project-details').first.get_attribute('open') is not None
    assert tab.locator('a[href="mailto:rohithiremath05@gmail.com"]').count() > 0
    results.append('JavaScript disabled: all sections, mobile links, native details and email: PASS')
    assert not errors, errors
    results.append('Browser runtime/hydration errors: NONE')
    browser.close()
print(json.dumps(results, indent=2))
