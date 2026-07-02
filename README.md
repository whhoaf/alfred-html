# Alfred's HTML Artifacts

Interactive HTML views generated from the Obsidian Brain vault, hosted on GitHub Pages.

**Live:** https://whhoaf.github.io/alfred-html/

## Publish new / updated artifacts

Make HTML in the vault (`wiki/outputs/html/<slug>/index.html` + `manifest.md`), then:

```bash
~/alfred-html/publish.sh
```

That syncs from the vault, rebuilds the `index.html` gallery from each site's
`manifest.md` frontmatter (title, purpose, domain), commits, and pushes.

## Layout

- `sites/<slug>/` — one folder per artifact (mirrors the vault)
- `gen-gallery.py` — builds the root gallery page
- `publish.sh` — sync + build + push
