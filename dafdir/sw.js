// Nama cache unik (ubah jika ada pembaruan besar, misal: v3, v4)
const CACHE_NAME = 'absensi-edip-cache-v2';

// Daftar semua aset yang dibutuhkan aplikasi untuk berjalan offline
const urlsToCache = [
  '.', // Alias untuk direktori root (sama dengan 'index.html')
  'index.html',
  'manifest.json',
  
  // Aset dari CDN (Styling dan Library)
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

// Event 'install': Menyimpan semua aset ke dalam cache
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache dibuka, menyimpan aset untuk offline...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Gagal menyimpan aset ke cache:', err);
      })
  );
});

// Event 'activate': Membersihkan cache versi lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Event 'fetch': Mengambil aset dari cache jika tersedia (Cache First Strategy)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
  );
});
