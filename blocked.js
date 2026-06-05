// Site Engelleyici - Blocked Page Script

const params = new URLSearchParams(window.location.search);
const blocked = params.get('site') || document.referrer || 'Engellenen site';

let domain = blocked;
try {
  if (blocked.startsWith('http')) {
    domain = new URL(blocked).hostname.replace('www.', '');
  }
} catch(e) {}

document.getElementById('blocked-domain').textContent = domain;
document.title = 'Engellendi: ' + domain;

// Geri Dön
document.getElementById('btn-back').addEventListener('click', function() {
  if (history.length > 1) {
    history.back();
  } else {
    chrome.tabs.update({ url: 'chrome://newtab' });
  }
});

// Sekmeyi Kapat
document.getElementById('btn-close').addEventListener('click', function() {
  chrome.tabs.getCurrent(function(tab) {
    if (tab) {
      chrome.tabs.remove(tab.id);
    }
  });
});
