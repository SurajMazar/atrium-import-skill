#!/usr/bin/env python3
"""
logo-outline — rebuild a logo lockup as an SVG whose text is converted to outlines, shaped with HarfBuzz
(same kerning as the browser) in the source's own font files. Needed because an SVG loaded through <img>
(how Atrium shows logos) cannot use web fonts: live <text> falls back to Georgia/Arial at the wrong size.

  pip install fonttools brotli uharfbuzz
  python logo-outline.py --mark mark.svg --mark-size 40 --gap 12 --height 40 \
     --line "EBGaramond.woff2:400:18:0.08:PEACE GLORY:#101f1a:1:2" \
     --line "HankenGrotesk.woff2:600:12:0.1:ECO FARM RESORT:#8c8a84:1:26" \
     --out logo.svg [--inverse "#fdfcfb:1,#fdfcfb:0.65" --out-inverse logo-inverse.svg]

--line is font:weight:size(px):tracking(em):TEXT:colour:opacity:lineBoxTop(px), for a `leading-none` line
(box height = size). Measure the source in the browser (font, size, weight, letter-spacing, each line's box
top relative to the lockup) and check the printed widths match the browser's text widths to ~0.1px.
"""
import argparse, io, re
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen


def shape(path, wght, size, tracking_em, text, x0, top):
    f = TTFont(path)
    if 'fvar' in f:
        f = instancer.instantiateVariableFont(f, {'wght': wght})
    f.flavor = None
    buf = io.BytesIO(); f.save(buf); data = buf.getvalue(); f = TTFont(io.BytesIO(data))
    upm, hhea = f['head'].unitsPerEm, f['hhea']
    k = size / upm
    asc, desc = hhea.ascent * k, -hhea.descent * k
    baseline = top + (size - (asc + desc)) / 2 + asc
    hbuf = hb.Buffer(); hbuf.add_str(text); hbuf.guess_segment_properties()
    hb.shape(hb.Font(hb.Face(data)), hbuf, {'liga': False, 'clig': False})
    gs, order, pen, x = f.getGlyphSet(), f.getGlyphOrder(), SVGPathPen(f.getGlyphSet()), x0
    for info, pos in zip(hbuf.glyph_infos, hbuf.glyph_positions):
        gs[order[info.codepoint]].draw(TransformPen(pen, (k, 0, 0, -k, x + pos.x_offset * k, baseline - pos.y_offset * k)))
        x += pos.x_advance * k + tracking_em * size
    return pen.getCommands(), x - x0


ap = argparse.ArgumentParser()
ap.add_argument('--mark'); ap.add_argument('--mark-size', type=float, default=40); ap.add_argument('--gap', type=float, default=12)
ap.add_argument('--height', type=float, default=40); ap.add_argument('--line', action='append', required=True)
ap.add_argument('--out', required=True); ap.add_argument('--inverse'); ap.add_argument('--out-inverse')
a = ap.parse_args()
mark, x0 = '', 0
if a.mark:
    src = open(a.mark).read(); inner = re.search(r'<svg[^>]*>(.*)</svg>', src, re.S).group(1)
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', src).group(1).split()]
    s = a.mark_size / vb[3]; mark = f'<g transform="translate(0 {(a.height - a.mark_size) / 2}) scale({s:.5f})">{inner}</g>'; x0 = a.mark_size + a.gap
lines, width = [], 0
for spec in a.line:
    font, wght, size, tr, text, colour, op, top = spec.split(':', 7)
    d, w = shape(font, float(wght), float(size), float(tr), text, x0, float(top))
    print(f'{text}: {w:.2f}px'); lines.append((d, colour, op)); width = max(width, x0 + w)
width = round(width, 2)
def write(path, colours):
    paths = ''.join(f'<path fill="{c}" fill-opacity="{o}" d="{d}"/>' for (d, _, _), (c, o) in zip(lines, colours))
    open(path, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {a.height}" width="{width}" height="{a.height}">{mark}{paths}</svg>')
write(a.out, [(c, o) for _, c, o in lines])
if a.inverse and a.out_inverse:
    write(a.out_inverse, [tuple(x.split(':')) for x in a.inverse.split(',')])
print(f'lockup {width} x {a.height}px -> set the site logo width to {round(width)}')
