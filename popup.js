// Site Engelleyici - Popup JS

let enabled = true;
let blockedSites = [];

// DOM elemanları
const enabledToggle = document.getElementById('enabled-toggle');
const toggleStateLabel = document.getElementById('toggle-state-label');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const siteCount = document.getElementById('site-count');
const siteInput = document.getElementById('site-input');
const addBtn = document.getElementById('add-btn');
const listSection = document.getElementById('list-section');
const emptyState = document.getElementById('empty-state');
const errorMsg = document.getElementById('error-msg');
const clearBtn = document.getElementById('clear-btn');

// Storage'dan yükle
async function loadState() {
  const result = await chrome.storage.local.get(['enabled', 'blockedSites']);
  enabled = result.enabled !== undefined ? result.enabled : true;
  blockedSites = result.blockedSites || [];
  
  enabledToggle.checked = enabled;
  updateUI();
  renderList();
}

// Durumu kaydet
async function saveState() {
  await chrome.storage.local.set({ enabled, blockedSites });
  chrome.runtime.sendMessage({ type: 'UPDATE_RULES' });
}

// UI güncelle
function updateUI() {
  if (enabled) {
    toggleStateLabel.textContent = 'AKTİF';
    statusDot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = 'Engelleme aktif';
  } else {
    toggleStateLabel.textContent = 'KAPALI';
    statusDot.classList.remove('active');
    statusText.classList.remove('active');
    statusText.textContent = 'Engelleme devre dışı';
  }
  siteCount.textContent = `${blockedSites.length} site`;
}

// Liste render et
function renderList() {
  // Mevcut site itemları kaldır (empty state hariç)
  const items = listSection.querySelectorAll('.site-item');
  items.forEach(item => item.remove());

  if (blockedSites.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  blockedSites.forEach((site, index) => {
    const item = document.createElement('div');
    item.className = 'site-item';
    item.innerHTML = `
      <div class="site-favicon">🌐</div>
      <span class="site-url" title="${site}">${site}</span>
      <button class="remove-btn" data-index="${index}" title="Kaldır">×</button>
    `;
    listSection.appendChild(item);
  });

  // Remove butonlarına event ekle
  listSection.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      removeSite(index);
    });
  });

  siteCount.textContent = `${blockedSites.length} site`;
}

// URL doğrula ve temizle
function cleanAndValidateUrl(input) {
  input = input.trim().toLowerCase();
  
  if (!input) return null;
  
  // Protocol varsa kaldır
  input = input.replace(/^https?:\/\//, '');
  input = input.replace(/^www\./, '');
  
  // Path varsa kaldır
  input = input.split('/')[0];
  
  // Basit domain doğrulaması
  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
  
  if (!domainRegex.test(input)) return null;
  
  return input;
}

// Site ekle
async function addSite() {
  const input = siteInput.value;
  const domain = cleanAndValidateUrl(input);

  if (!domain) {
    showError('Geçerli bir domain girin (örn: instagram.com)');
    return;
  }

  if (blockedSites.includes(domain)) {
    showError('Bu site zaten listede!');
    return;
  }

  errorMsg.textContent = '';
  blockedSites.unshift(domain);
  siteInput.value = '';
  
  await saveState();
  renderList();
}

// Site kaldır
async function removeSite(index) {
  blockedSites.splice(index, 1);
  await saveState();
  renderList();
  updateUI();
}

// Hata göster
function showError(msg) {
  errorMsg.textContent = msg;
  siteInput.style.borderColor = 'var(--accent)';
  setTimeout(() => {
    errorMsg.textContent = '';
    siteInput.style.borderColor = '';
  }, 2500);
}

// Event listeners
enabledToggle.addEventListener('change', async () => {
  enabled = enabledToggle.checked;
  updateUI();
  await saveState();
});

addBtn.addEventListener('click', addSite);

siteInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addSite();
});

clearBtn.addEventListener('click', async () => {
  if (blockedSites.length === 0) return;
  if (confirm('Tüm engellenen siteler silinecek. Emin misiniz?')) {
    blockedSites = [];
    await saveState();
    renderList();
    updateUI();
  }
});

// Başlat
loadState();
