import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_step_mascots():
    out_dir = 'public/assets/mascot'
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs('scratch/preview_mascots', exist_ok=True)

    font_path_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    font_path_regular = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    
    font_sm = ImageFont.truetype(font_path_bold, 28)
    font_xs = ImageFont.truetype(font_path_bold, 22)
    font_mono = ImageFont.truetype(font_path_bold, 36)
    font_lg = ImageFont.truetype(font_path_bold, 44)

    # =========================================================================
    # STEP 1: Pilah & Scan AI Mascot (step-mascot-1.png)
    # Base: mesh-bin-mascot.png with AI Scanner HUD & WebGPU Laser
    # =========================================================================
    base1 = Image.open('public/assets/mascot/mesh-bin-mascot.png').convert('RGBA')
    # Target canvas
    w1, h1 = base1.size # 1304, 1744
    canvas1 = Image.new('RGBA', (w1 + 100, h1 + 100), (0, 0, 0, 0))
    canvas1.paste(base1, (50, 50), base1)
    
    overlay1 = Image.new('RGBA', canvas1.size, (0, 0, 0, 0))
    d1 = ImageDraw.Draw(overlay1)

    # 1. AI Reticle Corners [  ] around the bin center
    cx, cy = w1 // 2 + 50, h1 // 2 + 30
    rw, rh = 420, 480
    x0, y0 = cx - rw, cy - rh
    x1, y1 = cx + rw, cy + rh
    corner_len = 110
    bracket_col = (0, 245, 160, 240) # Neon Mint / WebGPU Green
    glow_col = (0, 245, 160, 90)

    # Draw corner brackets with glow
    for w_thick, c in [(14, glow_col), (6, bracket_col)]:
        # Top-Left
        d1.line([(x0, y0), (x0 + corner_len, y0)], fill=c, width=w_thick)
        d1.line([(x0, y0), (x0, y0 + corner_len)], fill=c, width=w_thick)
        # Top-Right
        d1.line([(x1, y0), (x1 - corner_len, y0)], fill=c, width=w_thick)
        d1.line([(x1, y0), (x1, y0 + corner_len)], fill=c, width=w_thick)
        # Bottom-Left
        d1.line([(x0, y1), (x0 + corner_len, y1)], fill=c, width=w_thick)
        d1.line([(x0, y1), (x0, y1 - corner_len)], fill=c, width=w_thick)
        # Bottom-Right
        d1.line([(x1, y1), (x1 - corner_len, y1)], fill=c, width=w_thick)
        d1.line([(x1, y1), (x1, y1 - corner_len)], fill=c, width=w_thick)

    # 2. Glowing Horizontal Scan Laser Line
    laser_y = cy - 40
    laser_glow = Image.new('RGBA', canvas1.size, (0, 0, 0, 0))
    d_lg = ImageDraw.Draw(laser_glow)
    d_lg.line([(x0 - 30, laser_y), (x1 + 30, laser_y)], fill=(0, 255, 180, 200), width=12)
    d_lg.line([(x0 - 50, laser_y), (x1 + 50, laser_y)], fill=(0, 230, 140, 100), width=28)
    laser_glow = laser_glow.filter(ImageFilter.GaussianBlur(6))
    canvas1 = Image.alpha_composite(canvas1, laser_glow)

    # Thin crisp core laser
    d1.line([(x0 - 40, laser_y), (x1 + 40, laser_y)], fill=(255, 255, 255, 255), width=4)

    # 3. AI HUD Badge Tag at top
    badge_w, badge_h = 560, 68
    bx0, by0 = cx - badge_w // 2, y0 - 35
    bx1, by1 = bx0 + badge_w, by0 + badge_h
    d1.rounded_rectangle([bx0, by0, bx1, by1], radius=34, fill=(16, 24, 20, 235), outline=(0, 245, 160, 255), width=3)
    d1.text((bx0 + 36, by0 + 18), "✦ AI WEBGPU DETECTED • 98.4%", fill=(0, 255, 170, 255), font=font_sm)

    # 4. Target Classification Pill below laser
    pill_w, pill_h = 440, 56
    px0, py0 = cx - pill_w // 2, laser_y + 24
    px1, py1 = px0 + pill_w, py0 + pill_h
    d1.rounded_rectangle([px0, py0, px1, py1], radius=28, fill=(0, 245, 160, 235), outline=(16, 24, 20, 255), width=2)
    d1.text((px0 + 28, py0 + 14), "PET BOTTLE RECYCLABLE ✓", fill=(10, 30, 20, 255), font=font_xs)

    canvas1 = Image.alpha_composite(canvas1, overlay1)
    canvas1.save('public/assets/mascot/step-mascot-1.png', 'PNG')
    print("Step 1 mascot saved:", canvas1.size)

    # =========================================================================
    # STEP 2: Tiket Setor QR Mascot (step-mascot-2.png)
    # Base: trash2cash-hero-mascot-original.png (thumbs up) + Clean QR Ticket Slip
    # =========================================================================
    base2 = Image.open('public/assets/mascot/trash2cash-hero-mascot-original.png').convert('RGBA')
    # Resize up cleanly to high resolution (approx 1000px height)
    target_h2 = 1400
    ratio2 = target_h2 / base2.height
    target_w2 = int(base2.width * ratio2)
    base2_up = base2.resize((target_w2, target_h2), Image.Resampling.LANCZOS)

    canvas2 = Image.new('RGBA', (target_w2 + 360, target_h2 + 100), (0, 0, 0, 0))
    # Place mascot slightly to the left
    canvas2.paste(base2_up, (40, 50), base2_up)

    # Create Ticket Slip attached to the mascot's right side / hand
    ticket_w, ticket_h = 460, 620
    tx0, ty0 = canvas2.width - ticket_w - 30, 360
    
    ticket_layer = Image.new('RGBA', canvas2.size, (0, 0, 0, 0))
    dt = ImageDraw.Draw(ticket_layer)

    # Ticket drop shadow
    shadow_offset = 14
    dt.rounded_rectangle([tx0 + shadow_offset, ty0 + shadow_offset, tx0 + ticket_w + shadow_offset, ty0 + ticket_h + shadow_offset], 
                         radius=24, fill=(0, 0, 0, 110))
    ticket_layer = ticket_layer.filter(ImageFilter.GaussianBlur(10))

    dt = ImageDraw.Draw(ticket_layer)
    # Ticket background (Warm Cream White)
    dt.rounded_rectangle([tx0, ty0, tx0 + ticket_w, ty0 + ticket_h], radius=24, fill=(255, 253, 248, 255), outline=(22, 22, 22, 255), width=5)

    # Ticket Header (Orange / Amber Brand Gradient)
    hdr_h = 130
    dt.rounded_rectangle([tx0, ty0, tx0 + ticket_w, ty0 + hdr_h], radius=24, fill=(255, 153, 0, 255))
    dt.rectangle([tx0, ty0 + 24, tx0 + ticket_w, ty0 + hdr_h], fill=(255, 153, 0, 255))
    dt.line([(tx0, ty0 + hdr_h), (tx0 + ticket_w, ty0 + hdr_h)], fill=(22, 22, 22, 255), width=4)

    dt.text((tx0 + 26, ty0 + 24), "TRASH 2 CASH", fill=(255, 255, 255, 255), font=font_sm)
    dt.text((tx0 + 26, ty0 + 68), "TIKET SETOR RESMI", fill=(22, 22, 22, 255), font=font_mono)

    # Notches on side
    notch_r = 18
    notch_y = ty0 + hdr_h + 40
    # Dashed line
    for dx in range(tx0 + 36, tx0 + ticket_w - 36, 24):
        dt.line([(dx, notch_y), (dx + 12, notch_y)], fill=(180, 180, 180, 255), width=3)

    # QR Code placeholder pattern (Authentic pixel grid look)
    qr_size = 240
    qrx0 = tx0 + (ticket_w - qr_size) // 2
    qry0 = notch_y + 36
    dt.rectangle([qrx0 - 10, qry0 - 10, qrx0 + qr_size + 10, qry0 + qr_size + 10], fill=(245, 245, 240, 255), outline=(200, 200, 200, 255), width=2)
    
    # Draw Finder Patterns (Corners)
    def draw_finder(fx, fy):
        dt.rectangle([fx, fy, fx + 60, fy + 60], fill=(22, 22, 22, 255))
        dt.rectangle([fx + 10, fy + 10, fx + 50, fy + 50], fill=(255, 253, 248, 255))
        dt.rectangle([fx + 20, fy + 20, fx + 40, fy + 40], fill=(22, 22, 22, 255))

    draw_finder(qrx0 + 10, qry0 + 10)
    draw_finder(qrx0 + qr_size - 70, qry0 + 10)
    draw_finder(qrx0 + 10, qry0 + qr_size - 70)

    # Fake QR blocks
    import random
    random.seed(42)
    for row in range(12):
        for col in range(12):
            if (row < 4 and col < 4) or (row < 4 and col > 7) or (row > 7 and col < 4):
                continue
            if random.random() > 0.45:
                bx = qrx0 + 10 + col * 18
                by = qry0 + 10 + row * 18
                dt.rectangle([bx, by, bx + 16, by + 16], fill=(22, 22, 22, 255))

    # Ticket Footer Info
    dt.text((tx0 + 42, qry0 + qr_size + 30), "KODE: #TTC-8829-SETOR", fill=(22, 22, 22, 255), font=font_xs)
    dt.text((tx0 + 42, qry0 + qr_size + 62), "HUB: BUMDes Sukamaju", fill=(100, 100, 100, 255), font=font_xs)

    # Floating Verified Stamp
    stamp_w, stamp_h = 280, 52
    sx0, sy0 = tx0 + ticket_w - stamp_w - 15, ty0 + ticket_h - stamp_h - 15
    dt.rounded_rectangle([sx0, sy0, sx0 + stamp_w, sy0 + stamp_h], radius=26, fill=(0, 200, 115, 255), outline=(22, 22, 22, 255), width=3)
    dt.text((sx0 + 22, sy0 + 12), "✓ TIKET VALID", fill=(255, 255, 255, 255), font=font_sm)

    canvas2 = Image.alpha_composite(canvas2, ticket_layer)
    canvas2.save('public/assets/mascot/step-mascot-2.png', 'PNG')
    print("Step 2 mascot saved:", canvas2.size)

    # =========================================================================
    # STEP 3: Validasi Timbangan IoT Mascot (step-mascot-3.png)
    # Base: bottle-mascot.png (cute plastic bottle mascot) on modern IoT Scale
    # =========================================================================
    base3 = Image.open('public/assets/mascot/bottle-mascot.png').convert('RGBA')
    # Bounding box crop
    bbox3 = base3.getbbox()
    base3_crop = base3.crop(bbox3)

    target_h3 = 1350
    ratio3 = target_h3 / base3_crop.height
    target_w3 = int(base3_crop.width * ratio3)
    base3_up = base3_crop.resize((target_w3, target_h3), Image.Resampling.LANCZOS)

    canvas3 = Image.new('RGBA', (max(target_w3 + 300, 1200), target_h3 + 380), (0, 0, 0, 0))
    scale_y_top = target_h3 + 10
    
    # Place bottle mascot so its feet rest on the scale surface
    bx3 = (canvas3.width - target_w3) // 2
    canvas3.paste(base3_up, (bx3, 30), base3_up)

    scale_layer = Image.new('RGBA', canvas3.size, (0, 0, 0, 0))
    ds = ImageDraw.Draw(scale_layer)

    # Scale Base Dimensions
    sc_w, sc_h = 840, 220
    sc_x0 = (canvas3.width - sc_w) // 2
    sc_y0 = scale_y_top
    sc_x1 = sc_x0 + sc_w
    sc_y1 = sc_y0 + sc_h

    # Scale Shadow
    ds.rounded_rectangle([sc_x0 + 15, sc_y1 - 20, sc_x1 + 15, sc_y1 + 50], radius=35, fill=(0, 0, 0, 120))
    scale_layer = scale_layer.filter(ImageFilter.GaussianBlur(12))
    ds = ImageDraw.Draw(scale_layer)

    # 1. Scale Platform (Brushed Gunmetal / High-Tech Glass)
    ds.rounded_rectangle([sc_x0, sc_y0, sc_x1, sc_y1], radius=36, fill=(28, 36, 42, 255), outline=(22, 22, 22, 255), width=6)
    # Top edge highlight
    ds.rounded_rectangle([sc_x0 + 12, sc_y0 + 10, sc_x1 - 12, sc_y0 + 55], radius=24, fill=(48, 60, 70, 255))

    # 2. Glowing Cyan / Mint LED Display Screen
    disp_w, disp_h = 420, 100
    dx0 = (canvas3.width - disp_w) // 2
    dy0 = sc_y0 + 75
    dx1 = dx0 + disp_w
    dy1 = dy0 + disp_h
    ds.rounded_rectangle([dx0, dy0, dx1, dy1], radius=20, fill=(10, 20, 25, 255), outline=(0, 230, 200, 255), width=3)

    # LED Text: 2.40 KG • PASS ✓
    ds.text((dx0 + 38, dy0 + 16), "2.40 KG", fill=(0, 255, 220, 255), font=font_lg)
    ds.text((dx0 + 260, dy0 + 32), "PASS ✓", fill=(100, 255, 140, 255), font=font_sm)

    # Scale Status Dots
    ds.ellipse([dx0 + 20, dy0 + 44, dx0 + 30, dy0 + 54], fill=(0, 255, 220, 255))

    # 3. Floating IoT Chip / Cloud Sync Badge
    ibadge_w, ibadge_h = 480, 58
    ix0 = (canvas3.width - ibadge_w) // 2
    iy0 = sc_y1 + 10
    ds.rounded_rectangle([ix0, iy0, ix0 + ibadge_w, iy0 + ibadge_h], radius=29, fill=(0, 180, 170, 255), outline=(22, 22, 22, 255), width=3)
    ds.text((ix0 + 30, iy0 + 14), "✦ IoT SCALE VERIFIED • ZERO-TRUST", fill=(255, 255, 255, 255), font=font_xs)

    canvas3 = Image.alpha_composite(canvas3, scale_layer)
    canvas3.save('public/assets/mascot/step-mascot-3.png', 'PNG')
    print("Step 3 mascot saved:", canvas3.size)

    # =========================================================================
    # STEP 4: Klaim Saldo & Duit Mascot (step-mascot-4.png)
    # Base: trash2cash-hero-mascot.png (holding Indonesian 100k cash roll) + Floating Golden Coins & Sparkles
    # =========================================================================
    base4 = Image.open('public/assets/mascot/trash2cash-hero-mascot.png').convert('RGBA')
    bbox4 = base4.getbbox()
    base4_crop = base4.crop(bbox4)
    target_h4 = 1400
    ratio4 = target_h4 / base4_crop.height
    target_w4 = int(base4_crop.width * ratio4)
    base4_up = base4_crop.resize((target_w4, target_h4), Image.Resampling.LANCZOS)

    canvas4 = Image.new('RGBA', (target_w4 + 280, target_h4 + 160), (0, 0, 0, 0))
    canvas4.paste(base4_up, (140, 60), base4_up)

    cuan_layer = Image.new('RGBA', canvas4.size, (0, 0, 0, 0))
    dc = ImageDraw.Draw(cuan_layer)

    # 1. Floating Golden Coins
    def draw_gold_coin(cx, cy, r, rot=0):
        # Outer coin
        dc.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 210, 0, 255), outline=(180, 130, 0, 255), width=5)
        # Inner rim
        dc.ellipse([cx - r + 12, cy - r + 12, cx + r - 12, cy + r - 12], fill=(255, 230, 80, 255), outline=(210, 160, 0, 255), width=3)
        # Rp symbol
        dc.text((cx - 22, cy - 24), "Rp", fill=(160, 100, 0, 255), font=font_sm)

    # Left coin
    draw_gold_coin(110, 480, 75)
    # Right coin
    draw_gold_coin(canvas4.width - 120, 520, 85)
    # Smaller top coin
    draw_gold_coin(220, 180, 55)

    # 2. Floating Payout Badge Top
    pbadge_w, pbadge_h = 560, 72
    px0 = (canvas4.width - pbadge_w) // 2
    py0 = 20
    dc.rounded_rectangle([px0, py0, px0 + pbadge_w, py0 + pbadge_h], radius=36, fill=(255, 235, 59, 255), outline=(22, 22, 22, 255), width=4)
    dc.text((px0 + 32, py0 + 16), "💰 SALDO CAIR: Rp 148.500", fill=(22, 22, 22, 255), font=font_mono)

    # 3. Streak +1 Pill Bottom
    sbadge_w, sbadge_h = 420, 60
    sx0 = (canvas4.width - sbadge_w) // 2
    sy0 = canvas4.height - sbadge_h - 15
    dc.rounded_rectangle([sx0, sy0, sx0 + sbadge_w, sy0 + sbadge_h], radius=30, fill=(255, 60, 90, 255), outline=(22, 22, 22, 255), width=3)
    dc.text((sx0 + 36, sy0 + 14), "🔥 STREAK 6 HARI (+20%)", fill=(255, 255, 255, 255), font=font_sm)

    # Sparkle stars
    def draw_star(sx, sy, size, color=(255, 235, 100, 255)):
        dc.line([(sx - size, sy), (sx + size, sy)], fill=color, width=4)
        dc.line([(sx, sy - size), (sx, sy + size)], fill=color, width=4)
        dc.ellipse([sx - 4, sy - 4, sx + 4, sy + 4], fill=(255, 255, 255, 255))

    draw_star(160, 360, 28)
    draw_star(canvas4.width - 160, 320, 32)
    draw_star(canvas4.width - 240, 200, 22)

    canvas4 = Image.alpha_composite(canvas4, cuan_layer)
    canvas4.save('public/assets/mascot/step-mascot-4.png', 'PNG')
    print("Step 4 mascot saved:", canvas4.size)

    print("All 4 step mascots created successfully!")

if __name__ == '__main__':
    create_step_mascots()
