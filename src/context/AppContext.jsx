import React, { createContext, useContext, useState } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_QUESTS, BADGES_DATA, REWARD_MARKETPLACE, TREE_STAGES } from '../data/mockData';

const AppContext = createContext();

// Play sound effects with Web Audio API
const playSound = (type = 'coin') => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'coin') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'levelup') {
      osc.type = 'square';
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      });
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {
    // Graceful fallback
  }
};

// Android Haptic Vibration Helper
const triggerHaptic = (pattern = [30]) => {
  if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignore
    }
  }
};

export const AppProvider = ({ children }) => {
  // Auth state: Selalu mulai dari halaman login (false)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState('signin'); // 'signin' | 'signup'
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // User Profile with realistic starting balances (1 Coin = Rp 100)
  const [user, setUser] = useState({
    name: 'Budi Pratama',
    division: 'Divisi IT Innovation',
    avatar: '👨‍💼',
    rankTitle: 'Eco Warrior (Level 3)',
    level: 3,
    currentXp: 180,
    maxXp: 300,
    ecoCoins: 340, // Rp 34.000
    streakDays: 5,
    trustScore: 98,
  });

  // Environmental Impact
  const [impact, setImpact] = useState({
    totalKgTrash: 28.4,
    totalCo2Saved: 36.2,
    treesEquivalent: 4.2,
    totalDrops: 14,
  });

  // Tree state
  const [hasDewToHarvest, setHasDewToHarvest] = useState(true);

  // Active Drop Passes with realistic coin values
  const [dropPasses, setDropPasses] = useState([
    {
      id: 'DP-2026-9812',
      itemTitle: '4x Botol Plastik PET (Bersih & Pipih)',
      category: 'Plastik PET (Grade A)',
      weightKg: 0.18,
      coins: 15,
      rupiahValue: 1500,
      xp: 30,
      co2Kg: 0.36,
      status: 'VERIFIED_READY',
      createdAt: '10 Menit lalu',
      expiresAt: '23 jam lagi',
      qrCodeData: 'T2C-PASS-9812-PET4-VALID',
      cleanlinessScore: '100% Bersih'
    }
  ]);

  // Activity History (Mutasi Koin)
  const [activities, setActivities] = useState([
    {
      id: 'act_1',
      title: 'Setor 6x Kaleng Minuman',
      type: 'DROP_SUCCESS',
      coinsEarned: 35,
      rupiahEquivalent: 3500,
      xpEarned: 50,
      timestamp: 'Kemarin, 14:20',
      tag: 'Smart Bin Lt. 14'
    },
    {
      id: 'act_2',
      title: 'Tukar Voucher Fore Coffee 50%',
      type: 'REDEEM',
      coinsSpent: 150,
      timestamp: '2 Hari lalu',
      tag: 'Marketplace'
    },
    {
      id: 'act_3',
      title: 'Setor 2.5 kg Kardus Paket',
      type: 'DROP_SUCCESS',
      coinsEarned: 50,
      rupiahEquivalent: 5000,
      xpEarned: 80,
      timestamp: '3 Hari lalu',
      tag: 'Drop Point Lobby'
    }
  ]);

  // Quests
  const [quests, setQuests] = useState(INITIAL_QUESTS);

  // Badges
  const [badges, setBadges] = useState(BADGES_DATA);

  // Owned Vouchers
  const [myVouchers, setMyVouchers] = useState([
    {
      id: 'VOUCH-FORE-50-9921',
      title: 'Voucher Diskon Fore Coffee 50%',
      partner: 'Fore Coffee',
      code: 'FORE-ECO-9921',
      validUntil: '15 Sep 2026',
      used: false,
      logo: '🌿'
    }
  ]);

  // Active Bottom Sheet Modal
  const [activeBottomSheet, setActiveBottomSheet] = useState(null);

  // Active Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#0047bb', '#00d2c4', '#10b981', '#f59e0b']
    });
  };

  const addXp = (amount) => {
    setUser((prev) => {
      let newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let rankTitle = prev.rankTitle;

      if (newXp >= prev.maxXp) {
        newLevel += 1;
        newXp = newXp - prev.maxXp;
        newMaxXp = Math.round(prev.maxXp * 1.4);
        playSound('levelup');
        triggerHaptic([60, 40, 80]);
        triggerConfetti();

        if (newLevel >= 5) rankTitle = 'Planet Guardian (Level ' + newLevel + ')';
        else if (newLevel >= 4) rankTitle = 'Eco Crusher (Level ' + newLevel + ')';
        else rankTitle = 'Eco Warrior (Level ' + newLevel + ')';

        showToast(`🎉 Level Up! Naik ke Level ${newLevel} (${rankTitle})!`, 'levelup');
      }
      return {
        ...prev,
        currentXp: newXp,
        maxXp: newMaxXp,
        level: newLevel,
        rankTitle
      };
    });
  };

  // Issue Drop Pass
  const issueDropPass = (wasteItem) => {
    const newPass = {
      id: `DP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      itemTitle: wasteItem.name,
      category: wasteItem.category,
      weightKg: wasteItem.weightKg,
      coins: wasteItem.estimatedCoins,
      rupiahValue: wasteItem.estimatedCoins * 100,
      xp: wasteItem.estimatedXp,
      co2Kg: wasteItem.co2SavedKg,
      status: 'VERIFIED_READY',
      createdAt: 'Baru saja',
      expiresAt: '24 jam lagi',
      qrCodeData: `T2C-PASS-${Date.now()}-${wasteItem.id}`,
      cleanlinessScore: wasteItem.cleanliness
    };

    setDropPasses((prev) => [newPass, ...prev]);
    playSound('success');
    triggerHaptic([40]);
    showToast(`🎟️ Drop Pass Terbit! +${wasteItem.estimatedCoins} Koin (Rp ${(wasteItem.estimatedCoins * 100).toLocaleString('id-ID')}) terkunci.`);

    setActiveBottomSheet({ type: 'DROP_PASS', data: newPass });

    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'q_daily_scan' ? { ...q, current: 1, isCompleted: true } : q
      )
    );

    return newPass;
  };

  // Complete Drop
  const completeDrop = (passId) => {
    const pass = dropPasses.find((p) => p.id === passId);
    if (!pass) return;

    setDropPasses((prev) => prev.filter((p) => p.id !== passId));

    setUser((prev) => ({
      ...prev,
      ecoCoins: prev.ecoCoins + pass.coins
    }));

    addXp(pass.xp);

    setImpact((prev) => ({
      totalKgTrash: +(prev.totalKgTrash + pass.weightKg).toFixed(2),
      totalCo2Saved: +(prev.totalCo2Saved + pass.co2Kg).toFixed(2),
      treesEquivalent: +(prev.treesEquivalent + pass.co2Kg * 0.12).toFixed(1),
      totalDrops: prev.totalDrops + 1
    }));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `Setor ${pass.itemTitle}`,
        type: 'DROP_SUCCESS',
        coinsEarned: pass.coins,
        rupiahEquivalent: pass.coins * 100,
        xpEarned: pass.xp,
        timestamp: 'Baru saja',
        tag: 'Smart Bin Lt. 14'
      },
      ...prev
    ]);

    setQuests((prev) =>
      prev.map((q) =>
        q.id === 'q_daily_drop' ? { ...q, current: 1, isCompleted: true } : q
      )
    );

    playSound('coin');
    triggerHaptic([40, 60, 40]);
    triggerConfetti();
    showToast(`⚡ Koin Cair! +${pass.coins} Koin (Rp ${(pass.coins * 100).toLocaleString('id-ID')}) masuk saldo!`);
  };

  // Claim Quest
  const claimQuestReward = (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || !quest.isCompleted || quest.isClaimed) return;

    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );

    setUser((prev) => ({
      ...prev,
      ecoCoins: prev.ecoCoins + quest.rewardCoins
    }));

    addXp(quest.rewardXp);
    playSound('coin');
    triggerHaptic([40]);
    showToast(`🎁 Hadiah Misi "${quest.title}": +${quest.rewardCoins} Koin (Rp ${(quest.rewardCoins * 100).toLocaleString('id-ID')})!`);
  };

  // Redeem Reward
  const redeemReward = (reward) => {
    if (user.ecoCoins < reward.costCoins) {
      showToast(`❌ Koin tidak mencukupi! Butuh ${reward.costCoins} Koin.`, 'error');
      return false;
    }

    setUser((prev) => ({
      ...prev,
      ecoCoins: prev.ecoCoins - reward.costCoins
    }));

    const newVoucher = {
      id: `VOUCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      title: reward.title,
      partner: reward.partner,
      code: `T2C-ECO-${Math.floor(100000 + Math.random() * 900000)}`,
      validUntil: '30 Hari kedepan',
      used: false,
      logo: reward.partnerLogo
    };

    setMyVouchers((prev) => [newVoucher, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `Tukar ${reward.title}`,
        type: 'REDEEM',
        coinsSpent: reward.costCoins,
        timestamp: 'Baru saja',
        tag: 'Marketplace'
      },
      ...prev
    ]);

    playSound('success');
    triggerHaptic([40, 60]);
    showToast(`🎉 Berhasil menukar ${reward.title}!`);
    setActiveBottomSheet({ type: 'VOUCHER', data: newVoucher });
    return true;
  };

  // Harvest Dew
  const harvestDew = () => {
    if (!hasDewToHarvest) return;
    setHasDewToHarvest(false);
    setUser((prev) => ({
      ...prev,
      ecoCoins: prev.ecoCoins + 5 // Rp 500
    }));
    addXp(10);
    playSound('coin');
    triggerHaptic([30]);
    showToast('💧 Embun Pagi: +5 Koin (Rp 500) ditambahkan!');
  };

  // Daily Gift / Spin
  const applySpinReward = (prize) => {
    setUser((prev) => ({ ...prev, ecoCoins: prev.ecoCoins + prize.value }));
    playSound('coin');
    triggerHaptic([40]);
    showToast(`🎁 Bonus Harian: +${prize.value} Koin (Rp ${(prize.value * 100).toLocaleString('id-ID')})!`);
  };

  // Auth handlers
  const login = (userData = {}) => {
    setUser((prev) => ({
      ...prev,
      ...userData
    }));
    setIsAuthenticated(true);
    playSound('success');
    triggerHaptic([40, 60]);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsProfileOpen(false);
    setAuthView('signin');
    playSound('coin');
    triggerHaptic([30]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        impact,
        dropPasses,
        activities,
        quests,
        badges,
        myVouchers,
        hasDewToHarvest,
        activeBottomSheet,
        toast,
        isAuthenticated,
        authView,
        isProfileOpen,
        setIsProfileOpen,
        setAuthView,
        login,
        logout,
        setActiveBottomSheet,
        issueDropPass,
        completeDrop,
        claimQuestReward,
        redeemReward,
        harvestDew,
        applySpinReward,
        showToast,
        triggerHaptic
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
