// Site Engelleyici - Content Script
// document_start'ta çalışır, service worker cache'ini de yakalar

(async () => {
  try {
    const result = await chrome.storage.local.get(['enabled', 'blockedSites']);
    const enabled = result.enabled !== false;
    const blockedSites = result.blockedSites || [];

    if (!enabled || blockedSites.length === 0) return;

    const currentHost = location.hostname.replace(/^www\./, '');

    // Alias kontrolü: x.com <-> twitter.com
    const ALIASES = {
      'x.com': ['x.com', 'twitter.com'],
      'twitter.com': ['x.com', 'twitter.com'],
    };

    const isBlocked = blockedSites.some(site => {
      const domain = site.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      const targets = ALIASES[domain] ? ALIASES[domain] : [domain];
      return targets.includes(currentHost);
    });

    if (isBlocked) {
      // Sayfayı hemen durdur ve engelleme sayfasına yönlendir
      const blockedUrl = chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(location.hostname);
      location.replace(blockedUrl);
    }
  } catch (e) {
    // Storage erişim hatası — sessizce geç
  }
})();
