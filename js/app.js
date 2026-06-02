/**
 * FerahFinans - Bütünleşik Uygulama Çekirdeği (100% Manuel ve Çevrimdışı)
 * Bu dosya; Veritabanı, Tasarruf Çiçeği ve Arayüz Kontrolörünü tek bir
 * bağımsız dosyada birleştirerek, hiçbir dış ağ bağımlılığı olmadan çalışır.
 */

// =========================================================================
// === 1. LOCALSTORAGE VERİTABANI MODÜLÜ (Eski js/db.js) ===
// =========================================================================

const STORAGE_KEYS = {
  TRANSACTIONS: 'ferahfinans_transactions',
  ASSETS: 'ferahfinans_assets',
  PIN: 'ferahfinans_pin',
  NAME: 'ferahfinans_name',
  GOALS: 'ferahfinans_goals',
  IS_INITIALIZED: 'ferahfinans_initialized',
  WEALTH_GOAL: 'ferahfinans_wealth_goal'
};

const CATEGORIES = {
  INCOME: {
    salary: { label: 'Maaş', icon: 'briefcase', color: 'hsl(142, 70%, 45%)' },
    freelance: { label: 'Ek Gelir', icon: 'laptop', color: 'hsl(162, 60%, 45%)' },
    investment: { label: 'Yatırım Geliri', icon: 'trending-up', color: 'hsl(45, 85%, 50%)' },
    other_income: { label: 'Diğer Gelir', icon: 'plus-circle', color: 'hsl(180, 50%, 45%)' }
  },
  EXPENSE: {
    rent: { label: 'Kira/Ev', icon: 'home', color: 'hsl(20, 85%, 60%)' },
    groceries: { label: 'Market/Gıda', icon: 'shopping-cart', color: 'hsl(35, 90%, 55%)' },
    dining: { label: 'Yeme/İçme', icon: 'coffee', color: 'hsl(45, 80%, 50%)' },
    transport: { label: 'Ulaşım', icon: 'car', color: 'hsl(200, 75%, 60%)' },
    bills: { label: 'Faturalar', icon: 'zap', color: 'hsl(220, 80%, 60%)' },
    entertainment: { label: 'Eğlence/Hobiler', icon: 'film', color: 'hsl(280, 65%, 65%)' },
    other_expense: { label: 'Diğer Gider', icon: 'minus-circle', color: 'hsl(0, 70%, 65%)' }
  }
};

const DEFAULT_TRANSACTIONS = [
  { id: 't1', type: 'income', category: 'salary', amount: 32000, description: 'Mayıs Maaşı', date: '2026-05-31' },
  { id: 't2', type: 'income', category: 'freelance', amount: 6500, description: 'Web Tasarım Freelance', date: '2026-05-28' },
  { id: 't3', type: 'expense', category: 'rent', amount: 12000, description: 'Ev Kirası', date: '2026-05-01' },
  { id: 't4', type: 'expense', category: 'groceries', amount: 3400, description: 'Haftalık Market Alışverişi', date: '2026-05-15' },
  { id: 't5', type: 'expense', category: 'dining', amount: 1800, description: 'Hafta Sonu Akşam Yemeği', date: '2026-05-24' },
  { id: 't6', type: 'expense', category: 'transport', amount: 950, description: 'Aylık İstanbulkart Yükleme', date: '2026-05-05' },
  { id: 't7', type: 'expense', category: 'bills', amount: 1450, description: 'Elektrik, Su & İnternet', date: '2026-05-12' },
  { id: 't8', type: 'expense', category: 'entertainment', amount: 800, description: 'Konser Bileti', date: '2026-05-18' }
];

const DEFAULT_ASSETS = [
  { id: 'a1', type: 'gold', name: 'Gram Altın', quantity: 15, avgPrice: 2380, currentPrice: 2445 },
  { id: 'a2', type: 'gold', name: 'Çeyrek Altın', quantity: 4, avgPrice: 3920, currentPrice: 4030 },
  { id: 'a3', type: 'silver', name: 'Gümüş (gr)', quantity: 120, avgPrice: 30.20, currentPrice: 32.10 },
  { id: 'a4', type: 'stock', name: 'TÜPRAŞ (TUPRS)', quantity: 50, avgPrice: 282, currentPrice: 296 },
  { id: 'a5', type: 'stock', name: 'Ereğli Demir Çelik (EREGL)', quantity: 100, avgPrice: 47.50, currentPrice: 51.20 },
  { id: 'a6', type: 'fund', name: 'Marmara Capital Hisse Fonu (MAC)', quantity: 1500, avgPrice: 6.80, currentPrice: 7.24 },
  { id: 'a7', type: 'fund', name: 'İş Portföy BIST 100 Endeks Fonu (TI3)', quantity: 2000, avgPrice: 4.20, currentPrice: 4.56 }
];

const DEFAULT_GOALS = [
  { id: 'g1', name: 'Acil Durum Fonu', targetAmount: 100000, currentAmount: 45000 },
  { id: 'g2', name: 'Ege Tatili', targetAmount: 30000, currentAmount: 18000 }
];

function initDatabase() {
  if (!localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(DEFAULT_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(DEFAULT_ASSETS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(DEFAULT_GOALS));
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
    console.log('FerahFinans veritabanı başarıyla varsayılan verilerle başlatıldı.');
  }
}

function getUserName() {
  const name = localStorage.getItem(STORAGE_KEYS.NAME);
  if (!name) return '';
  try {
    return JSON.parse(name);
  } catch (e) {
    return name;
  }
}

function setUserName(name) {
  if (!name || name.trim().length === 0) {
    throw new Error('Geçersiz isim!');
  }
  localStorage.setItem(STORAGE_KEYS.NAME, JSON.stringify(name.trim()));
  return true;
}

function getPin() {
  const pin = localStorage.getItem(STORAGE_KEYS.PIN);
  if (!pin) return null;
  try {
    return JSON.parse(pin);
  } catch (e) {
    return pin;
  }
}

function setPin(newPin) {
  if (!newPin || newPin.length !== 4 || isNaN(newPin)) {
    throw new Error('Geçersiz PIN kodu! PIN 4 haneli bir sayı olmalıdır.');
  }
  localStorage.setItem(STORAGE_KEYS.PIN, JSON.stringify(newPin));
  return true;
}

function checkHasPin() {
  const pin = getPin();
  const name = getUserName();
  return pin !== null && name !== '';
}

function getTransactions() {
  initDatabase();
  const txs = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return txs ? JSON.parse(txs) : [];
}

function addTransaction(transaction) {
  const txs = getTransactions();
  const newTx = {
    id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    date: new Date().toISOString().split('T')[0],
    ...transaction
  };
  txs.push(newTx);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  return newTx;
}

function deleteTransaction(id) {
  let txs = getTransactions();
  txs = txs.filter(tx => tx.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  return true;
}

function getWealthGoal() {
  const goal = localStorage.getItem(STORAGE_KEYS.WEALTH_GOAL);
  if (!goal) return 10000000; // Varsayılan 10 Milyon TL
  return parseFloat(goal) || 10000000;
}

function setWealthGoal(amount) {
  const val = parseFloat(amount);
  if (isNaN(val) || val < 1000) {
    throw new Error('Geçersiz hedef tutarı! Hedef en az 1000 ₺ olmalıdır.');
  }
  localStorage.setItem(STORAGE_KEYS.WEALTH_GOAL, val.toString());
  return true;
}

function getAssets() {
  initDatabase();
  const assetsStr = localStorage.getItem(STORAGE_KEYS.ASSETS);
  return assetsStr ? JSON.parse(assetsStr) : [];
}

function addAsset(asset) {
  const assets = getAssets();
  const newAsset = {
    id: 'ast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    ...asset
  };
  assets.push(newAsset);
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  return newAsset;
}

function updateAsset(id, data) {
  const assets = getAssets();
  const index = assets.findIndex(a => a.id === id);
  if (index !== -1) {
    assets[index] = {
      ...assets[index],
      ...data,
      quantity: parseFloat(data.quantity),
      avgPrice: parseFloat(data.avgPrice),
      currentPrice: parseFloat(data.currentPrice)
    };
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    return assets[index];
  }
  return null;
}

function deleteAsset(id) {
  let assets = getAssets();
  assets = assets.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  return true;
}

function resetSystem() {
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.ASSETS);
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.PIN);
  localStorage.removeItem(STORAGE_KEYS.NAME);
  localStorage.removeItem(STORAGE_KEYS.IS_INITIALIZED);
  localStorage.removeItem(STORAGE_KEYS.WEALTH_GOAL);
  initDatabase();
}

// =========================================================================
// === 2. TASARRUF ÇİÇEĞİ MODÜLÜ (Eski js/plant.js) ===
// =========================================================================

function getPlantStatus(savingsRate) {
  if (savingsRate <= 0) {
    return {
      stage: 0,
      title: 'Toprak Hazırlanıyor',
      message: 'Bu ay bütçen biraz dengede değil gibi. Ufak bir tasarrufla tohumu canlandırmaya ne dersin?',
      color: 'var(--text-muted)',
      icon: 'sprout-seed'
    };
  }
  if (savingsRate <= 10) {
    return {
      stage: 1,
      title: 'İlk Filizlenme',
      message: 'Harika, tohumumuz çatladı! İlk yeşil filiz topraktan başını gösterdi. Küçük adımlar büyük sonuçlar doğurur.',
      color: 'hsl(142, 60%, 60%)',
      icon: 'sprout-1'
    };
  }
  if (savingsRate <= 25) {
    return {
      stage: 2,
      title: 'Kök Salma',
      message: 'Filizin büyüyor! Tasarruf alışkanlığın kök saldı ve yapraklar belirdi. Nane kokusu ferahlık vermeye başladı.',
      color: 'hsl(142, 65%, 45%)',
      icon: 'sprout-2'
    };
  }
  if (savingsRate <= 45) {
    return {
      stage: 3,
      title: 'Gürleşen Nane',
      message: 'Muhteşem! Nane bitkin gürleşti ve yeni dallar verdi. Bütçeni harika yönetiyorsun, ferahlık seninle!',
      color: 'hsl(142, 70%, 35%)',
      icon: 'sprout-3'
    };
  }
  if (savingsRate <= 60) {
    return {
      stage: 4,
      title: 'Çiçek Açan Nane',
      message: 'Tebrikler! Tasarruf çiçeğin bembeyaz çiçekler açtı. Tasarrufun meyvelerini vermeye hazır.',
      color: 'hsl(150, 80%, 30%)',
      icon: 'sprout-4'
    };
  }
  return {
    stage: 5,
    title: 'Altın Nane Bahçesi',
    message: 'Olağanüstü! Gelirinin yarıdan fazlasını biriktirdin. Tasarruf çiçeğin altın rengi ışıklar saçarak parlıyor!',
    color: 'hsl(45, 90%, 50%)',
    icon: 'sprout-gold'
  };
}

function renderPlantSVG(stage) {
  const getStageSVG = () => {
    switch (stage) {
      case 0:
        return `
          <ellipse cx="100" cy="150" rx="40" ry="12" fill="rgba(121, 85, 72, 0.2)" />
          <ellipse cx="100" cy="148" rx="25" ry="8" fill="var(--color-sage)" opacity="0.6" />
          <circle cx="100" cy="142" r="5" fill="#8d6e63" class="pulse-anim" />
          <path d="M100 142 Q 102 138 100 135" stroke="#a1887f" stroke-width="1.5" fill="none" />
        `;
      case 1:
        return `
          <ellipse cx="100" cy="150" rx="42" ry="12" fill="rgba(121, 85, 72, 0.2)" />
          <ellipse cx="100" cy="148" rx="28" ry="8" fill="var(--color-sage)" opacity="0.6" />
          <path d="M100 148 Q 100 130 95 120" stroke="hsl(142, 60%, 45%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M95 120 C 88 115, 82 120, 95 120 Z" fill="hsl(142, 55%, 50%)" class="grow-leaf-anim" />
          <path d="M95 120 C 98 112, 106 115, 95 120 Z" fill="hsl(142, 60%, 55%)" class="grow-leaf-anim" />
        `;
      case 2:
        return `
          <ellipse cx="100" cy="150" rx="45" ry="12" fill="rgba(121, 85, 72, 0.2)" />
          <ellipse cx="100" cy="148" rx="30" ry="8" fill="var(--color-sage)" opacity="0.6" />
          <path d="M100 148 Q 102 125 96 100" stroke="hsl(142, 65%, 40%)" stroke-width="3.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M99 125 C 85 120, 85 130, 99 125 Z" fill="hsl(142, 60%, 48%)" class="grow-leaf-anim" />
          <path d="M100 120 C 115 116, 112 126, 100 120 Z" fill="hsl(142, 60%, 48%)" class="grow-leaf-anim" />
          <path d="M96 100 C 86 92, 88 103, 96 100 Z" fill="hsl(142, 65%, 52%)" class="grow-leaf-anim" />
          <path d="M96 100 C 104 90, 108 98, 96 100 Z" fill="hsl(142, 68%, 56%)" class="grow-leaf-anim" />
        `;
      case 3:
        return `
          <ellipse cx="100" cy="150" rx="45" ry="12" fill="rgba(121, 85, 72, 0.2)" />
          <ellipse cx="100" cy="148" rx="32" ry="8" fill="var(--color-sage)" opacity="0.6" />
          <path d="M100 148 Q 98 115 102 75" stroke="hsl(142, 70%, 35%)" stroke-width="4" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M99 120 Q 80 110 70 102" stroke="hsl(142, 70%, 35%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M100 105 Q 115 95 125 90" stroke="hsl(142, 70%, 35%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M70 102 C 58 98, 62 108, 70 102 Z" fill="hsl(142, 60%, 45%)" class="grow-leaf-anim" />
          <path d="M70 102 C 72 92, 80 96, 70 102 Z" fill="hsl(142, 65%, 48%)" class="grow-leaf-anim" />
          <path d="M125 90 C 137 86, 134 96, 125 90 Z" fill="hsl(142, 60%, 45%)" class="grow-leaf-anim" />
          <path d="M125 90 C 122 80, 115 84, 125 90 Z" fill="hsl(142, 65%, 48%)" class="grow-leaf-anim" />
          <path d="M102 75 C 90 68, 92 78, 102 75 Z" fill="hsl(142, 70%, 42%)" class="grow-leaf-anim" />
          <path d="M102 75 C 112 66, 116 74, 102 75 Z" fill="hsl(142, 72%, 46%)" class="grow-leaf-anim" />
          <path d="M100 95 C 88 92, 86 102, 100 95 Z" fill="hsl(142, 65%, 40%)" class="grow-leaf-anim" />
          <path d="M100 95 C 112 88, 114 98, 100 95 Z" fill="hsl(142, 65%, 40%)" class="grow-leaf-anim" />
        `;
      case 4:
        return `
          <ellipse cx="100" cy="150" rx="45" ry="12" fill="rgba(121, 85, 72, 0.2)" />
          <path d="M100 148 Q 97 105 103 60" stroke="hsl(142, 75%, 28%)" stroke-width="4.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M99 115 Q 75 105 65 92" stroke="hsl(142, 75%, 28%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M100 95 Q 120 85 130 75" stroke="hsl(142, 75%, 28%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M65 92 C 52 88, 56 98, 65 92 Z" fill="hsl(142, 60%, 40%)" class="grow-leaf-anim" />
          <path d="M65 92 C 67 80, 78 84, 65 92 Z" fill="hsl(142, 65%, 45%)" class="grow-leaf-anim" />
          <path d="M130 75 C 142 71, 140 81, 130 75 Z" fill="hsl(142, 60%, 40%)" class="grow-leaf-anim" />
          <path d="M130 75 C 127 63, 118 69, 130 75 Z" fill="hsl(142, 65%, 45%)" class="grow-leaf-anim" />
          <path d="M103 60 C 90 52, 92 64, 103 60 Z" fill="hsl(142, 70%, 38%)" class="grow-leaf-anim" />
          <path d="M103 60 C 114 50, 118 58, 103 60 Z" fill="hsl(142, 72%, 42%)" class="grow-leaf-anim" />
          <circle cx="103" cy="55" r="3.5" fill="#FFFFFF" stroke="hsl(142, 40%, 80%)" stroke-width="0.5" class="fade-in-flower" />
          <circle cx="98" cy="56" r="2.5" fill="#FFFFFF" stroke="hsl(142, 40%, 80%)" stroke-width="0.5" class="fade-in-flower" />
          <circle cx="107" cy="57" r="2.5" fill="#FFFFFF" stroke="hsl(142, 40%, 80%)" stroke-width="0.5" class="fade-in-flower" />
          <circle cx="63" cy="87" r="3" fill="#FFFFFF" stroke="hsl(142, 40%, 80%)" stroke-width="0.5" class="fade-in-flower" />
          <circle cx="132" cy="70" r="3" fill="#FFFFFF" stroke="hsl(142, 40%, 80%)" stroke-width="0.5" class="fade-in-flower" />
        `;
      case 5:
        return `
          <ellipse cx="100" cy="150" rx="45" ry="12" fill="rgba(255, 213, 79, 0.2)" />
          <circle cx="100" cy="95" r="50" fill="url(#goldGlow)" opacity="0.15" class="glow-pulse" />
          <path d="M100 148 Q 97 105 103 60" stroke="hsl(45, 90%, 40%)" stroke-width="5" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M99 115 Q 75 105 65 92" stroke="hsl(45, 90%, 40%)" stroke-width="3.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M100 95 Q 120 85 130 75" stroke="hsl(45, 90%, 40%)" stroke-width="3.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M65 92 C 48 88, 52 102, 65 92 Z" fill="hsl(45, 95%, 55%)" class="grow-leaf-anim" />
          <path d="M65 92 C 67 76, 82 80, 65 92 Z" fill="hsl(45, 100%, 65%)" class="grow-leaf-anim" />
          <path d="M130 75 C 147 70, 142 84, 130 75 Z" fill="hsl(45, 95%, 55%)" class="grow-leaf-anim" />
          <path d="M130 75 C 126 59, 114 65, 130 75 Z" fill="hsl(45, 100%, 65%)" class="grow-leaf-anim" />
          <path d="M103 60 C 86 50, 88 66, 103 60 Z" fill="hsl(45, 95%, 50%)" class="grow-leaf-anim" />
          <path d="M103 60 C 116 46, 122 56, 103 60 Z" fill="hsl(45, 100%, 60%)" class="grow-leaf-anim" />
          <path d="M103 38 L 105 43 L 110 43 L 106 46 L 108 51 L 103 48 L 98 51 L 100 46 L 96 43 L 101 43 Z" fill="#FFD54F" class="sparkle-anim" />
          <circle cx="50" cy="80" r="1.5" fill="#FFD54F" class="sparkle-anim-fast" />
          <circle cx="150" cy="65" r="2" fill="#FFD54F" class="sparkle-anim-slow" />
          <circle cx="85" cy="50" r="1.5" fill="#FFD54F" class="sparkle-anim-fast" />
          <circle cx="120" cy="110" r="2.5" fill="#FFD54F" class="sparkle-anim" />
        `;
    }
  };

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180" width="100%" height="100%" class="plant-svg">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD54F" stop-opacity="1" />
          <stop offset="100%" stop-color="#FF8F00" stop-opacity="0" />
        </radialGradient>
      </defs>
      <path d="M70 148 L 74 172 C 75 175, 78 178, 81 178 L 119 178 C 122 178, 125 175, 126 172 L 130 148 Z" fill="var(--color-card-bg)" stroke="var(--color-sage)" stroke-width="1.5" opacity="0.9" />
      <path d="M66 148 L 134 148 C 136 148, 137 146, 137 144 L 137 142 C 137 140, 136 138, 134 138 L 66 138 C 64 138, 63 140, 63 142 L 63 144 C 63 146, 64 148, 66 148 Z" fill="var(--color-sage)" opacity="0.8" />
      ${getStageSVG()}
    </svg>
  `;
}

function triggerWateringAnimation(containerElement) {
  if (!containerElement) return;
  const oldDrop = containerElement.querySelector('.water-drop');
  if (oldDrop) oldDrop.remove();

  const drop = document.createElement('div');
  drop.className = 'water-drop';
  drop.innerHTML = `
    <svg viewBox="0 0 30 42" width="20" height="28" fill="hsl(200, 85%, 60%)">
      <path d="M15 3 C 15 3, 3 20, 3 28 C 3 34, 8 40, 15 40 C 22 40, 27 34, 27 28 C 27 20, 15 3, 15 3 Z" />
    </svg>
  `;
  drop.style.position = 'absolute';
  drop.style.top = '10%';
  drop.style.left = 'calc(50% - 10px)';
  drop.style.zIndex = '10';
  drop.style.opacity = '1';
  drop.style.transform = 'translateY(0)';
  drop.style.transition = 'transform 1.2s cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 1.2s ease-in-out';
  
  containerElement.appendChild(drop);
  
  setTimeout(() => {
    drop.style.transform = 'translateY(110px) scaleY(0.9)';
    setTimeout(() => {
      drop.style.opacity = '0';
      
      const splash = document.createElement('div');
      splash.className = 'water-splash';
      splash.style.position = 'absolute';
      splash.style.top = '78%';
      splash.style.left = 'calc(50% - 15px)';
      splash.style.width = '30px';
      splash.style.height = '15px';
      splash.style.borderRadius = '50%';
      splash.style.border = '2px solid hsl(200, 85%, 65%)';
      splash.style.transform = 'scale(0.1)';
      splash.style.opacity = '1';
      splash.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      containerElement.appendChild(splash);
      
      setTimeout(() => {
        splash.style.transform = 'scale(1.5)';
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }, 50);

      const plantSvg = containerElement.querySelector('.plant-svg');
      if (plantSvg) {
        plantSvg.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        plantSvg.style.transform = 'scale(1.08)';
        setTimeout(() => {
          plantSvg.style.transform = 'scale(1)';
        }, 400);
      }
      
      setTimeout(() => drop.remove(), 1200);
    }, 1100);
  }, 50);
}

function getWealthTreeStatus(percent) {
  if (percent <= 5) {
    return {
      stage: 0,
      title: 'Toprak Hazırlanıyor 🌱',
      message: 'Hayalinizdeki finansal geleceğin tohumunu toprakla buluşturduk. İlk birikimlerinizle bu tohum canlanacak!'
    };
  }
  if (percent <= 20) {
    return {
      stage: 1,
      title: 'İlk Fidan Belirdi 🌿',
      message: 'Tebrikler! Birikim fidanınız topraktan başını uzattı. Küçük adımların büyük ormanlara dönüştüğünün ilk kanıtı!'
    };
  }
  if (percent <= 45) {
    return {
      stage: 2,
      title: 'Dallanan Genç Ağaç 🌳',
      message: 'Harika! Ağacınız dallanıp budaklanıyor. Finansal durumunuz kök salmaya ve güçlenmeye başladı.'
    };
  }
  if (percent <= 70) {
    return {
      stage: 3,
      title: 'Gür Yapraklı Ağaç 🌲',
      message: 'Muazzam gidiyorsunuz! Gür ve gölgeli ağacınız bütçenizin ne kadar güvende olduğunu simgeliyor. Finansal koruma kalkanınız hazır!'
    };
  }
  if (percent <= 95) {
    return {
      stage: 4,
      title: 'Çiçek Açan Ağaç 🌸',
      message: 'Olağanüstü! Birikim ağacınız rengarenk çiçeklerle doldu. Büyük hedefinizin meyvelerini almaya çok ama çok az kaldı!'
    };
  }
  return {
    stage: 5,
    title: 'Altın Meyve Ağacı 🍎✨',
    message: 'Tebrikler! Hayalinizi başardınız! Ağacınız altın ışıltılarıyla parlıyor ve kırmızı olgun elmalarla dolup taşıyor!'
  };
}

function renderWealthTreeSVG(stage) {
  const getStageSVG = () => {
    switch (stage) {
      case 0: // Tohum
        return `
          <ellipse cx="100" cy="150" rx="35" ry="10" fill="rgba(121, 85, 72, 0.25)" />
          <circle cx="100" cy="144" r="6" fill="#5d4037" />
          <path d="M100 144 Q 102 135 99 128" stroke="#8d6e63" stroke-width="2" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M99 128 Q 94 122 92 125" stroke="hsl(142, 60%, 50%)" stroke-width="1.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
        `;
      case 1: // Fidan
        return `
          <ellipse cx="100" cy="150" rx="38" ry="10" fill="rgba(121, 85, 72, 0.25)" />
          <path d="M100 148 C 100 130 96 115 97 105" stroke="hsl(142, 50%, 35%)" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
          <path d="M97 105 C 88 100, 84 105, 97 105 Z" fill="hsl(142, 60%, 48%)" class="grow-leaf-anim" />
          <path d="M97 105 C 106 98, 110 102, 97 105 Z" fill="hsl(142, 65%, 52%)" class="grow-leaf-anim" />
          <path d="M98 122 C 106 118, 110 122, 98 122 Z" fill="hsl(142, 55%, 45%)" class="grow-leaf-anim" />
        `;
      case 2: // Genç Ağaç
        return `
          <g class="sway-anim">
            <ellipse cx="100" cy="150" rx="42" ry="10" fill="rgba(121, 85, 72, 0.25)" />
            <path d="M96 148 L 98 115 C 99 110 97 105 95 100 L 90 90" stroke="#5d4037" stroke-width="4.5" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M98 115 Q 112 105 118 95" stroke="#5d4037" stroke-width="3" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <circle cx="90" cy="85" r="16" fill="hsl(142, 55%, 40%)" class="grow-leaf-anim" />
            <circle cx="118" cy="92" r="14" fill="hsl(142, 50%, 45%)" class="grow-leaf-anim" />
            <circle cx="102" cy="74" r="12" fill="hsl(142, 60%, 42%)" class="grow-leaf-anim" />
          </g>
        `;
      case 3: // Gür Yapraklı Ağaç
        return `
          <g class="sway-anim">
            <ellipse cx="100" cy="150" rx="45" ry="11" fill="rgba(121, 85, 72, 0.25)" />
            <path d="M95 148 L 97 115 C 98 102 92 90 85 80" stroke="#4e342e" stroke-width="7" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M97 112 Q 115 102 122 88" stroke="#4e342e" stroke-width="5" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M94 98 Q 80 90 74 76" stroke="#4e342e" stroke-width="4" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <circle cx="82" cy="74" r="26" fill="hsl(142, 65%, 32%)" class="grow-leaf-anim" />
            <circle cx="120" cy="82" r="24" fill="hsl(142, 55%, 36%)" class="grow-leaf-anim" />
            <circle cx="102" cy="62" r="28" fill="hsl(142, 60%, 38%)" class="grow-leaf-anim" />
            <circle cx="68" cy="85" r="20" fill="hsl(142, 65%, 30%)" class="grow-leaf-anim" />
            <circle cx="132" cy="90" r="18" fill="hsl(142, 50%, 40%)" class="grow-leaf-anim" />
          </g>
        `;
      case 4: // Çiçek Açan Ağaç
        return `
          <g class="sway-anim">
            <ellipse cx="100" cy="150" rx="45" ry="11" fill="rgba(121, 85, 72, 0.25)" />
            <path d="M95 148 L 97 115 C 98 102 92 90 85 80" stroke="#4e342e" stroke-width="7" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M97 112 Q 115 102 122 88" stroke="#4e342e" stroke-width="5" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M94 98 Q 80 90 74 76" stroke="#4e342e" stroke-width="4" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <circle cx="82" cy="74" r="26" fill="hsl(142, 65%, 32%)" class="grow-leaf-anim" />
            <circle cx="120" cy="82" r="24" fill="hsl(142, 55%, 36%)" class="grow-leaf-anim" />
            <circle cx="102" cy="62" r="28" fill="hsl(142, 60%, 38%)" class="grow-leaf-anim" />
            <circle cx="68" cy="85" r="20" fill="hsl(142, 65%, 30%)" class="grow-leaf-anim" />
            <circle cx="132" cy="90" r="18" fill="hsl(142, 50%, 40%)" class="grow-leaf-anim" />
            
            <g class="bloom-flower-anim">
              <circle cx="82" cy="64" r="5" fill="#fbcfe8" stroke="#f472b6" stroke-width="0.5" />
              <circle cx="82" cy="64" r="2" fill="#fcd34d" />
              
              <circle cx="112" cy="74" r="6" fill="#fbcfe8" stroke="#f472b6" stroke-width="0.5" />
              <circle cx="112" cy="74" r="2.5" fill="#fcd34d" />
              
              <circle cx="98" cy="52" r="5" fill="#ffffff" stroke="#f472b6" stroke-width="0.5" />
              <circle cx="98" cy="52" r="2" fill="#fcd34d" />
              
              <circle cx="62" cy="80" r="6" fill="#ffffff" stroke="#f472b6" stroke-width="0.5" />
              <circle cx="62" cy="80" r="2.5" fill="#fcd34d" />
              
              <circle cx="130" cy="85" r="5" fill="#fbcfe8" stroke="#f472b6" stroke-width="0.5" />
              <circle cx="130" cy="85" r="2" fill="#fcd34d" />
            </g>
          </g>
        `;
      case 5: // Meyveli Altın Ağaç
        return `
          <defs>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFD54F" stop-opacity="1" />
              <stop offset="100%" stop-color="#FF8F00" stop-opacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="80" r="60" fill="url(#goldGlow)" opacity="0.25" class="glow-gold-pulse" />
          <g class="sway-anim">
            <ellipse cx="100" cy="150" rx="48" ry="11" fill="rgba(255, 213, 79, 0.2)" />
            <path d="M95 148 L 97 115 C 98 102 92 90 85 80" stroke="#4e342e" stroke-width="7" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M97 112 Q 115 102 122 88" stroke="#4e342e" stroke-width="5" stroke-linecap="round" fill="none" class="draw-path-anim" />
            <path d="M94 98 Q 80 90 74 76" stroke="#4e342e" stroke-width="4" stroke-linecap="round" fill="none" class="draw-path-anim" />
            
            <circle cx="82" cy="74" r="26" fill="hsl(142, 70%, 30%)" class="grow-leaf-anim" />
            <circle cx="120" cy="82" r="24" fill="hsl(142, 60%, 34%)" class="grow-leaf-anim" />
            <circle cx="102" cy="62" r="28" fill="hsl(142, 65%, 35%)" class="grow-leaf-anim" />
            <circle cx="68" cy="85" r="20" fill="hsl(142, 70%, 28%)" class="grow-leaf-anim" />
            <circle cx="132" cy="90" r="18" fill="hsl(142, 55%, 38%)" class="grow-leaf-anim" />
            
            <g class="grow-apple-anim">
              <circle cx="80" cy="82" r="7" fill="#ef4444" />
              <path d="M80 75 Q 81 72 83 74" stroke="#5d4037" stroke-width="1.5" fill="none" />
              <rect x="80" y="78" width="1.5" height="1.5" fill="#fca5a5" rx="0.5" />
              
              <circle cx="120" cy="78" r="7.5" fill="#dc2626" />
              <path d="M120 70.5 Q 121 68 123 70" stroke="#5d4037" stroke-width="1.5" fill="none" />
              <rect x="120" y="74.5" width="1.5" height="1.5" fill="#fca5a5" rx="0.5" />
              
              <circle cx="100" cy="90" r="8" fill="#b91c1c" />
              <path d="M100 82 Q 101 79 103 81" stroke="#5d4037" stroke-width="1.5" fill="none" />
              <rect x="100" y="86" width="2" height="2" fill="#fca5a5" rx="0.5" />
              
              <circle cx="66" cy="92" r="7.5" fill="#ef4444" />
              <path d="M66 84.5 Q 67 82 69 84" stroke="#5d4037" stroke-width="1.5" fill="none" />
              
              <circle cx="135" cy="96" r="7" fill="#ef4444" />
              <path d="M135 89 Q 136 86 138 88" stroke="#5d4037" stroke-width="1.5" fill="none" />
            </g>

            <g>
              <path d="M50 50 L 52 54 L 56 54 L 53 56 L 55 60 L 50 58 L 45 60 L 47 56 L 44 54 L 48 54 Z" fill="#fcd34d" class="sparkle-anim" />
              <path d="M150 40 L 151.5 43 L 155 43 L 152 45 L 153.5 48 L 150 46.5 L 146.5 48 L 148 45 L 145 43 L 148.5 43 Z" fill="#fcd34d" class="sparkle-anim-fast" />
              <path d="M100 32 L 101.5 35 L 105 35 L 102 37 L 103.5 40 L 100 38.5 L 96.5 40 L 98 37 L 95 35 L 98.5 35 Z" fill="#fcd34d" class="sparkle-anim-slow" />
              <circle cx="75" cy="40" r="1.5" fill="#fcd34d" class="sparkle-anim-fast" />
              <circle cx="125" cy="48" r="2" fill="#fcd34d" class="sparkle-anim" />
            </g>
          </g>
        `;
    }
  };

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 180" width="100%" height="100%" class="plant-svg">
      <defs>
        <radialGradient id="soilGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#8d6e63" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#8d6e63" stop-opacity="0" />
        </radialGradient>
      </defs>
      <path d="M66 148 L 134 148 C 136 148, 137 146, 137 144 L 137 142 C 137 140, 136 138, 134 138 L 66 138 C 64 138, 63 140, 63 142 L 63 144 C 63 146, 64 148, 66 148 Z" fill="var(--color-sage)" opacity="0.8" />
      <path d="M70 148 L 74 172 C 75 175, 78 178, 81 178 L 119 178 C 122 178, 125 175, 126 172 L 130 148 Z" fill="var(--color-card-bg)" stroke="var(--color-sage)" stroke-width="1.5" opacity="0.9" />
      ${getStageSVG()}
    </svg>
  `;
}

// =========================================================================
// === 3. ANA PROGRAM KOORDİNATÖRÜ (Eski js/app.js) ===
// =========================================================================

const state = {
  currentScreen: 'screen-dashboard',
  enteredPin: '',
  isLocked: true,
  txFilter: 'all',
  charts: {
    bar: null,
    donut: null
  },
  lastActivityTime: Date.now()
};

document.addEventListener('DOMContentLoaded', () => {
  initDatabase();
  lucide.createIcons();
  updateLiveClock();
  setInterval(updateLiveClock, 30000);
  
  setupSecurity();
  registerEvents();
  
  setInterval(checkInactivityLock, 15000);
  document.addEventListener('mousemove', resetActivityTimer);
  document.addEventListener('keypress', resetActivityTimer);
  document.addEventListener('click', resetActivityTimer);
  document.addEventListener('touchstart', resetActivityTimer);
});

function updateLiveClock() {
  const liveTimeEl = document.getElementById('live-time');
  if (liveTimeEl) {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    liveTimeEl.textContent = `${hours}:${minutes}`;
  }
}

function setupSecurity() {
  const userName = getUserName();
  const titleText = document.getElementById('pin-title-text');
  const subtitleText = document.getElementById('pin-subtitle-text');
  const nameSetupContainer = document.getElementById('pin-name-setup-container');
  const dotsAndKeypadContainer = document.getElementById('pin-dots-and-keypad');
  
  if (!userName) {
    titleText.textContent = "FerahFinans'a Hoş Geldiniz";
    subtitleText.textContent = 'Lütfen devam etmek için isminizi girin';
    nameSetupContainer.style.display = 'block';
    dotsAndKeypadContainer.style.display = 'none';
  } else if (!getPin()) {
    titleText.textContent = 'Yeni PIN Belirleyin';
    subtitleText.textContent = `Merhaba ${userName}, uygulamaya güvenli girmek için 4 haneli bir PIN oluşturun`;
    nameSetupContainer.style.display = 'none';
    dotsAndKeypadContainer.style.display = 'flex';
  } else {
    titleText.textContent = 'FerahFinans';
    subtitleText.textContent = `Merhaba ${userName}, devam etmek için PIN kodunuzu girin`;
    nameSetupContainer.style.display = 'none';
    dotsAndKeypadContainer.style.display = 'flex';
  }
  
  state.isLocked = true;
  state.enteredPin = '';
  updatePinDots();
}

function handlePinKeyPress(num) {
  if (state.enteredPin.length < 4) {
    state.enteredPin += num;
    updatePinDots();
    if (state.enteredPin.length === 4) {
      setTimeout(verifyEnteredPin, 250);
    }
  }
}

function updatePinDots() {
  const dots = document.querySelectorAll('#pin-dots .pin-dot');
  dots.forEach((dot, idx) => {
    if (idx < state.enteredPin.length) {
      dot.classList.add('filled');
      dot.classList.remove('error');
    } else {
      dot.classList.remove('filled');
      dot.classList.remove('error');
    }
  });
}

function verifyEnteredPin() {
  const savedPin = getPin();
  const dots = document.querySelectorAll('#pin-dots .pin-dot');
  
  if (!savedPin) {
    setPin(state.enteredPin);
    alert(`Hoş geldin, ${getUserName()}! PIN kodunuz başarıyla kaydedildi.`);
    unlockApp();
  } else if (state.enteredPin === savedPin) {
    unlockApp();
  } else {
    dots.forEach(dot => {
      dot.classList.remove('filled');
      dot.classList.add('error');
    });
    
    const pinIndicator = document.getElementById('pin-dots');
    if (pinIndicator) {
      pinIndicator.style.animation = 'none';
      setTimeout(() => { pinIndicator.style.animation = 'shake 0.4s'; }, 10);
    }
    
    state.enteredPin = '';
    setTimeout(updatePinDots, 600);
  }
}

function unlockApp() {
  state.isLocked = false;
  const pinScreen = document.getElementById('screen-pin');
  pinScreen.style.opacity = '0';
  setTimeout(() => {
    pinScreen.style.display = 'none';
  }, 300);
  
  switchScreen('screen-dashboard');
}

function lockApp() {
  state.isLocked = true;
  state.enteredPin = '';
  
  const pinScreen = document.getElementById('screen-pin');
  pinScreen.style.display = 'flex';
  setTimeout(() => {
    pinScreen.style.opacity = '1';
  }, 10);
  
  setupSecurity();
}

function resetActivityTimer() {
  state.lastActivityTime = Date.now();
}

function checkInactivityLock() {
  if (state.isLocked) return;
  const INACTIVITY_LIMIT = 5 * 60 * 1000; 
  if (Date.now() - state.lastActivityTime > INACTIVITY_LIMIT) {
    console.log('5 dakika hareketsizlik tespit edildi. Güvenlik için kilitleniyor.');
    lockApp();
  }
}

function switchScreen(screenId) {
  if (state.isLocked) return;
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));
  
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    state.currentScreen = screenId;
    
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      if (item.getAttribute('data-target') === screenId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
    
    refreshScreenData(screenId);
  }
}

function refreshScreenData(screenId) {
  switch (screenId) {
    case 'screen-dashboard':
      updateDashboard();
      break;
    case 'screen-transactions':
      updateTransactions();
      break;
    case 'screen-investments':
      updateInvestments();
      break;
    case 'screen-reports':
      updateReports();
      break;
  }
}

function updateDashboard() {
  const transactions = getTransactions();
  const assets = getAssets();
  
  let totalIncome = 0;
  let totalExpense = 0;
  
  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpense += t.amount;
  });
  
  const cash = totalIncome - totalExpense;
  
  let totalInvestmentsVal = 0;
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
    totalInvestmentsVal += asset.quantity * currentPrice;
  });
  
  const netWorth = cash + totalInvestmentsVal;
  
  document.getElementById('dashboard-welcome-title').textContent = `Selam ${getUserName()}, Ferah Ol 🍃`;
  document.getElementById('dashboard-net-worth').textContent = formatCurrency(netWorth);
  document.getElementById('dashboard-total-investments').textContent = formatCurrency(totalInvestmentsVal);
  document.getElementById('dashboard-total-cash').textContent = formatCurrency(cash);
  
  document.getElementById('dashboard-income').textContent = formatCurrency(totalIncome);
  document.getElementById('dashboard-expense').textContent = formatCurrency(totalExpense);
  
  // 1. Birikim Hedefi Ağacı Güncellemeleri
  const wealthGoal = getWealthGoal();
  const wealthTreeProgressPercent = Math.min((netWorth / wealthGoal) * 100, 100);
  const wealthTreeStatus = getWealthTreeStatus(wealthTreeProgressPercent);
  
  document.getElementById('wealth-tree-progress-label').textContent = `Hedef İlerlemesi: %${wealthTreeProgressPercent.toFixed(1)}`;
  document.getElementById('wealth-tree-title').textContent = wealthTreeStatus.title;
  document.getElementById('wealth-tree-message').textContent = wealthTreeStatus.message;
  document.getElementById('wealth-tree-progress-bar').style.width = `${wealthTreeProgressPercent}%`;
  document.getElementById('wealth-tree-current-worth').textContent = `Net Varlık: ${formatCurrency(netWorth)}`;
  document.getElementById('wealth-tree-target').textContent = `Hedef: ${formatCurrency(wealthGoal)}`;
  document.getElementById('wealth-tree-graphics-wrapper').innerHTML = renderWealthTreeSVG(wealthTreeStatus.stage);
  
  // 2. Aylık Tasarruf Nane Filizi Güncellemeleri
  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.round(((totalIncome - totalExpense) / totalIncome) * 100);
  }
  
  const plantStatus = getPlantStatus(savingsRate);
  document.getElementById('plant-title').textContent = plantStatus.title;
  document.getElementById('plant-message').textContent = plantStatus.message;
  document.getElementById('plant-rate').textContent = `Tasarruf Oranı: %${savingsRate}`;
  document.getElementById('plant-rate').style.backgroundColor = plantStatus.color + '22';
  document.getElementById('plant-rate').style.color = plantStatus.color;
  
  document.getElementById('plant-graphics-wrapper').innerHTML = renderPlantSVG(plantStatus.stage);
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
    
  const recentContainer = document.getElementById('dashboard-recent-transactions');
  recentContainer.innerHTML = '';
  
  if (recentTransactions.length === 0) {
    recentContainer.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); font-size: 13px; padding: 20px;">Henüz bir işlem kaydı bulunmamaktadır.</div>`;
  } else {
    recentTransactions.forEach(tx => {
      recentContainer.appendChild(createTransactionRow(tx));
    });
  }
  
  lucide.createIcons();
}

function updateTransactions() {
  const transactions = getTransactions();
  const container = document.getElementById('full-transaction-list');
  container.innerHTML = '';
  
  const filteredTxs = transactions.filter(t => {
    if (state.txFilter === 'all') return true;
    return t.type === state.txFilter;
  });
  
  const sortedTxs = [...filteredTxs].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (sortedTxs.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); font-size: 13px; padding: 40px 20px;">Filtreye uygun işlem bulunamadı.</div>`;
    return;
  }
  
  sortedTxs.forEach(tx => {
    const row = createTransactionRow(tx, true); 
    container.appendChild(row);
  });
  
  lucide.createIcons();
}

function updateInvestments() {
  const assets = getAssets();
  const container = document.getElementById('investments-assets-list');
  container.innerHTML = '';
  
  let totalCost = 0;
  let totalValue = 0;
  
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
    const cost = asset.quantity * asset.avgPrice;
    const value = asset.quantity * currentPrice;
    totalCost += cost;
    totalValue += value;
  });
  
  document.getElementById('investments-total-val').textContent = formatCurrency(totalValue);
  
  const totalPL = totalValue - totalCost;
  const plPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
  const plEl = document.getElementById('investments-total-pl');
  
  if (totalPL >= 0) {
    plEl.textContent = `+${formatCurrency(totalPL)} (+${plPercent.toFixed(2)}%)`;
    plEl.style.color = 'var(--color-mint-deep)';
  } else {
    plEl.textContent = `${formatCurrency(totalPL)} (${plPercent.toFixed(2)}%)`;
    plEl.style.color = 'var(--color-accent-red)';
  }
  
  if (assets.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); font-size: 13px; padding: 40px 20px;">Portföyünüzde henüz varlık bulunmamaktadır.</div>`;
    return;
  }
  
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
    const value = asset.quantity * currentPrice;
    const cost = asset.quantity * asset.avgPrice;
    const pl = value - cost;
    const plPct = cost > 0 ? (pl / cost) * 100 : 0;
    
    const card = document.createElement('div');
    card.className = 'transaction-item';
    card.id = `asset-card-${asset.id}`;
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    card.style.gap = '8px';
    card.style.padding = '14px 18px';
    
    let badgeColor = 'var(--color-sage)';
    let badgeLabel = 'Diğer';
    
    if (asset.type === 'gold') {
      badgeColor = 'hsl(42, 90%, 52%)'; // Amber
      badgeLabel = 'Altın';
    } else if (asset.type === 'silver') {
      badgeColor = '#B0BEC5'; // Silver
      badgeLabel = 'Gümüş';
    } else if (asset.type === 'stock') {
      badgeColor = 'var(--color-accent-blue)';
      badgeLabel = 'Hisse';
    } else if (asset.type === 'fund') {
      badgeColor = 'hsl(280, 65%, 65%)'; // Purple
      badgeLabel = 'Yatırım Fonu';
    } else if (asset.type === 'bes') {
      badgeColor = 'hsl(25, 95%, 60%)'; // Orange
      badgeLabel = 'BES Fonu';
    } else if (asset.type === 'currency') {
      badgeColor = 'hsl(150, 70%, 40%)'; // Emerald
      badgeLabel = 'Döviz';
    }
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; background: ${badgeColor}; border-radius: 50%;"></span>
          <strong style="font-size: 15px; color: var(--color-forest);">${asset.name}</strong>
          <span style="font-size: 10px; padding: 2px 6px; border-radius: var(--radius-full); background: ${badgeColor}15; color: ${badgeColor}; font-weight: 600; margin-left: 4px;">${badgeLabel}</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="font-size: 11px; color: var(--color-text-muted);">${asset.quantity} adet</span>
          <button class="asset-edit-btn" data-id="${asset.id}" style="background: transparent; border: none; color: var(--color-mint-deep); cursor: pointer; padding: 2px;" title="Düzenle">
            <i data-lucide="edit" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="asset-delete-btn" data-id="${asset.id}" style="background: transparent; border: none; color: var(--color-accent-red); cursor: pointer; padding: 2px;" title="Sil">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; border-top: 1px dashed var(--color-card-border); padding-top: 6px; font-size: 12px;">
        <div>
          <span style="color: var(--color-text-muted);">Ort. Maliyet:</span>
          <span style="font-weight: 500;">${formatCurrency(asset.avgPrice)}</span>
        </div>
        <div>
          <span style="color: var(--color-text-muted);">Güncel Fiyat:</span>
          <span id="price-val-${asset.id}" style="font-weight: 600; color: var(--color-forest); transition: var(--transition);">${formatCurrency(currentPrice)}</span>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; font-size: 13px; font-weight: 600;">
        <span style="color: var(--color-forest); font-family: var(--font-heading); font-size: 14px;">${formatCurrency(value)}</span>
        <span style="color: ${pl >= 0 ? 'var(--color-mint-deep)' : 'var(--color-accent-red)'}; font-family: var(--font-heading);">
          ${pl >= 0 ? '+' : ''}${formatCurrency(pl)} (${pl >= 0 ? '+' : ''}${plPct.toFixed(2)}%)
        </span>
      </div>
    `;
    container.appendChild(card);
  });
  
  // Silme butonlarını dinle
  document.querySelectorAll('.asset-delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (confirm('Bu varlığı portföyünüzden kaldırmak istediğinize emin misiniz?')) {
        deleteAsset(id);
        updateInvestments();
        if (state.currentScreen === 'screen-dashboard') updateDashboard();
      }
    });
  });
  
  // Düzenleme butonlarını dinle
  document.querySelectorAll('.asset-edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const asset = getAssets().find(a => a.id === id);
      if (asset) {
        document.getElementById('asset-id').value = asset.id;
        document.getElementById('asset-name').value = asset.name;
        document.getElementById('asset-type').value = asset.type || 'stock';
        document.getElementById('asset-qty').value = asset.quantity;
        document.getElementById('asset-avg-price').value = asset.avgPrice;
        document.getElementById('asset-current-price').value = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
        
        document.getElementById('modal-asset-title').textContent = 'Varlığı Düzenle 🍃';
        document.getElementById('btn-submit-asset').textContent = 'Güncelle ✨';
        
        document.getElementById('modal-asset').classList.add('active');
      }
    });
  });
  
  lucide.createIcons();
}

function populateReportMonthDropdown() {
  const select = document.getElementById('report-month-select');
  if (!select) return;
  
  // Mevcut seçimi kaydet
  const currentSelection = select.value;
  
  const transactions = getTransactions();
  const monthsSet = new Set();
  
  transactions.forEach(t => {
    if (t.date) {
      const yearMonth = t.date.substring(0, 7); // Örn: "2026-06"
      monthsSet.add(yearMonth);
    }
  });
  
  // Ayları tersten sırala (en güncel en üstte)
  const sortedMonths = Array.from(monthsSet).sort().reverse();
  
  select.innerHTML = '<option value="all">Tüm Zamanlar</option>';
  
  const turkishMonths = {
    '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
    '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
    '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
  };
  
  sortedMonths.forEach(ym => {
    const [year, month] = ym.split('-');
    const monthName = turkishMonths[month] || month;
    const opt = document.createElement('option');
    opt.value = ym;
    opt.textContent = `${monthName} ${year}`;
    select.appendChild(opt);
  });
  
  // Seçimi geri yükle
  if (currentSelection && Array.from(select.options).some(o => o.value === currentSelection)) {
    select.value = currentSelection;
  } else {
    if (sortedMonths.length > 0) {
      select.value = sortedMonths[0];
    } else {
      select.value = 'all';
    }
  }
}

function renderTrendChart() {
  const canvas = document.getElementById('report-trend-chart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (state.charts.trend) {
    state.charts.trend.destroy();
  }
  
  // Son 6 ayın dönemlerini dinamik oluştur
  const sortedMonths = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    sortedMonths.push(`${y}-${m}`);
  }
  
  const turkishMonthsShort = {
    '01': 'Oca', '02': 'Şub', '03': 'Mar', '04': 'Nis',
    '05': 'May', '06': 'Haz', '07': 'Tem', '08': 'Ağu',
    '09': 'Eyl', '10': 'Eki', '11': 'Kas', '12': 'Ara'
  };
  
  const labels = [];
  const incomeData = [];
  const expenseData = [];
  const savingsRateData = [];
  
  const transactions = getTransactions();
  
  sortedMonths.forEach(ym => {
    const [year, month] = ym.split('-');
    labels.push(`${turkishMonthsShort[month]} ${year.toString().substring(2)}`);
    
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    
    transactions.forEach(t => {
      if (t.date && t.date.substring(0, 7) === ym) {
        if (t.type === 'income') monthlyIncome += t.amount;
        else monthlyExpense += t.amount;
      }
    });
    
    incomeData.push(monthlyIncome);
    expenseData.push(monthlyExpense);
    
    let rate = 0;
    if (monthlyIncome > 0) {
      rate = Math.round(((monthlyIncome - monthlyExpense) / monthlyIncome) * 100);
    }
    savingsRateData.push(rate);
  });
  
  state.charts.trend = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Gelir',
          type: 'bar',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.65)',
          borderColor: '#10B981',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Gider',
          type: 'bar',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.65)',
          borderColor: '#EF4444',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Tasarruf Oranı (%)',
          type: 'line',
          data: savingsRateData,
          borderColor: 'hsl(42, 90%, 52%)',
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointBackgroundColor: 'hsl(42, 90%, 52%)',
          pointHoverRadius: 6,
          pointRadius: 4,
          tension: 0.35,
          yAxisID: 'yRate'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            font: { size: 10, family: 'Inter' }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: { display: false },
          ticks: {
            font: { size: 9 },
            callback: function(value) {
              if (value >= 1000) return (value / 1000) + 'k ₺';
              return value + ' ₺';
            }
          }
        },
        yRate: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: { display: false },
          min: -50,
          max: 100,
          ticks: {
            font: { size: 9 },
            callback: function(value) {
              return '%' + value;
            }
          }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

function updateReports() {
  populateReportMonthDropdown();
  
  const select = document.getElementById('report-month-select');
  const selectedPeriod = select ? select.value : 'all';
  
  let transactions = getTransactions();
  if (selectedPeriod !== 'all') {
    transactions = transactions.filter(t => t.date && t.date.substring(0, 7) === selectedPeriod);
  }
  
  const assets = getAssets();
  
  let totalIncome = 0;
  let totalExpense = 0;
  
  transactions.forEach(t => {
    if (t.type === 'income') totalIncome += t.amount;
    else totalExpense += t.amount;
  });
  
  const netSavings = totalIncome - totalExpense;
  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.round((netSavings / totalIncome) * 100);
  }
  
  let totalCost = 0;
  let totalValue = 0;
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
    totalCost += asset.quantity * asset.avgPrice;
    totalValue += asset.quantity * currentPrice;
  });
  
  const investmentEarnings = totalValue - totalCost;
  const totalGrowthVal = netSavings + investmentEarnings;
  
  const reportTitleEl = document.getElementById('report-title-month');
  if (reportTitleEl) {
    if (selectedPeriod === 'all') {
      reportTitleEl.textContent = "Tüm Zamanlar Rapor Özetiniz";
    } else {
      const [year, month] = selectedPeriod.split('-');
      const turkishMonths = {
        '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
        '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
        '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
      };
      const monthName = turkishMonths[month] || month;
      reportTitleEl.textContent = `${monthName} ${year} Rapor Özetiniz`;
    }
  }
  
  const printUserNameEl = document.getElementById('print-user-name');
  if (printUserNameEl) {
    printUserNameEl.textContent = getUserName() || "Ferah Kullanıcısı";
  }
  
  const printDateEl = document.getElementById('print-date');
  if (printDateEl) {
    const todayStr = formatDate(new Date().toISOString().split('T')[0]);
    if (selectedPeriod === 'all') {
      printDateEl.textContent = `Tüm Zamanlar Raporu • Rapor Tarihi: ${todayStr}`;
    } else {
      const [year, month] = selectedPeriod.split('-');
      const turkishMonths = {
        '01': 'Ocak', '02': 'Şubat', '03': 'Mart', '04': 'Nisan',
        '05': 'Mayıs', '06': 'Haziran', '07': 'Temmuz', '08': 'Ağustos',
        '09': 'Eylül', '10': 'Ekim', '11': 'Kasım', '12': 'Aralık'
      };
      const monthName = turkishMonths[month] || month;
      printDateEl.textContent = `${monthName} ${year} Raporu • Rapor Tarihi: ${todayStr}`;
    }
  }
  
  document.getElementById('report-total-income').textContent = formatCurrency(totalIncome);
  document.getElementById('report-total-expense').textContent = formatCurrency(totalExpense);
  
  const netSavingsEl = document.getElementById('report-net-savings');
  netSavingsEl.textContent = `${netSavings >= 0 ? '+' : ''}${formatCurrency(netSavings)}`;
  netSavingsEl.style.color = netSavings >= 0 ? 'var(--color-mint-deep)' : 'var(--color-accent-red)';
  
  const savingsRateEl = document.getElementById('report-savings-rate');
  savingsRateEl.textContent = `%${savingsRate}`;
  if (savingsRate >= 30) {
    savingsRateEl.style.backgroundColor = 'hsl(120, 30%, 93%)';
    savingsRateEl.style.color = 'var(--color-mint-deep)';
  } else if (savingsRate >= 0) {
    savingsRateEl.style.backgroundColor = 'var(--color-mint-light)';
    savingsRateEl.style.color = 'var(--color-text)';
  } else {
    savingsRateEl.style.backgroundColor = 'hsl(0, 50%, 96%)';
    savingsRateEl.style.color = 'var(--color-accent-red)';
  }
  
  const invEarningsEl = document.getElementById('report-investment-earnings');
  invEarningsEl.textContent = `${investmentEarnings >= 0 ? '+' : ''}${formatCurrency(investmentEarnings)}`;
  invEarningsEl.style.color = investmentEarnings >= 0 ? 'var(--color-mint-deep)' : 'var(--color-accent-red)';
  
  const totalGrowthEl = document.getElementById('report-total-growth-val');
  totalGrowthEl.textContent = `${totalGrowthVal >= 0 ? '+' : ''}${formatCurrency(totalGrowthVal)}`;
  totalGrowthEl.style.color = totalGrowthVal >= 0 ? 'var(--color-mint-deep)' : 'var(--color-accent-red)';
  
  const barCtx = document.getElementById('report-bar-chart').getContext('2d');
  if (state.charts.bar) {
    state.charts.bar.destroy();
  }
  
  state.charts.bar = new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Gelirler', 'Giderler'],
      datasets: [{
        data: [totalIncome, totalExpense],
        backgroundColor: [
          'rgba(16, 185, 129, 0.65)', 
          'rgba(239, 68, 68, 0.65)'    
        ],
        borderColor: [
          '#10B981',
          '#EF4444'
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { display: false }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
  
  const donutCtx = document.getElementById('report-donut-chart').getContext('2d');
  if (state.charts.donut) {
    state.charts.donut.destroy();
  }
  
  let totalIncomeAllTime = 0;
  let totalExpenseAllTime = 0;
  getTransactions().forEach(t => {
    if (t.type === 'income') totalIncomeAllTime += t.amount;
    else totalExpenseAllTime += t.amount;
  });
  const currentActualCash = totalIncomeAllTime - totalExpenseAllTime;
  
  const donutData = [currentActualCash >= 0 ? currentActualCash : 0];
  const donutColors = ['rgba(129, 199, 132, 0.7)']; 
  const donutLabels = ['Nakit (TL)'];
  
  assets.forEach(asset => {
    const currentPrice = asset.currentPrice !== undefined ? asset.currentPrice : asset.avgPrice;
    donutLabels.push(asset.name);
    donutData.push(asset.quantity * currentPrice);
    
    if (asset.type === 'gold') {
      donutColors.push('rgba(255, 193, 7, 0.7)'); // Amber
    } else if (asset.type === 'silver') {
      donutColors.push('rgba(176, 190, 197, 0.7)'); // Silver
    } else if (asset.type === 'stock') {
      donutColors.push('rgba(30, 136, 229, 0.7)'); // BIST Blue
    } else if (asset.type === 'fund') {
      donutColors.push('rgba(156, 39, 176, 0.7)'); // Fund Purple
    } else if (asset.type === 'bes') {
      donutColors.push('rgba(255, 112, 67, 0.7)'); // BES Orange
    } else if (asset.type === 'currency') {
      donutColors.push('rgba(76, 175, 80, 0.7)'); // Forex Green
    } else {
      donutColors.push('rgba(141, 110, 99, 0.7)'); // Sage / Other Brown
    }
  });
  
  state.charts.donut = new Chart(donutCtx, {
    type: 'doughnut',
    data: {
      labels: donutLabels,
      datasets: [{
        data: donutData,
        backgroundColor: donutColors,
        borderWidth: 1,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            font: { size: 10 }
          }
        }
      },
      cutout: '65%'
    }
  });
  
  renderTrendChart();
}

function createTransactionRow(tx, enableDelete = false) {
  const row = document.createElement('div');
  row.className = 'transaction-item';
  
  const isIncome = tx.type === 'income';
  const catInfo = CATEGORIES[isIncome ? 'INCOME' : 'EXPENSE'][tx.category] || {
    label: 'Diğer',
    icon: 'help-circle',
    color: 'var(--color-sage)'
  };
  
  row.innerHTML = `
    <div class="transaction-left">
      <div class="category-icon-wrapper" style="background-color: ${catInfo.color}">
        <i data-lucide="${catInfo.icon}" style="width: 18px; height: 18px;"></i>
      </div>
      <div class="transaction-details">
        <h4>${tx.description}</h4>
        <p>${catInfo.label} • ${formatDate(tx.date)}</p>
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="transaction-amount ${isIncome ? 'income' : 'expense'}">
        ${isIncome ? '+' : '-'}${tx.amount.toLocaleString('tr-TR')} ₺
      </span>
      ${enableDelete ? `
        <button class="tx-delete-btn" data-id="${tx.id}" style="background: transparent; border: none; color: var(--color-accent-red); cursor: pointer; padding: 4px;">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      ` : ''}
    </div>
  `;
  
  if (enableDelete) {
    row.querySelector('.tx-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
        deleteTransaction(tx.id);
        updateTransactions(); 
      }
    });
  }
  return row;
}

function registerEvents() {
  const submitName = () => {
    const nameInput = document.getElementById('pin-name-input');
    const name = nameInput.value;
    if (name && name.trim().length > 0) {
      setUserName(name);
      setupSecurity(); 
    } else {
      alert('Lütfen geçerli bir isim girin.');
    }
  };
  
  document.getElementById('pin-btn-name-submit').addEventListener('click', submitName);
  document.getElementById('pin-name-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') submitName();
  });
  
  document.querySelectorAll('.num-key').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.getAttribute('data-num');
      handlePinKeyPress(num);
    });
  });
  
  document.getElementById('pin-btn-clear').addEventListener('click', () => {
    state.enteredPin = '';
    updatePinDots();
  });
  
  document.getElementById('pin-btn-delete').addEventListener('click', () => {
    if (state.enteredPin.length > 0) {
      state.enteredPin = state.enteredPin.slice(0, -1);
      updatePinDots();
    }
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-target');
      switchScreen(target);
    });
  });
  
  document.getElementById('dashboard-see-all').addEventListener('click', () => {
    switchScreen('screen-transactions');
  });

  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.color = 'var(--color-text-muted)';
        t.style.fontWeight = '500';
      });
      tab.classList.add('active');
      tab.style.background = 'var(--color-card-bg)';
      tab.style.color = 'var(--color-forest)';
      tab.style.fontWeight = '600';
      state.txFilter = tab.getAttribute('data-filter');
      updateTransactions();
    });
  });

  const modalTx = document.getElementById('modal-transaction');
  document.getElementById('btn-add-tx-open').addEventListener('click', () => {
    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-desc').value = '';
    document.getElementById('tx-date').value = new Date().toISOString().split('T')[0];
    populateCategories('income');
    modalTx.classList.add('active');
  });
  document.getElementById('modal-tx-close').addEventListener('click', () => modalTx.classList.remove('active'));
  
  document.querySelectorAll('input[name="tx-type"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      populateCategories(e.target.value);
    });
  });
  
  const modalAsset = document.getElementById('modal-asset');
  
  document.getElementById('btn-add-asset-open').addEventListener('click', () => {
    document.getElementById('asset-id').value = '';
    document.getElementById('asset-name').value = '';
    document.getElementById('asset-type').value = 'gold';
    document.getElementById('asset-qty').value = '';
    document.getElementById('asset-avg-price').value = '';
    document.getElementById('asset-current-price').value = '';
    
    document.getElementById('modal-asset-title').textContent = 'Varlık Ekle';
    document.getElementById('btn-submit-asset').textContent = 'Portföye Ekle ✨';
    
    modalAsset.classList.add('active');
  });

  document.getElementById('modal-asset-close').addEventListener('click', () => {
    modalAsset.classList.remove('active');
  });

  const modalSettings = document.getElementById('modal-settings');
  document.getElementById('btn-settings-open').addEventListener('click', () => {
    document.getElementById('settings-old-pin').value = '';
    document.getElementById('settings-new-pin').value = '';
    document.getElementById('settings-wealth-goal').value = getWealthGoal();
    modalSettings.classList.add('active');
  });
  document.getElementById('modal-settings-close').addEventListener('click', () => modalSettings.classList.remove('active'));

  document.getElementById('form-transaction').addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.querySelector('input[name="tx-type"]:checked').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const category = document.getElementById('tx-category').value;
    const description = document.getElementById('tx-desc').value;
    const date = document.getElementById('tx-date').value;
    
    addTransaction({ type, amount, category, description, date });
    modalTx.classList.remove('active');
    
    if (type === 'income') {
      switchScreen('screen-dashboard');
      setTimeout(() => {
        const plantContainer = document.getElementById('plant-container');
        triggerWateringAnimation(plantContainer);
        setTimeout(updateDashboard, 1500);
      }, 350);
    } else {
      refreshScreenData(state.currentScreen);
    }
  });

  document.getElementById('form-asset').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('asset-id').value;
    const name = document.getElementById('asset-name').value.trim();
    const type = document.getElementById('asset-type').value;
    const qty = parseFloat(document.getElementById('asset-qty').value);
    const avgPrice = parseFloat(document.getElementById('asset-avg-price').value);
    const currentPrice = parseFloat(document.getElementById('asset-current-price').value);
    
    if (!name) {
      alert("Lütfen geçerli bir varlık adı girin.");
      return;
    }
    
    if (id) {
      updateAsset(id, { name, type, quantity: qty, avgPrice, currentPrice });
    } else {
      addAsset({ name, type, quantity: qty, avgPrice, currentPrice });
    }
    
    modalAsset.classList.remove('active');
    refreshScreenData(state.currentScreen);
  });

  document.getElementById('form-change-pin').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPin = document.getElementById('settings-old-pin').value;
    const newPin = document.getElementById('settings-new-pin').value;
    const savedPin = getPin();
    
    if (oldPin !== savedPin) {
      alert('Mevcut PIN kodunuz hatalı! Değişiklik yapılamadı.');
      return;
    }
    if (newPin.length !== 4 || isNaN(newPin)) {
      alert('Yeni PIN 4 haneli sayısal bir kod olmalıdır.');
      return;
    }
    setPin(newPin);
    alert('PIN kodunuz başarıyla güncellendi.');
    modalSettings.classList.remove('active');
  });

  document.getElementById('form-wealth-goal').addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = parseFloat(document.getElementById('settings-wealth-goal').value);
    try {
      setWealthGoal(goal);
      updateDashboard();
      alert('Ana Birikim Hedefiniz başarıyla güncellendi! 🌳');
      modalSettings.classList.remove('active');
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('btn-system-reset').addEventListener('click', () => {
    if (confirm('DİKKAT: Uygulamadaki tüm veriler silinecek ve başlangıç durumuna dönülecektir. Bu işlem geri alınamaz! Onaylıyor musunuz?')) {
      resetSystem();
      alert('Sistem başarıyla fabrika ayarlarına sıfırlandı.');
      modalSettings.classList.remove('active');
      lockApp();
    }
  });

  document.getElementById('btn-export-csv').addEventListener('click', () => {
    exportToCSV();
  });
  
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    window.print();
  });

  document.getElementById('report-month-select').addEventListener('change', () => {
    updateReports();
  });
}

function populateCategories(type) {
  const catSelect = document.getElementById('tx-category');
  catSelect.innerHTML = '';
  const cats = CATEGORIES[type === 'income' ? 'INCOME' : 'EXPENSE'];
  Object.keys(cats).forEach(key => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cats[key].label;
    catSelect.appendChild(opt);
  });
}

function exportToCSV() {
  const transactions = getTransactions();
  if (transactions.length === 0) {
    alert('Dışa aktarılacak bir işlem geçmişiniz bulunmamaktadır.');
    return;
  }
  let csvContent = '\uFEFF'; 
  csvContent += 'Tarih,Islem Turu,Kategori,Tutar,Aciklama\n';
  
  transactions.forEach(t => {
    const typeLabel = t.type === 'income' ? 'Gelir' : 'Gider';
    const catInfo = CATEGORIES[t.type === 'income' ? 'INCOME' : 'EXPENSE'][t.category] || { label: 'Diğer' };
    const cleanDesc = t.description.replace(/"/g, '""');
    csvContent += `${t.date},${typeLabel},${catInfo.label},${t.amount},"${cleanDesc}"\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FerahFinans_Rapor_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatCurrency(val) {
  return val.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 2 });
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
}
