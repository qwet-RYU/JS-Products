// ============================================================
// Product Explorer — script.js
// SEMUA LOGIC DITULIS MANUAL DI SINI (file ini masih kosong).
// Data dari API: https://dummyjson.com/products
// ============================================================
//
// PETA ELEMEN (ambil pakai document.getElementById):
//   #searchInput     -> input pencarian (event "input")
//   #categoryFilter  -> select kategori (event "change")
//   #sortSelect      -> select sorting (event "change")
//   #resetButton     -> tombol reset filter (event "click")
//   #loadingState    -> elemen status loading (tampilkan saat fetch)
//   #errorState      -> elemen pesan error (tampilkan saat fetch gagal)
//   #productCounter  -> teks jumlah produk, contoh: "5 dari 100 product ditampilkan."
//   #productGrid     -> container grid; render semua product card di sini
//   #productModal    -> container modal (buka/tutup dengan class "hidden")
//   #closeModal      -> tombol tutup modal
//   #modalContent    -> area isi detail produk di dalam modal
//
// TIPS UMUM:
//   - Untuk menyembunyikan / menampilkan elemen, tambah / hapus class "hidden"
//     pada elemennya.
//   - State aplikasi bisa disimpan dalam beberapa variabel, misalnya:
//     semua produk dari API, hasil pencarian, kategori terpilih, dan urutan.
//   - Search + filter + sorting harus DIJALANKAN BERSAMAAN (satu fungsi
//     "render" yang menggabungkan semuanya setiap kali ada perubahan).
//
// ------------------------------------------------------------
// 1. AMBIL SEMUA ELEMEN YANG DIBUTUHKAN
//    - Simpan setiap elemen di atas ke dalam sebuah konstanta/variabel.
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortSelect = document.getElementById('sortSelect');
const resetButton = document.getElementById('resetButton');

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const productCounter = document.getElementById('productCounter');
const productGrid = document.getElementById('productGrid');

const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalContent = document.getElementById('modalContent');
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 2. SIMPAN STATE APLIKASI
//    - Array semua produk (dari API), array produk yang sedang tampil,
//      nilai pencarian, kategori terpilih, dan mode sorting.
const API_URL = 'https://dummyjson.com/products?limit=0';

let products = [];
let displayedProducts = [];
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 3. AMBIL DATA DARI API (fetch)
//    - URL: https://dummyjson.com/products
//    - Sebelum fetch: tampilkan #loadingState, sembunyikan #errorState.
//    - Setelah berhasil: simpan data produk, sembunyikan #loadingState,
//      lalu render produk ke #productGrid.
//    - Jika gagal: sembunyikan #loadingState, tampilkan #errorState.
async function loadProducts() {
  loadingState.classList.remove('hidden');
  errorState.classList.add('hidden');

  try { // Kode yang berpotensi menimbulkan error
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Request gagal: ${response.status}`);
    }

    const data = await response.json();

    products = data.products;
    displayedProducts = [...products];

    renderProducts(displayedProducts);
  } catch (error) {   // Kode untuk menangani error
    console.error('Gagal mengambil produk:', error);
    errorState.classList.remove('hidden');
  } finally {    // (Opsional) Kode yang selalu dijalankan, error atau tidak
    loadingState.classList.add('hidden');
  }
}
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 4. RENDER PRODUCT CARD
//    - Kosongkan #productGrid, lalu buat satu card untuk setiap produk.
//    - Struktur card boleh meniru card contoh di index.html:
//      gambar (thumbnail), badge kategori, judul, harga, rating,
//      dan tombol "Lihat Detail".
//    - Card contoh di HTML sebaiknya dihapus saat data sudah dirender.
function renderProducts(productList) {
  productGrid.innerHTML = '';

  if (productList.length === 0) {
  productGrid.innerHTML = `
    <p class="empty-message">Produk tidak ditemukan.</p>
  `;

  productCounter.textContent =
    `0 dari ${products.length} product ditampilkan.`;

  return;
}

  for (let i = 0; i < productList.length; i++) {
    const product = productList[i];

    const productCard = document.createElement('article');
    productCard.className = 'product-card';

    productCard.innerHTML = `
      <img
        class="product-image"
        src="${product.thumbnail}"
        alt="${product.title}"
      >

      <div class="product-body">
        <span class="product-category">${product.category}</span>

        <h2 class="product-title">${product.title}</h2>

        <div class="product-meta">
          <span class="product-price">$${product.price}</span>
          <span class="product-rating">★ ${product.rating}</span>
        </div>

        <button
          type="button"
          class="detail-button"
          data-id="${product.id}"
        >
          Lihat Detail
        </button>
      </div>
    `;

    productGrid.appendChild(productCard);
  }

  productCounter.textContent =
    `${productList.length} dari ${products.length} product ditampilkan.`;
}
// ------------------------------------------------------------
// FUNGSI GABUNGAN
function applyFilters() {
  
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortSelect.value;

  let result = [...products];
// ------------------------------------------------------------
// 5. SEARCH (pencarian nama)
//    - Dengarkan event "input" pada #searchInput.
//    - Filter produk yang judulnya mengandung teks pencarian
//      (tanpa refresh halaman).
if (searchText !== '') {
    result = result.filter(product => {
      return product.title.toLowerCase().includes(searchText);
    });
  }
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 6. FILTER KATEGORI
//    - Dengarkan event "change" pada #categoryFilter.
//    - value "all" = tampilkan semua, selain itu cocokkan
//      dengan field category produk.
 if (selectedCategory !== 'all') {
    result = result.filter(product => {
      return product.category === selectedCategory;
    });
  }
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 7. SORTING
//    - Dengarkan event "change" pada #sortSelect.
//    - value: "default" (urutan asli), "price-asc" (harga terendah),
//      "price-desc" (harga tertinggi), "rating-desc" (rating tertinggi),
//      "name-asc" (nama A-Z).
if (selectedSort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  }

  if (selectedSort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  if (selectedSort === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating);
  }

  if (selectedSort === 'name-asc') {
    result.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  displayedProducts = result;
  renderProducts(displayedProducts);
}

// event listeners
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 8. RESET FILTER
//    - Saat #resetButton diklik: kosongkan #searchInput,
//      #categoryFilter kembali ke "all", #sortSelect kembali ke "default",
//      lalu render ulang semua produk.
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  sortSelect.value = 'default';

  applyFilters();
});
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 9. PRODUCT COUNTER
//    - Setiap kali produk dirender, tulis teks jumlah ke #productCounter,
//      contoh: "100 dari 100 product ditampilkan."
// ------------------------------------------------------------
//
// ------------------------------------------------------------
// 10. MODAL DETAIL
//    - Saat tombol "Lihat Detail" pada card diklik: isi #modalContent dengan
//      detail produk (thumbnail, category, title, description, price,
//      rating, stock, brand), lalu hapus class "hidden" dari #productModal.
//    - Saat #closeModal diklik (atau overlay diklik): tambahkan kembali
//      class "hidden" ke #productModal. Tanpa refresh halaman.
function openProductModal(id) {
  const product = products.find(product => product.id === id);

  if (!product) {
    return;
  }

  modalContent.innerHTML = `
    <h2 id="modalTitle">${product.title}</h2>

    <img
      class="product-image"
      src="${product.thumbnail}"
      alt="${product.title}"
    >

    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Description:</strong> ${product.description}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Rating:</strong> ★ ${product.rating}</p>
    <p><strong>Stock:</strong> ${product.stock}</p>
    <p><strong>Brand:</strong> ${product.brand || 'Tidak tersedia'}</p>
  `;

  productModal.classList.remove('hidden');
}

// event delegation untuk tombol detail
productGrid.addEventListener('click', event => {
  const detailButton = event.target.closest('.detail-button');

  if (!detailButton) {
    return;
  }

  const id = Number(detailButton.dataset.id);
  openProductModal(id);
});

// tutup modal
function closeProductModal() {
  productModal.classList.add('hidden');
}

closeModal.addEventListener('click', closeProductModal);

// tutup modal selain tombol
productModal.addEventListener('click', event => {
  if (event.target === productModal) {
    closeProductModal();
  }
});
// ------------------------------------------------------------



// run products
loadProducts();
