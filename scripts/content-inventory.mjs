// Capture every rendered text fragment, including decorative study labels, and
// every functional link. Counts catch accidental duplication as well as loss.
export function contentInventory(html) {
  const decode = value => value.replace(/&amp;/g, '&').replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const count = values => Object.fromEntries([...values.reduce((counts, value) =>
    counts.set(value, (counts.get(value) || 0) + 1), new Map())].sort(([a], [b]) => a.localeCompare(b)));
  const text = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
  return {
    text: count(text.split(/<[^>]*>/).map(value => decode(value).replace(/\s+/g, ' ').trim()).filter(Boolean)),
    links: count([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => decode(match[1]))),
    metadata: [...html.matchAll(/<meta\b[^>]+>|<link\b[^>]*rel="(?:canonical|alternate)"[^>]*>|<title>[\s\S]*?<\/title>|<script type="application\/ld\+json">[\s\S]*?<\/script>/g)].map(match => match[0]),
    sections: [...html.matchAll(/<section\b[^>]*id="([^"]+)"/g)].map(match => match[1]),
  };
}
