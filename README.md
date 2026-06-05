# Site Engelleyici

`Site Engelleyici`, Chrome/Edge uzantısı olarak çalışmak üzere tasarlanmış bir site engelleme aracıdır. Kullanıcı tarafından belirtilen domainlere erişim engellenir ve kullanıcı `blocked.html` sayfasına yönlendirilir.

## Özellikler

- Engelleme listesini popup üzerinden yönetme
- Engelleme modunu açma/kapatma
- `declarativeNetRequest` ile ağ düzeyinde site engelleme
- İçerik betiği (`content.js`) ile sayfa yüklenmesi sırasında anında yönlendirme
- `x.com` / `twitter.com` alias eşlemesi desteği

## Kurulum

1. Chrome veya Edge tarayıcısını açın.
2. Uzantılar sayfasına gidin:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Sağ üstte `Geliştirici modu`nu aktifleştirin.
4. `Paketlenmemiş uzantı yükle` veya `Load unpacked` seçeneğini seçin.
5. Bu klasörü (`site-blocker`) seçin.

## Kullanım

1. Tarayıcı araç çubuğundaki uzantı simgesine tıklayın.
2. `Engelleme` anahtarını açarak veya kapatarak uzantıyı etkinleştirin/devre dışı bırakın.
3. `Site ekle` alanına bir domain girin (örn. `instagram.com`).
4. Listeye eklenen sitelere erişim engellendiğinde kullanıcı `blocked.html` sayfasına yönlendirilir.

## Dosya yapısı

- `manifest.json` — Uzantı tanımı ve izinler
- `background.js` — Servis çalışanı, dinamik engelleme kurallarını yönetir
- `content.js` — Sayfa açılır açılmaz engellenmiş siteleri kontrol eder
- `popup.html` / `popup.js` — Uzantı popup arayüzü
- `blocked.html` / `blocked.js` — Engellenmiş site ekranı
- `rules.json` — Manifest tarafından tanımlanan kural kaynağı
- `icons/` — Uzantı simgeleri

## Notlar

- Uzantı, `storage`, `tabs`, `scripting`, `declarativeNetRequest` ve `declarativeNetRequestWithHostAccess` izinlerini kullanır.
- `host_permissions` olarak `<all_urls>` ayarlanmıştır; bu sayede tüm sitelere erişim izni olur ve engellemeler doğru çalışır.
- Eklentiye eklenen domainler `www.` ön eki olmadan kaydedilir ve hem `www.` hem de ana domain için eşleşir.

## Geliştirme

Projeyi genişletmek veya düzenlemek için JavaScript ve HTML dosyalarını doğrudan güncelleyebilirsiniz. Yeni engelleme düzenleri eklemek için `background.js` içindeki `updateRules()` fonksiyonunu kullanabilirsiniz.

## Lisans

Bu proje MIT Lisansı altında yayınlanmıştır. Detaylar için `LICENSE` dosyasına bakınız.

---

# Site Blocker (English)

`Site Blocker` is a site blocking tool designed to work as a Chrome/Edge extension. Access to domains specified by the user is blocked and the user is redirected to a `blocked.html` page.

## Features

- Manage blocking list from popup interface
- Enable/disable blocking mode
- Block sites at the network level with `declarativeNetRequest`
- Instant redirect during page load with content script (`content.js`)
- Support for `x.com` / `twitter.com` alias mapping

## Installation

1. Open Chrome or Edge browser.
2. Navigate to extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
3. Enable `Developer mode` in the top right.
4. Select `Load unpacked` option.
5. Select this folder (`site-blocker`).

## Usage

1. Click the extension icon in the browser toolbar.
2. Enable or disable the extension by toggling the `Blocking` switch.
3. Enter a domain in the `Add site` field (e.g., `instagram.com`).
4. When access to a blocked site is attempted, the user is redirected to `blocked.html`.

## File Structure

- `manifest.json` — Extension definition and permissions
- `background.js` — Service worker, manages dynamic blocking rules
- `content.js` — Checks blocked sites immediately when page loads
- `popup.html` / `popup.js` — Extension popup interface
- `blocked.html` / `blocked.js` — Blocked site screen
- `rules.json` — Rule resource defined by manifest
- `icons/` — Extension icons

## Notes

- The extension uses `storage`, `tabs`, `scripting`, `declarativeNetRequest`, and `declarativeNetRequestWithHostAccess` permissions.
- `host_permissions` is set to `<all_urls>` to ensure proper access and blocking functionality.
- Domains added to the extension are stored without `www.` prefix and match both `www.` and main domain versions.

## Development

To extend or edit the project, you can directly update JavaScript and HTML files. To add new blocking patterns, use the `updateRules()` function in `background.js`.

## License

This project is released under the MIT License. See the `LICENSE` file for details.
