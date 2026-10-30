"""Lossy WebP delivery copies only; does not overwrite source images.

Requires Pillow. Run from the repository root.
Optional: --generated-manifest .cache/generated-assets.json
"""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

parser = argparse.ArgumentParser()
parser.add_argument("--generated-manifest")
args = parser.parse_args()
root = Path.cwd()
destination = root / "src/assets/optimized"
destination.mkdir(parents=True, exist_ok=True)
stats = []

def optimize(source, name, maximum):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
        target = destination / (name + ".webp")
        image.save(target, "WEBP", quality=84, method=6)
        stats.append({"name":name,"before":source.stat().st_size,"after":target.stat().st_size,"width":image.width,"height":image.height})

for source in (root / "src/assets/home").glob("*.png"):
    if source.stem == "logo":
        continue
    optimize(source, source.stem, 960 if source.stem in ("hero","business") else 800)
    if source.stem in ("cement","bricks","drill","paint"):
        optimize(source, source.stem + "-400", 400)

if args.generated_manifest:
    manifest = json.loads(Path(args.generated_manifest).read_text(encoding="utf-8"))
    sheet = Image.new("RGB", (1200, 660), "#efeeee")
    draw = ImageDraw.Draw(sheet)
    for index, entry in enumerate(manifest):
        source = Path(entry["source"])
        optimize(source, entry["name"], 960 if entry["name"] in ("renovation","structure","installation") else 800)
        with Image.open(source) as image:
            thumb = ImageOps.contain(image.convert("RGB"), (290,285))
            x, y = (index % 4)*300, (index // 4)*330
            sheet.paste(thumb,(x+(300-thumb.width)//2,y))
            draw.text((x+12,y+292),entry["name"],fill="#202d3a")
    sheet.save(root / ".cache/generated-contact-sheet.jpg", quality=90)

(root / ".cache/assets-stats.json").write_text(json.dumps(stats,indent=2),encoding="utf-8")
print(json.dumps({"files":len(stats),"source_bytes":sum(item["before"] for item in stats),"webp_bytes":sum(item["after"] for item in stats)}))
