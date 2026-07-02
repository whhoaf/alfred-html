#!/usr/bin/env python3
"""Generate index.html gallery from sites/*/manifest.md frontmatter."""
import os, re, html, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
SITES = os.path.join(ROOT, "sites")

def parse_manifest(path):
    """Pull title, purpose, domain from YAML frontmatter (no yaml dep)."""
    meta = {"title": None, "purpose": "", "domain": [], "updated": ""}
    try:
        with open(path, encoding="utf-8") as f:
            txt = f.read()
    except FileNotFoundError:
        return meta
    m = re.search(r"^---\n(.*?)\n---", txt, re.S)
    block = m.group(1) if m else txt
    t = re.search(r'^title:\s*"?(.+?)"?\s*$', block, re.M)
    if t: meta["title"] = t.group(1).strip()
    p = re.search(r'^purpose:\s*(.+?)\s*$', block, re.M)
    if p: meta["purpose"] = p.group(1).strip()
    u = re.search(r'^updated:\s*(.+?)\s*$', block, re.M)
    if u: meta["updated"] = u.group(1).strip()
    d = re.search(r'^domain:\s*\[(.*?)\]', block, re.M)
    if d: meta["domain"] = [x.strip() for x in d.group(1).split(",") if x.strip()]
    return meta

def main():
    cards = []
    for name in sorted(os.listdir(SITES)):
        d = os.path.join(SITES, name)
        if not os.path.isdir(d): continue
        if not os.path.exists(os.path.join(d, "index.html")): continue
        meta = parse_manifest(os.path.join(d, "manifest.md"))
        title = meta["title"] or name.replace("-", " ").title()
        purpose = meta["purpose"]
        if len(purpose) > 220: purpose = purpose[:217] + "..."
        tags = "".join(
            f'<span class="tag">{html.escape(t)}</span>' for t in meta["domain"]
        )
        cards.append(f'''    <a class="card" href="sites/{html.escape(name)}/index.html">
      <h2>{html.escape(title)}</h2>
      <p>{html.escape(purpose)}</p>
      <div class="meta"><div class="tags">{tags}</div>
        <span class="date">{html.escape(meta["updated"])}</span></div>
    </a>''')

    now = datetime.date.today().isoformat()
    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Alfred's HTML Artifacts</title>
<style>
  :root {{ --bg:#0f1117; --card:#1a1d27; --edge:#2a2e3a; --fg:#e8eaf0;
           --mut:#9aa0b0; --acc:#7aa2ff; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--fg);
    font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; }}
  header {{ padding:48px 24px 24px; max-width:1100px; margin:0 auto; }}
  h1 {{ margin:0 0 6px; font-size:28px; }}
  .sub {{ color:var(--mut); font-size:14px; }}
  .grid {{ max-width:1100px; margin:0 auto; padding:16px 24px 64px;
    display:grid; gap:18px; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }}
  .card {{ background:var(--card); border:1px solid var(--edge);
    border-radius:14px; padding:22px; text-decoration:none; color:inherit;
    display:flex; flex-direction:column; transition:border-color .15s,transform .15s; }}
  .card:hover {{ border-color:var(--acc); transform:translateY(-2px); }}
  .card h2 {{ margin:0 0 10px; font-size:18px; color:var(--acc); }}
  .card p {{ margin:0 0 16px; color:var(--mut); font-size:14px; flex:1; }}
  .meta {{ display:flex; justify-content:space-between; align-items:flex-end; gap:8px; }}
  .tags {{ display:flex; flex-wrap:wrap; gap:6px; }}
  .tag {{ background:#242836; color:#b8c0d8; font-size:11px;
    padding:3px 8px; border-radius:20px; }}
  .date {{ color:#6a7080; font-size:11px; white-space:nowrap; }}
</style>
</head>
<body>
<header>
  <h1>Alfred's HTML Artifacts</h1>
  <div class="sub">{len(cards)} interactive views. Generated {now}.</div>
</header>
<main class="grid">
{chr(10).join(cards)}
</main>
</body>
</html>
'''
    with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
        f.write(page)
    print(f"Wrote index.html with {len(cards)} cards.")

if __name__ == "__main__":
    main()
