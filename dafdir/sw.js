// Nama cache unik untuk versi aplikasi Anda
const CACHE_NAME = 'absensi-edip-cache-v2'; // Versi dinaikkan untuk memicu update

// Daftar lengkap semua file dan aset yang perlu disimpan untuk mode offline
const urlsToCache = [
  // Halaman utama dan file PWA
  'index.html',
  'manifest.json',
  
  // Aset dari CDN (CSS, JS, Ikon)
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css',
  'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js',
  'https://newsiga-siga.bkkbn.go.id/icon_bkkbn.png',
  
  // Model-model untuk face-api.js (SANGAT PENTING untuk offline)
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/tiny_face_detector_model-weights_manifest.json',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/tiny_face_detector_model.weights',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/face_landmark_68_net_model-weights_manifest.json',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/face_landmark_68_net_model.weights',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/face_recognition_model-weights_manifest.json',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/face_recognition_model.weights',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/ssd_mobilenetv1_model-weights_manifest.json',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights/ssd_mobilenetv1_model.weights'
];

// Event 'install': Dijalankan saat service worker pertama kali diinstal
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka, menyimpan aset untuk offline...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Gagal menyimpan cache saat instalasi:', err);
      })
  );
});

// Event 'fetch': Dijalankan setiap kali aplikasi meminta sumber daya
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika aset ditemukan di cache, kembalikan dari cache
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari jaringan
        return fetch(event.request);
      })
  );
});

// Event 'activate': Dijalankan untuk membersihkan cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
