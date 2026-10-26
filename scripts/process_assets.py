#!/usr/bin/env python3
"""
Process generated assets into transparent PNGs for the EcoPilah interactive experience.
"""
from PIL import Image, ImageFilter
import os
import glob

SOURCE_DIR = "/home/alfat/.gemini/antigravity-ide/brain/f06b3402-d873-4fd0-b112-ff0f0471947d"
TARGET_TRASH_DIR = "public/assets/trash"
TARGET_BIN_DIR = "public/assets/bin"

os.makedirs(TARGET_TRASH_DIR, exist_ok=True)
os.makedirs(TARGET_BIN_DIR, exist_ok=True)

def remove_white_bg_flood(img, tolerance=24, feather=1.5):
    """
    Flood fills the background starting from all four borders.
    Preserves white content inside the item (like white paper or labels).
    """
    img = img.convert("RGBA")
    width, height = img.size
    
    # Create mask: 255 = foreground, 0 = background
    # We will flood-fill on a grayscale or RGB image
    # PIL has Image.floodfill in ImageDraw
    from PIL import ImageDraw
    
    # Create a 1-channel mask initialized to 255
    mask = Image.new("L", (width, height), 255)
    
    # We will use flood fill on the original image
    # Find background pixels by checking difference from white (255, 255, 255)
    # Floodfill starting from outer border seeds
    # Let's create an image to floodfill on
    # We can create a grayscale image of closeness to white
    diff_map = Image.new("L", (width, height), 0)
    img_rgb = img.convert("RGB")
    pixels = img_rgb.load()
    diff_pixels = diff_map.load()
    
    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            # distance from white (255, 255, 255)
            # max channel difference or euclidean
            dist = max(255 - r, 255 - g, 255 - b)
            if dist <= tolerance:
                diff_pixels[x, y] = 255 # matches white background candidate
            else:
                diff_pixels[x, y] = 0
                
    # Now floodfill on diff_map from edges
    # We create a visited / bg_mask image
    bg_mask = Image.new("L", (width + 2, height + 2), 0) # padded for safety
    # Floodfill with Pillow's ImageDraw.floodfill
    # Wait, ImageDraw.floodfill in Pillow is available
    draw_diff = ImageDraw.Draw(diff_map)
    # Seeds along 4 borders
    seeds = []
    for x in range(0, width, 8):
        seeds.append((x, 0))
        seeds.append((x, height - 1))
    for y in range(0, height, 8):
        seeds.append((0, y))
        seeds.append((width - 1, y))
        
    for sx, sy in seeds:
        if diff_pixels[sx, sy] == 255:
            ImageDraw.floodfill(diff_map, (sx, sy), 128, thresh=0)
            
    # Now any pixel in diff_map with value 128 is connected background!
    # Foreground mask: 255 where diff_map != 128, 0 where diff_map == 128
    fg_mask = Image.new("L", (width, height), 255)
    fg_pixels = fg_mask.load()
    diff_after = diff_map.load()
    
    for y in range(height):
        for x in range(width):
            if diff_after[x, y] == 128:
                fg_pixels[x, y] = 0
                
    # Clean up alpha: slight blur for anti-aliasing
    if feather > 0:
        fg_mask_blurred = fg_mask.filter(ImageFilter.GaussianBlur(radius=feather))
    else:
        fg_mask_blurred = fg_mask
        
    # Apply defringe on RGB
    # White background defringing: if alpha < 255 and > 0, remove white component
    # to prevent white halos on dark background!
    final_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    final_pix = final_img.load()
    fg_blur_pix = fg_mask_blurred.load()
    
    for y in range(height):
        for x in range(width):
            a = fg_blur_pix[x, y]
            if a == 0:
                continue
            r, g, b = pixels[x, y]
            if a < 255:
                # Remove white background light bleed:
                # C = (C_orig - (1 - a/255)*255) / (a/255)
                alpha_norm = a / 255.0
                r_clean = max(0, min(255, int((r - (1.0 - alpha_norm) * 255) / alpha_norm)))
                g_clean = max(0, min(255, int((g - (1.0 - alpha_norm) * 255) / alpha_norm)))
                b_clean = max(0, min(255, int((b - (1.0 - alpha_norm) * 255) / alpha_norm)))
                final_pix[x, y] = (r_clean, g_clean, b_clean, a)
            else:
                final_pix[x, y] = (r, g, b, 255)
                
    return final_img

def process_all():
    print("Processing trash items...")
    trash_mapping = {
        "trash_soda_can": "soda-can.png",
        "trash_water_bottle": "plastic-bottle.png",
        "trash_banana_peel": "banana-peel.png",
        "trash_battery": "battery.png",
        "trash_coffee_cup": "coffee-cup.png",
        "trash_cardboard": "cardboard.png",
        "trash_crumpled_paper": "crumpled-paper.png",
    }
    
    for prefix, out_name in trash_mapping.items():
        files = glob.glob(os.path.join(SOURCE_DIR, f"{prefix}_*.jpg"))
        if not files:
            print(f"Warning: no files found for {prefix}")
            continue
        src_path = files[0]
        print(f"Processing {src_path} -> {out_name}")
        img = Image.open(src_path)
        out_img = remove_white_bg_flood(img, tolerance=22, feather=1.2)
        
        # Crop tight with some padding
        bbox = out_img.getbbox()
        if bbox:
            pad = 20
            w, h = out_img.size
            crop_box = (max(0, bbox[0]-pad), max(0, bbox[1]-pad), min(w, bbox[2]+pad), min(h, bbox[3]+pad))
            out_img = out_img.crop(crop_box)
            
        out_path = os.path.join(TARGET_TRASH_DIR, out_name)
        out_img.save(out_path, "PNG", optimize=True)
        print(f"Saved {out_path} ({out_img.size})")

    # Now process the bin assets!
    # bin_open_mouth has a dark background and metal rim with dark interior opening
    bin_files = glob.glob(os.path.join(SOURCE_DIR, "bin_open_mouth_*.jpg"))
    if bin_files:
        bin_src = bin_files[0]
        print(f"Processing bin layers from {bin_src}...")
        bin_img = Image.open(bin_src).convert("RGBA")
        bw, bh = bin_img.size
        
        # Center of opening is approximately (bw/2, bh*0.48)
        # The background outside the metal cylinder is black.
        # Let's isolate the cylinder and rim!
        # Background is black (diff from 0 <= 15)
        # We can create bin-front (outer cylinder + rim, with the circular opening transparent!)
        # and bin-back (the dark circular cavity)
        
        # Let's compute center and radius of the inner hole and outer rim
        # Inner hole is approximately center (512, 490), radius ~ 310
        center_x = bw // 2
        center_y = int(bh * 0.49)
        inner_radius_x = int(bw * 0.32)
        inner_radius_y = int(bh * 0.32)
        
        # bin-back: dark cavity with depth shadow
        bin_back = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        back_draw = bin_back.load()
        bin_pixels = bin_img.load()
        
        for y in range(bh):
            for x in range(bw):
                # Check if inside opening ellipse
                dx = (x - center_x) / inner_radius_x
                dy = (y - center_y) / inner_radius_y
                dist_sq = dx*dx + dy*dy
                if dist_sq <= 1.05:
                    # Inside the opening
                    r, g, b, _ = bin_pixels[x, y]
                    # Keep dark cavity tone
                    fade = max(0.0, min(1.0, (1.05 - dist_sq) * 10))
                    alpha = int(255 * fade)
                    back_draw[x, y] = (r, g, b, alpha)
                    
        bin_back.save(os.path.join(TARGET_BIN_DIR, "bin-back.png"), "PNG", optimize=True)
        print(f"Saved bin-back.png")
        
        # bin-front: outer rim, cylinder, lip, with hole cut out!
        bin_front = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
        front_draw = bin_front.load()
        
        # Outside black removal from outer boundary
        # cylinder width extends from ~x=80 to x=944
        for y in range(bh):
            for x in range(bw):
                r, g, b, _ = bin_pixels[x, y]
                # Is it outer black background?
                # Cylinder edge check:
                # If dark and outside cylinder radius, make transparent
                dx_center = abs(x - center_x)
                if dx_center > bw * 0.45 and (r + g + b) < 40:
                    continue
                # Also check top corners outside rim
                if y < center_y - inner_radius_y * 1.4 and (r + g + b) < 40:
                    continue
                    
                # Inside inner hole check:
                dx = (x - center_x) / inner_radius_x
                dy = (y - center_y) / inner_radius_y
                dist_sq = dx*dx + dy*dy
                if dist_sq < 0.95:
                    # Transparent inside the hole!
                    continue
                elif dist_sq <= 1.05:
                    # Feather the edge of the rim lip
                    edge_alpha = int(255 * ((dist_sq - 0.95) / 0.10))
                    front_draw[x, y] = (r, g, b, edge_alpha)
                else:
                    front_draw[x, y] = (r, g, b, 255)
                    
        bin_front.save(os.path.join(TARGET_BIN_DIR, "bin-front.png"), "PNG", optimize=True)
        print(f"Saved bin-front.png")
        
        # Also copy to root assets/ so both /assets/ and /public/assets/ work smoothly!
        import shutil
        os.makedirs("assets/trash", exist_ok=True)
        os.makedirs("assets/bin", exist_ok=True)
        for f in glob.glob("public/assets/trash/*"):
            shutil.copy(f, "assets/trash/")
        for f in glob.glob("public/assets/bin/*"):
            shutil.copy(f, "assets/bin/")
        print("Mirrored assets to root assets/ folder.")

if __name__ == "__main__":
    process_all()
