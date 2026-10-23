export const PRESET_WASTE_ITEMS = [
  {
    id: 'pet_bottle',
    name: '4x Botol Plastik PET (Bersih & Pipih)',
    category: 'Plastik PET (Grade A)',
    weightKg: 0.18,
    estimatedCoins: 15,
    rupiahValue: 1500,
    estimatedXp: 30,
    co2SavedKg: 0.36,
    cleanliness: '100% Bersih & Kering',
    status: 'ELIGIBLE',
    confidenceScore: 99.2,
    aiFeedback: 'Botol telah dikosongkan, dicuci bersih, dan dipipihkan sesuai standar daur ulang Bank Sampah.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    boundingInfo: 'Detected: 4x PET-1 Plastic Bottles (~0.18 kg)'
  },
  {
    id: 'cardboard_box',
    name: '2x Kardus Box Paket Belanja',
    category: 'Kertas & Karton',
    weightKg: 1.25,
    estimatedCoins: 25,
    rupiahValue: 2500,
    estimatedXp: 40,
    co2SavedKg: 1.45,
    cleanliness: '98% Kering & Rapi',
    status: 'ELIGIBLE',
    confidenceScore: 98.5,
    aiFeedback: 'Kardus kering dan sudah dilipat rapi (standar harga Rp 2.000/kg).',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    boundingInfo: 'Detected: 2x Corrugated Cardboard (~1.25 kg)'
  },
  {
    id: 'alu_cans',
    name: '6x Kaleng Soda Aluminium',
    category: 'Logam & Aluminium',
    weightKg: 0.22,
    estimatedCoins: 35,
    rupiahValue: 3500,
    estimatedXp: 50,
    co2SavedKg: 1.10,
    cleanliness: '100% Kosong & Kering',
    status: 'ELIGIBLE',
    confidenceScore: 99.8,
    aiFeedback: 'Kaleng aluminium murni berharga tinggi (standar harga Rp 15.000/kg).',
    imageUrl: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    boundingInfo: 'Detected: 6x Aluminum Cans (~0.22 kg)'
  },
  {
    id: 'ewaste_cables',
    name: '1x Keyboard Bekas + Kabel Rusak',
    category: 'E-Waste (Elektronik)',
    weightKg: 0.65,
    estimatedCoins: 50,
    rupiahValue: 5000,
    estimatedXp: 75,
    co2SavedKg: 2.80,
    cleanliness: 'Komponen Utuh / Kering',
    status: 'ELIGIBLE',
    confidenceScore: 97.4,
    aiFeedback: 'Komponen elektronik non-B3 yang memiliki tembaga dan plastik daur ulang.',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    boundingInfo: 'Detected: 1x Keyboard, 2x Copper Cables (~0.65 kg)'
  },
  {
    id: 'contaminated_box',
    name: 'Kotak Makanan Berminyak & Sisa Saus',
    category: 'Sampah Tercemar / Residu',
    weightKg: 0.30,
    estimatedCoins: 0,
    rupiahValue: 0,
    estimatedXp: 0,
    co2SavedKg: 0,
    cleanliness: '30% (Tercemar Minyak & Lemak)',
    status: 'REJECTED',
    confidenceScore: 96.1,
    aiFeedback: '❌ Ditolak Sistem: Kotak kardus basah oleh sisa minyak makanan sehingga tidak bernilai daur ulang. Saran: Pisahkan bagian yang kering atau buang ke tempat sampah residu.',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    boundingInfo: 'Detected: Heavy Oil Stains & Food Residue'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'q_daily_scan',
    type: 'DAILY',
    title: 'Inspector Sampah',
    description: 'Lakukan 1x AI Pre-Scan sampah di rumah/meja kerja.',
    rewardCoins: 5,
    rewardXp: 20,
    current: 1,
    target: 1,
    isCompleted: true,
    isClaimed: false,
    icon: 'ScanLine'
  },
  {
    id: 'q_daily_drop',
    type: 'DAILY',
    title: 'Pahlawan Setor',
    description: 'Setor minimal 1 kali di Smart Bin terdekat.',
    rewardCoins: 10,
    rewardXp: 30,
    current: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
    icon: 'PackageCheck'
  },
  {
    id: 'q_weekly_plastic',
    type: 'WEEKLY',
    title: 'Plastic Buster',
    description: 'Kumpulkan total 2.0 kg plastik minggu ini.',
    rewardCoins: 30,
    rewardXp: 60,
    current: 1.4,
    target: 2.0,
    unit: 'kg',
    isCompleted: false,
    isClaimed: false,
    icon: 'Sparkles'
  }
];

export const BADGES_DATA = [
  {
    id: 'b1',
    name: 'Pioneer Recycler',
    description: 'Langkah pertama daur ulang dengan T2C.',
    icon: '🌱',
    unlocked: true,
    unlockedAt: '12 Feb 2026'
  },
  {
    id: 'b2',
    name: 'Plastic Slayer',
    description: 'Mendaur ulang lebih dari 50 botol plastik.',
    icon: '🍾',
    unlocked: true,
    unlockedAt: '24 Feb 2026'
  },
  {
    id: 'b3',
    name: 'Streak Master 🔥',
    description: 'Mencapai 5 hari streak penyetoran tanpa putus.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: 'Hari ini'
  },
  {
    id: 'b4',
    name: 'Cardboard Crusher',
    description: 'Menyetor lebih dari 10 kg kardus paket.',
    icon: '📦',
    unlocked: false,
    progress: '7.2 / 10 kg'
  }
];

export const REWARD_MARKETPLACE = [
  {
    id: 'r_fore',
    title: 'Voucher Diskon Fore Coffee 50%',
    category: 'Food & Beverage',
    costCoins: 150,
    originalValue: 'Hemat Rp 15.000',
    partner: 'Fore Coffee',
    partnerLogo: '🌿',
    stock: 80,
    tag: 'Populer',
    description: 'Diskon 50% untuk menu Butterscotch Sea Salt Latte atau Americano.'
  },
  {
    id: 'r_kopi_kenangan',
    title: 'Voucher Kopi Kenangan 1 Cup Gratis',
    category: 'Food & Beverage',
    costCoins: 220,
    originalValue: 'Nilai Rp 22.000',
    partner: 'Kopi Kenangan',
    partnerLogo: '☕',
    stock: 62,
    tag: 'Favorit',
    description: 'Nikmati 1 cup Kopi Kenangan Mantan (R) gratis di seluruh outlet nasional.'
  },
  {
    id: 'r_flazz',
    title: 'Top Up Saldo E-Wallet Rp 25.000',
    category: 'E-Wallet',
    costCoins: 250,
    originalValue: 'Rp 25.000',
    partner: 'GoPay / OVO / DANA',
    partnerLogo: '💳',
    stock: 45,
    tag: 'Populer',
    description: 'Saldo langsung ditransfer ke akun e-wallet pilihan kamu secara instan.'
  },
  {
    id: 'r_tree_pantura',
    title: 'Adopsi & Tanam 1 Bibit Mangrove Pantura',
    category: 'ESG Donation',
    costCoins: 200,
    originalValue: 'Nilai Rp 20.000',
    partner: 'Yayasan Konservasi Alam',
    partnerLogo: '🌱',
    stock: 999,
    tag: 'Sertifikat ESG',
    description: 'Tanam 1 bibit pohon atas nama kamu lengkap dengan geo-tagging GPS & e-sertifikat.'
  },
  {
    id: 'r_gopay',
    title: 'Saldo GoPay Rp 50.000',
    category: 'E-Wallet',
    costCoins: 500,
    originalValue: 'Rp 50.000',
    partner: 'GoPay Indonesia',
    partnerLogo: '🟢',
    stock: 28,
    tag: 'Best Value',
    description: 'Voucher saldo GoPay instan untuk belanja, Gojek, atau pembayaran tagihan.'
  }
];

export const LEADERBOARD_INDIVIDUAL = [
  { rank: 1, name: 'Siti Rahmawati', division: 'Divisi Enterprise Banking', avatar: '👩‍💼', xp: 1240, coins: 620, trashKg: 42.5, level: 5 },
  { rank: 2, name: 'Andi Wijaya', division: 'Divisi IT Innovation', avatar: '👨‍💻', xp: 980, coins: 480, trashKg: 38.1, level: 4 },
  { rank: 3, name: 'Dewi Lestari', division: 'Divisi Human Capital', avatar: '👩‍🔬', xp: 820, coins: 410, trashKg: 32.7, level: 4 },
  { rank: 4, name: 'Budi Pratama (Kamu)', division: 'Divisi IT Innovation', avatar: '👨‍💼', xp: 680, coins: 340, trashKg: 28.4, level: 3, isCurrentUser: true },
  { rank: 5, name: 'Reza Pratama', division: 'Divisi Marketing & CSR', avatar: '🧑‍🎨', xp: 540, coins: 270, trashKg: 22.0, level: 3 },
  { rank: 6, name: 'Maya Anggraini', division: 'Divisi Risk Management', avatar: '👩‍💼', xp: 420, coins: 210, trashKg: 19.3, level: 2 },
];

export const LEADERBOARD_DIVISIONS = [
  { rank: 1, name: 'Divisi IT & Digital Innovation', members: 48, totalTrashKg: 384.2, co2SavedKg: 490.5, totalXp: 28400, icon: '💻', prizeBonus: '+10% Multiplier' },
  { rank: 2, name: 'Divisi Enterprise & Commercial Banking', members: 62, totalTrashKg: 341.0, co2SavedKg: 435.0, totalXp: 24900, icon: '🏦', prizeBonus: '+8% Multiplier' },
  { rank: 3, name: 'Divisi Human Capital & Culture', members: 35, totalTrashKg: 278.5, co2SavedKg: 355.2, totalXp: 20100, icon: '🤝', prizeBonus: '+5% Multiplier' },
];

export const TREE_STAGES = [
  { stage: 1, name: 'Bibit Kecil', minLevel: 1, graphic: '🌱', description: 'Bibit baru tumbuh berkat kepedulian awalmu.' },
  { stage: 2, name: 'Tunas Muda', minLevel: 2, graphic: '🌿', description: 'Tunas makin segar dengan setoran rutin.' },
  { stage: 3, name: 'Pohon Hijau', minLevel: 3, graphic: '🌳', description: 'Daun lebat dan menghasilkan embun koin harian.' },
  { stage: 4, name: 'Pohon Berbunga', minLevel: 5, graphic: '🌸🌳', description: 'Bunga bermekaran memberikan bonus 1.2x koin.' },
  { stage: 5, name: 'Guardian Tree', minLevel: 8, graphic: '✨🌳✨', description: 'Pohon Legendaris Penjaga Lingkungan!' }
];
