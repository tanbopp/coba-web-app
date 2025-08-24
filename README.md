# Coba Web App 🚀

PWA sederhana dengan tampilan mobile yang dioptimalkan untuk GitHub Pages.

## 🎯 Fitur

- **Mobile-First Design** - Tampilan fullscreen seperti aplikasi native
- **Progressive Web App (PWA)** - Bisa dipasang di home screen
- **GitHub Pages Compatible** - Siap deploy di GitHub Pages
- **iOS Optimized** - Fullscreen di iPhone dengan meta tags khusus
- **Offline Support** - Service Worker untuk akses offline
- **Dark Mode** - Mode gelap/terang
- **Responsive** - Support semua ukuran layar

## 🌐 Live Demo

Akses di: [https://tanbopp.github.io/coba-web-app/](https://tanbopp.github.io/coba-web-app/)

## 📱 Cara Install sebagai PWA

### Android:
1. Buka website di Chrome
2. Tap menu (3 titik) → "Add to Home screen"
3. Atau akan muncul banner install otomatis

### iPhone/iPad:
1. Buka website di Safari
2. Tap tombol Share (kotak dengan panah)
3. Pilih "Add to Home Screen"
4. App akan muncul fullscreen tanpa browser bar

## 🚀 Deployment ke GitHub Pages

### Quick Setup:
1. Fork atau clone repo ini
2. Rename repo menjadi nama yang diinginkan (misalnya: `my-pwa-app`)
3. Update file berikut sesuai nama repo baru:

#### File `manifest.json`:
```json
{
  "start_url": "/my-pwa-app/",
  "scope": "/my-pwa-app/",
  // ... config lainnya
}
```

#### File `service-worker.js`:
```javascript
const BASE_PATH = '/my-pwa-app';
```

4. Enable GitHub Pages di Settings → Pages → Source: Deploy from a branch → main
5. Website akan tersedia di `https://username.github.io/my-pwa-app/`

### Manual Deploy:
1. Pastikan semua file ada di branch `main`
2. Commit dan push ke GitHub
3. Website otomatis ter-deploy dalam 1-2 menit

## 📁 Struktur File

```
coba-web-app/
├── index.html          # Halaman utama dengan meta tags PWA
├── style.css           # CSS mobile-first responsive
├── app.js             # JavaScript untuk interaktivitas
├── manifest.json      # Manifest PWA (GitHub Pages path)
├── service-worker.js  # Service Worker (GitHub Pages compatible)
└── README.md          # Dokumentasi ini
```

## 🔧 Kustomisasi

### Mengubah Nama App:
1. **index.html**: Update `<title>` dan text dalam `<h1>`
2. **manifest.json**: Update `name` dan `short_name`
3. **app.js**: Update pesan welcome toast

### Mengubah Warna Tema:
1. **style.css**: Update `--primary-color` di `:root`
2. **manifest.json**: Update `theme_color`
3. **Icons**: Update base64 SVG icons dengan warna baru

### Menambah Halaman:
1. Tambah section baru di `index.html`
2. Tambah navigation item di bottom nav
3. Update JavaScript untuk handling navigasi

## 🛠️ Teknologi

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - ES6+ features
- **Service Worker API** - Offline caching
- **Web App Manifest** - PWA installation
- **SVG Icons** - Scalable vector graphics

## 📋 Checklist PWA

- ✅ Web App Manifest
- ✅ Service Worker
- ✅ HTTPS (GitHub Pages auto-enable)
- ✅ Responsive Design
- ✅ Offline Functionality
- ✅ App-like Experience
- ✅ Install Prompts

## 🔍 Testing

### Local Testing:
1. Serve dengan HTTP server (bukan file://)
2. Buka Developer Tools → Application
3. Check Manifest dan Service Worker tabs
4. Test offline di Network tab

### Production Testing:
1. Deploy ke GitHub Pages
2. Test di mobile device
3. Coba install sebagai PWA
4. Test offline functionality

## 🐛 Troubleshooting

### PWA tidak bisa di-install:
- Pastikan HTTPS aktif
- Check manifest.json valid (gunakan web validator)
- Pastikan Service Worker ter-register
- Test di Chrome DevTools → Lighthouse

### Service Worker tidak bekerja:
- Clear browser cache
- Check console errors
- Pastikan scope manifest sesuai dengan struktur file

### iOS fullscreen tidak bekerja:
- Pastikan meta tag `apple-mobile-web-app-capable="yes"`
- Add to Home Screen dari Safari (bukan Chrome)
- Test di device fisik, bukan simulator

## 📚 Resources

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Manifest Generator](https://app-manifest.firebaseapp.com/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## 📄 License

MIT License - bebas digunakan untuk project apapun.

---

**Dibuat dengan ❤️ untuk kemudahan deployment PWA di GitHub Pages**
