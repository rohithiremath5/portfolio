"""Optional local Lighthouse audit using existing Playwright/Chrome tooling.

Run against the production preview on :4173. No packages are installed.
Set LIGHTHOUSE_PATH, CHROME_PATH or PREVIEW_URL to override local discovery.
"""
import json
import os
import pathlib
import subprocess
import sys

cache = pathlib.Path('.codex-tmp/browser-python')
if cache.exists():
    sys.path.insert(0, str(cache.resolve()))
from playwright.sync_api import sync_playwright

candidates = list(pathlib.Path('.codex-tmp/npm-cache/_npx').glob('*/node_modules/lighthouse/cli/index.js'))
cli = os.environ.get('LIGHTHOUSE_PATH') or (str(candidates[0]) if candidates else None)
if not cli:
    raise SystemExit('Set LIGHTHOUSE_PATH to an existing Lighthouse CLI installation.')
output = pathlib.Path('.codex-tmp/hybrid')
output.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=os.environ.get('CHROME_PATH', 'C:/Program Files/Google/Chrome/Application/chrome.exe'),
        headless=True, args=['--remote-debugging-port=9227'],
    )
    try:
        for preset in ['mobile', 'desktop']:
            path = output / f'lighthouse-{preset}-isolated.json'
            command = ['node', cli, os.environ.get('PREVIEW_URL', 'http://127.0.0.1:4173'),
                       '--port=9227', '--output=json', f'--output-path={path}',
                       '--only-categories=performance,accessibility,best-practices,seo', '--quiet']
            if preset == 'desktop':
                command.append('--preset=desktop')
            subprocess.run(command, check=True, timeout=180)
            report = json.loads(path.read_text(encoding='utf-8'))
            print(json.dumps({
                'preset': preset,
                'scores': {key: round(value['score'] * 100) for key, value in report['categories'].items()},
                'metrics': {key: report['audits'][key].get('displayValue') for key in
                            ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift']},
            }), flush=True)
    finally:
        browser.close()
