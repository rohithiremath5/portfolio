"""Optional social image refresh after npm run build; requires Playwright + Chrome.
The production build uses the checked-in PNG and does not require a browser.
"""
import base64
import html
import json
import os
import pathlib
import sys

cached = pathlib.Path('.codex-tmp/browser-python')
if cached.exists():
    sys.path.insert(0, str(cached.resolve()))
from playwright.sync_api import sync_playwright

profile = json.loads(pathlib.Path('dist/profile.json').read_text(encoding='utf-8'))
font = base64.b64encode(pathlib.Path('public/fonts/dm-sans-normal.woff2').read_bytes()).decode()
document = f'''<html><head><style>
@font-face{{font-family:DM;src:url(data:font/woff2;base64,{font})}}
*{{box-sizing:border-box}}body{{margin:0;background:#101820;color:#f7f7f2;font-family:DM,sans-serif}}
main{{width:1200px;height:630px;padding:58px 70px;position:relative;overflow:hidden}}
.top{{display:flex;justify-content:space-between;color:#a9b7bb;font-size:20px;letter-spacing:2px}}
.mark{{font-size:46px;font-weight:700;letter-spacing:-4px;line-height:1}}.mark span{{color:#20b8a6}}
h1{{font-size:92px;line-height:1.05;letter-spacing:-6px;font-weight:550;max-width:780px;margin:85px 0 22px}}
.role{{color:#20b8a6;font-size:27px;letter-spacing:0}}.foot{{position:absolute;left:70px;right:70px;bottom:45px;border-top:1px solid #3b4b52;padding-top:20px;color:#a9b7bb;font-size:17px}}
.diagram{{position:absolute;width:350px;height:350px;right:-160px;top:170px;border:1px solid #20b8a6;transform:rotate(45deg)}}
.diagram:before,.diagram:after{{content:'';position:absolute;inset:45px;border:1px solid #48676d}}.diagram:after{{inset:90px;border-radius:50%}}
</style></head><body><main><div class="top"><span class="mark">rh<span>.</span></span><span>{html.escape(profile['location'])}</span></div>
<h1>{html.escape(profile['name'])}</h1><div class="role">{html.escape(profile['title'])}</div><div class="diagram"></div><div class="foot">{html.escape(profile['tagline'])}</div></main></body></html>'''
with sync_playwright() as p:
    chrome = os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe')
    browser = p.chromium.launch(executable_path=chrome if os.path.exists(chrome) else None, headless=True)
    page = browser.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
    page.set_content(document)
    page.evaluate('document.fonts.ready')
    page.screenshot(path='public/og.png')
    browser.close()
print('Generated public/og.png (1200 x 630) from the built profile.')
