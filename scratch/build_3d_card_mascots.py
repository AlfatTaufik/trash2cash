import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def build_3d_card_mascots():
    out_dir = 'public/assets/mascot'
    os.makedirs(out_dir, exist_ok=True)
    os.makedirs('scratch/preview_mascots', exist_ok=True)

    font_path_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    font_sm = ImageFont.truetype(font_path_bold, 28)
    font_xs = ImageFont.truetype(font_path_bold, 22)
    font_mono = ImageFont.truetype(font_path_bold, 34)
    font_lg = ImageFont.truetype(font_path_bold, 44)

    # Base 3D mascot from project
    base_raw = Image.open('public/assets/mascot/trash2cash-hero-mascot.png').convert('RGBA')
    bbox = base_raw.getbbox()
    base = base_raw.crop(bbox) # Clean crop around mascot

    # Target standard height
    TH = 1200
    TW = int(base.width * (TH / base.height))
    mascot = base.resize((TW, TH), Image.Resampling.LANCZOS)

    # =========================================================================
    # 1. CARD MASCOT 1: PILAH & SCAN AI (card-mascot-1.png)
    # 3D Mesh Bin with AI WebGPU Scanner Hologram, Target Brackets, Scan Laser
    # =========================================================================
    c1_w = TW + 240
    c1_h = TH + 160
    c1 = Image.new('RGBA', (c1_w, c1_h), (0, 0, 0, 0))
    # Paste mascot centered
    mx = (c1_w - TW) // 2
    my = 70
    c1.paste(mascot, (mx, my), mascot)

    overlay1 = Image.new('RGBA', (c1_w, c1_h), (0, 0, 0, 0))
    d1 = ImageDraw.Draw(overlay1)

    # AI Target Bounding Reticle
    rx0, ry0 = mx - 40, my + 80
    rx1, ry1 = mx + TW + 40, my + TH - 80
    corner_l = 90
    neon_mint = (0, 245, 160, 255)
    glow_mint = (0, 245, 160, 90)

    # Glow brackets
    for thick, col in [(14, glow_mint), (6, neon_mint)]:
        # Top-Left
        d1.line([(rx0, ry0), (rx0 + corner_l, ry0)], fill=col, width=thick)
        d1.line([(rx0, ry0), (rx0, ry0 + corner_l)], fill=col, width=thick)
        # Top-Right
        d1.line([(rx1, ry0), (rx1 - corner_l, ry0)], fill=col, width=thick)
        d1.line([(rx1, ry0), (rx1, ry0 + corner_l)], fill=col, width=thick)
        # Bottom-Left
        d1.line([(rx0, ry1), (rx0 + corner_l, ry1)], fill=col, width=thick)
        d1.line([(rx0, ry1), (rx0, ry1 - corner_l)], fill=col, width=thick)
        # Bottom-Right
        d1.line([(rx1, ry1), (rx1 - corner_l, ry1)], fill=col, width=thick)
        d1.line([(rx1, ry1), (rx1, ry1 - corner_l)], fill=col, width=thick)

    # Scan Laser Line across center
    laser_y = my + TH // 2 - 20
    d1.line([(rx0 - 30, laser_y), (rx1 + 30, laser_y)], fill=(0, 255, 180, 220), width=8)
    d1.line([(rx0 - 20, laser_y), (rx1 + 20, laser_y)], fill=(255, 255, 255, 255), width=3)

    # AI Telemetry Pill at top
    tp_w, tp_h = 500, 60
    tpx0 = (c1_w - tp_w) // 2
    tpy0 = ry0 - 35
    d1.rounded_rectangle([tpx0, tpy0, tpx0 + tp_w, tpy0 + tp_h], radius=30, fill=(14, 22, 18, 240), outline=(0, 245, 160, 255), width=3)
    d1.text((tpx0 + 28, tpy0 + 15), "✦ AI WEBGPU: PET_BOTTLE (98.4%)", fill=(0, 255, 170, 255), font=font_xs)

    # Step badge bottom
    sb_w, sb_h = 360, 52
    sbx0 = (c1_w - sb_w) // 2
    sby0 = ry1 + 20
    d1.rounded_rectangle([sbx0, sby0, sbx0 + sb_w, sby0 + sb_h], radius=26, fill=(0, 245, 160, 245), outline=(14, 22, 18, 255), width=3)
    d1.text((sbx0 + 36, sby0 + 13), "STEP 01 • SCAN AI SIAP ✓", fill=(14, 22, 18, 255), font=font_xs)

    c1 = Image.alpha_composite(c1, overlay1)
    c1.save('public/assets/mascot/card-mascot-1.png', 'PNG')
    print("Saved card-mascot-1.png")

    # =========================================================================
    # 2. CARD MASCOT 2: TIKET SETOR QR (card-mascot-2.png)
    # 3D Mesh Bin presenting official tactile QR Barcode Ticket Slip
    # =========================================================================
    c2_w = TW + 420
    c2_h = TH + 100
    c2 = Image.new('RGBA', (c2_w, c2_h), (0, 0, 0, 0))
    # Mascot positioned on left
    c2.paste(mascot, (30, 50), mascot)

    overlay2 = Image.new('RGBA', (c2_w, c2_h), (0, 0, 0, 0))
    d2 = ImageDraw.Draw(overlay2)

    # Tactile QR Ticket Slip on right
    t_w, t_h = 440, 580
    tx0 = c2_w - t_w - 40
    ty0 = 280

    # Drop shadow
    d2.rounded_rectangle([tx0 + 12, ty0 + 12, tx0 + t_w + 12, ty0 + t_h + 12], radius=24, fill=(0, 0, 0, 100))
    overlay2 = overlay2.filter(ImageFilter.GaussianBlur(8))
    d2 = ImageDraw.Draw(overlay2)

    # Ticket Body (Warm Cream White)
    d2.rounded_rectangle([tx0, ty0, tx0 + t_w, ty0 + t_h], radius=24, fill=(255, 254, 249, 255), outline=(22, 22, 22, 255), width=5)
    # Ticket Header (Amber Orange)
    th_h = 115
    d2.rounded_rectangle([tx0, ty0, tx0 + t_w, ty0 + th_h], radius=24, fill=(255, 145, 0, 255))
    d2.rectangle([tx0, ty0 + 20, tx0 + t_w, ty0 + th_h], fill=(255, 145, 0, 255))
    d2.line([(tx0, ty0 + th_h), (tx0 + t_w, ty0 + th_h)], fill=(22, 22, 22, 255), width=4)

    d2.text((tx0 + 24, ty0 + 18), "TRASH 2 CASH", fill=(255, 255, 255, 255), font=font_sm)
    d2.text((tx0 + 24, ty0 + 60), "TIKET SETOR RESMI", fill=(22, 22, 22, 255), font=font_mono)

    # Dashed tear line
    notch_y = ty0 + th_h + 35
    for dx in range(tx0 + 30, tx0 + t_w - 30, 22):
        d2.line([(dx, notch_y), (dx + 11, notch_y)], fill=(180, 180, 180, 255), width=3)

    # QR Code matrix
    qr_sz = 220
    qrx = tx0 + (t_w - qr_sz) // 2
    qry = notch_y + 30
    d2.rectangle([qrx - 8, qry - 8, qrx + qr_sz + 8, qry + qr_sz + 8], fill=(245, 245, 240, 255), outline=(210, 210, 210, 255), width=2)
    
    def draw_finder2(fx, fy):
        d2.rectangle([fx, fy, fx + 54, fy + 54], fill=(22, 22, 22, 255))
        d2.rectangle([fx + 9, fy + 9, fx + 45, fy + 45], fill=(255, 254, 249, 255))
        d2.rectangle([fx + 18, fy + 18, fx + 36, fy + 36], fill=(22, 22, 22, 255))

    draw_finder2(qrx + 8, qry + 8)
    draw_finder2(qrx + qr_sz - 62, qry + 8)
    draw_finder2(qrx + 8, qry + qr_sz - 62)

    import random
    random.seed(88)
    for row in range(11):
        for col in range(11):
            if (row < 4 and col < 4) or (row < 4 and col > 6) or (row > 6 and col < 4):
                continue
            if random.random() > 0.42:
                bx = qrx + 8 + col * 18
                by = qry + 8 + row * 18
                d2.rectangle([bx, by, bx + 16, by + 16], fill=(22, 22, 22, 255))

    # Details
    d2.text((tx0 + 36, qry + qr_sz + 22), "#TTC-8829-HUB-DESA", fill=(22, 22, 22, 255), font=font_xs)
    d2.text((tx0 + 36, qry + qr_sz + 52), "BUMDes Sukamaju Berkah", fill=(110, 110, 110, 255), font=font_xs)

    # Stamp
    st_w, st_h = 240, 48
    stx0 = tx0 + t_w - st_w - 18
    sty0 = ty0 + t_h - st_h - 18
    d2.rounded_rectangle([stx0, sty0, stx0 + st_w, sty0 + st_h], radius=24, fill=(0, 185, 105, 255), outline=(22, 22, 22, 255), width=3)
    d2.text((stx0 + 24, sty0 + 11), "✓ QR AKTIF", fill=(255, 255, 255, 255), font=font_sm)

    c2 = Image.alpha_composite(c2, overlay2)
    c2.save('public/assets/mascot/card-mascot-2.png', 'PNG')
    print("Saved card-mascot-2.png")

    # =========================================================================
    # 3. CARD MASCOT 3: VALIDASI TIMBANGAN IoT (card-mascot-3.png)
    # 3D Mesh Bin standing on modern IoT Scale Platform with glowing cyan LED
    # =========================================================================
    c3_w = max(TW + 280, 1200)
    c3_h = TH + 280
    c3 = Image.new('RGBA', (c3_w, c3_h), (0, 0, 0, 0))

    # Mascot placed with feet right on scale
    mx3 = (c3_w - TW) // 2
    my3 = 40
    c3.paste(mascot, (mx3, my3), mascot)

    overlay3 = Image.new('RGBA', (c3_w, c3_h), (0, 0, 0, 0))
    d3 = ImageDraw.Draw(overlay3)

    # Scale Base
    sc_w, sc_h = 860, 200
    sc_x0 = (c3_w - sc_w) // 2
    sc_y0 = my3 + TH - 35
    sc_x1 = sc_x0 + sc_w
    sc_y1 = sc_y0 + sc_h

    # Scale platform shadow
    d3.rounded_rectangle([sc_x0 + 15, sc_y1 - 15, sc_x1 + 15, sc_y1 + 45], radius=30, fill=(0, 0, 0, 110))
    overlay3 = overlay3.filter(ImageFilter.GaussianBlur(10))
    d3 = ImageDraw.Draw(overlay3)

    # Scale Body (Matte Dark Titanium)
    d3.rounded_rectangle([sc_x0, sc_y0, sc_x1, sc_y1], radius=34, fill=(28, 36, 44, 255), outline=(22, 22, 22, 255), width=5)
    # Highlight band
    d3.rounded_rectangle([sc_x0 + 12, sc_y0 + 8, sc_x1 - 12, sc_y0 + 48], radius=22, fill=(46, 58, 68, 255))

    # Digital LED Screen
    disp_w, disp_h = 420, 95
    dx0 = (c3_w - disp_w) // 2
    dy0 = sc_y0 + 68
    dx1 = dx0 + disp_w
    dy1 = dy0 + disp_h
    d3.rounded_rectangle([dx0, dy0, dx1, dy1], radius=18, fill=(10, 20, 26, 255), outline=(0, 225, 210, 255), width=3)

    # LED Text: 2.40 KG • PASS ✓
    d3.text((dx0 + 36, dy0 + 16), "2.40 KG", fill=(0, 255, 230, 255), font=font_lg)
    d3.text((dx0 + 265, dy0 + 32), "PASS ✓", fill=(90, 255, 140, 255), font=font_sm)

    # Status LED dot
    d3.ellipse([dx0 + 18, dy0 + 42, dx0 + 28, dy0 + 52], fill=(0, 255, 230, 255))

    # IoT Verified Chip Badge below
    ib_w, ib_h = 460, 52
    ibx0 = (c3_w - ib_w) // 2
    iby0 = sc_y1 + 8
    d3.rounded_rectangle([ibx0, iby0, ibx0 + ib_w, iby0 + ib_h], radius=26, fill=(0, 180, 180, 255), outline=(22, 22, 22, 255), width=3)
    d3.text((ibx0 + 36, iby0 + 12), "✦ IoT ZERO-TRUST AUDIT: VERIFIED", fill=(255, 255, 255, 255), font=font_xs)

    c3 = Image.alpha_composite(c3, overlay3)
    c3.save('public/assets/mascot/card-mascot-3.png', 'PNG')
    print("Saved card-mascot-3.png")

    # =========================================================================
    # 4. CARD MASCOT 4: KLAIM SALDO & DUIT (card-mascot-4.png)
    # 3D Mesh Bin holding giant Rp 100k cash roll + Floating 3D Gold Coins & Sparkles
    # =========================================================================
    c4_w = TW + 320
    c4_h = TH + 160
    c4 = Image.new('RGBA', (c4_w, c4_h), (0, 0, 0, 0))

    mx4 = (c4_w - TW) // 2
    my4 = 60
    c4.paste(mascot, (mx4, my4), mascot)

    overlay4 = Image.new('RGBA', (c4_w, c4_h), (0, 0, 0, 0))
    d4 = ImageDraw.Draw(overlay4)

    # Floating Golden Coins with Rp
    def draw_gold_coin4(cx, cy, r):
        d4.ellipse([cx - r + 8, cy - r + 8, cx + r + 8, cy + r + 8], fill=(0, 0, 0, 80)) # shadow
        d4.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 205, 0, 255), outline=(160, 110, 0, 255), width=5)
        d4.ellipse([cx - r + 11, cy - r + 11, cx + r - 11, cy + r - 11], fill=(255, 225, 70, 255), outline=(190, 140, 0, 255), width=3)
        d4.text((cx - 20, cy - 22), "Rp", fill=(140, 80, 0, 255), font=font_sm)

    draw_gold_coin4(120, 460, 75)
    draw_gold_coin4(c4_w - 120, 500, 85)
    draw_gold_coin4(180, 210, 52)
    draw_gold_coin4(c4_w - 170, 240, 58)

    # Top Payout Banner
    pb_w, pb_h = 540, 68
    pbx0 = (c4_w - pb_w) // 2
    pby0 = 20
    d4.rounded_rectangle([pbx0, pby0, pbx0 + pb_w, pby0 + pb_h], radius=34, fill=(255, 230, 40, 255), outline=(22, 22, 22, 255), width=4)
    d4.text((pbx0 + 34, pby0 + 16), "💰 SALDO CAIR: Rp 148.500", fill=(22, 22, 22, 255), font=font_mono)

    # Bottom Streak Pill
    stk_w, stk_h = 420, 56
    stkx0 = (c4_w - stk_w) // 2
    stky0 = c4_h - stk_h - 15
    d4.rounded_rectangle([stkx0, stky0, stkx0 + stk_w, stky0 + stk_h], radius=28, fill=(255, 50, 85, 255), outline=(22, 22, 22, 255), width=3)
    d4.text((stkx0 + 38, stky0 + 14), "🔥 STREAK 6 HARI (+20%)", fill=(255, 255, 255, 255), font=font_sm)

    # Sparkle Stars
    def draw_star4(sx, sy, sz):
        d4.line([(sx - sz, sy), (sx + sz, sy)], fill=(255, 240, 120, 255), width=4)
        d4.line([(sx, sy - sz), (sx, sy + sz)], fill=(255, 240, 120, 255), width=4)
        d4.ellipse([sx - 4, sy - 4, sx + 4, sy + 4], fill=(255, 255, 255, 255))

    draw_star4(250, 360, 24)
    draw_star4(c4_w - 240, 380, 28)
    draw_star4(c4_w // 2, 120, 20)

    c4 = Image.alpha_composite(c4, overlay4)
    c4.save('public/assets/mascot/card-mascot-4.png', 'PNG')
    print("Saved card-mascot-4.png")

    # Generate side-by-side contact sheet of the 4 3D mascots
    h = 600
    def resize_h(im, target_h):
        w = int(im.width * (target_h / im.height))
        return im.resize((w, target_h), Image.Resampling.LANCZOS)

    c1_s = resize_h(c1, h)
    c2_s = resize_h(c2, h)
    c3_s = resize_h(c3, h)
    c4_s = resize_h(c4, h)

    total_w = c1_s.width + c2_s.width + c3_s.width + c4_s.width + 100
    sheet = Image.new('RGB', (total_w, h + 80), (244, 240, 232))

    x = 20
    for m in [c1_s, c2_s, c3_s, c4_s]:
        sheet.paste(m, (x, 40), m)
        x += m.width + 20

    sheet.save('scratch/preview_mascots/contact_sheet_3d.jpg', quality=92)
    print("Saved contact_sheet_3d.jpg")

if __name__ == '__main__':
    build_3d_card_mascots()
