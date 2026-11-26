#!/usr/bin/env python3
"""Rewrite internal page links to extensionless, root-absolute URLs.

    blog/index.html        -> /blog
    ../gioi-thieu.html#x   -> /gioi-thieu#x
    index.html#dat-lich    -> /#dat-lich

Only href values that point at a local .html page are touched; assets,
external links, tel:, mailto: and same-page anchors are left alone.
Safe to run repeatedly. Pairs with "cleanUrls": true in vercel.json.

Usage: python3 scripts/clean_urls.py [site_dir]
"""
import os
import posixpath
import re
import sys

HREF = re.compile(r'href="([^"]+)"')


def clean(url, page_dir):
    if re.match(r'^(?:[a-z][a-z0-9+.-]*:|//|#|/)', url, re.I):
        return url  # external, tel:, mailto:, anchor, or already root-absolute
    path, sep, rest = re.match(r'([^?#]*)([?#]?)(.*)', url).groups()
    if not path.endswith('.html'):
        return url
    full = posixpath.normpath(posixpath.join(page_dir, path))
    if full == 'index.html':
        full = ''
    elif full.endswith('/index.html'):
        full = full[:-len('/index.html')]
    else:
        full = full[:-len('.html')]
    return '/' + full + sep + rest


def clean_html(html, rel_path):
    page_dir = posixpath.dirname(rel_path.replace(os.sep, '/'))
    return HREF.sub(lambda m: 'href="%s"' % clean(m.group(1), page_dir), html)


def main(root):
    changed = 0
    for dirpath, dirnames, files in os.walk(root):
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d not in ('node_modules', 'scripts')]
        for name in files:
            if not name.endswith('.html'):
                continue
            path = os.path.join(dirpath, name)
            with open(path, encoding='utf-8') as f:
                html = f.read()
            new = clean_html(html, os.path.relpath(path, root))
            if new != html:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new)
                changed += 1
    print('clean_urls: %d file(s) updated' % changed)


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..'))
