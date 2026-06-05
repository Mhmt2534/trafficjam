// Site Engelleyici - Background Service Worker

// Varsayılan ayarlar
const DEFAULT_STATE = {
  enabled: true,
  blockedSites: []
};

// Başlangıçta storage'ı başlat
chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.local.get(['enabled', 'blockedSites']);
  if (result.enabled === undefined) {
    await chrome.storage.local.set(DEFAULT_STATE);
  }
  await updateRules();
});

// Kuralları güncelle
async function updateRules() {
  const { enabled, blockedSites } = await chrome.storage.local.get(['enabled', 'blockedSites']);
  
  // Mevcut dinamik kuralları al ve sil
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  
  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }

  // Eğer eklenti devre dışıysa veya liste boşsa kural ekleme
  if (!enabled || !blockedSites || blockedSites.length === 0) {
    return;
  }

    // Bazı siteler için otomatik alias eşlemeleri
  const ALIASES = {
    'x.com': ['x.com', 'twitter.com'],
    'twitter.com': ['twitter.com', 'x.com'],
  };

  // Her site için engelleme kuralı oluştur (alias'lar dahil)
  let ruleId = 1;
  const newRules = [];

  for (const site of blockedSites) {
    // Domain'i temizle
    let domain = site.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    // Bu domain için eşleşecek tüm domain'leri bul
    const targets = ALIASES[domain] ? ALIASES[domain] : [domain];

    for (const target of targets) {
      // Regex: hem www. hem de doğrudan domain'i yakala
      const escapedDomain = target.replace('.', '\\.');
      const regexFilter = `^https?://(www\\.)?${escapedDomain}(/.*)?$`;

      newRules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          regexFilter,
          resourceTypes: ['main_frame']
        }
      });
    }
  }

  if (newRules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: newRules
    });
  }
}


// Storage değişikliklerini dinle
chrome.storage.onChanged.addListener(async (changes, namespace) => {
  if (namespace === 'local' && (changes.enabled || changes.blockedSites)) {
    await updateRules();
  }
});

// Mesajları dinle (popup'tan gelen)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_RULES') {
    updateRules().then(() => sendResponse({ success: true }));
    return true;
  }
});
