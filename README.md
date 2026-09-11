# ArtzShop E-commerce Frontend

Frontend aplikasi e-commerce ArtzShop yang dibangun dengan Nuxt dan Vue.js. Aplikasi ini terhubung ke E-commerce Backend API untuk menyediakan pengalaman belanja bagi customer dan dashboard operasional bagi admin.

## Fitur

### Customer

- Halaman katalog dan pencarian produk
- Filter kategori, sorting, dan pagination
- Detail produk dan galeri gambar
- Register, login, dan session authentication
- Keranjang belanja
- Checkout dan alamat pengiriman
- Riwayat pesanan dan detail status pesanan
- Review produk
- Halaman akun dan pengelolaan alamat

### Admin

- Dashboard admin
- CRUD produk dan kategori
- Upload gambar produk
- Daftar dan detail pesanan
- Update status pesanan
- Moderasi review

## Tech Stack

- Nuxt 4
- Vue 3
- Pinia
- VueUse
- UnoCSS
- Nuxt Icon dan Nuxt Image
- VeeValidate
- Vue Sonner
- html2pdf.js

## Prasyarat

- Node.js 20 atau lebih baru
- npm
- E-commerce Backend API berjalan

## Instalasi

```bash
npm install
```

API base URL dikonfigurasi di `nuxt.config.ts` melalui `runtimeConfig.public.apiBase`. Nilai default untuk development adalah:

```text
http://localhost:8000
```

Sesuaikan URL tersebut dengan alamat E-commerce Backend API yang digunakan.

## Menjalankan Project

Development server:

```bash
npm run dev
```

Buka `http://localhost:3000` di browser.

Build production:

```bash
npm run build
npm run preview
```

Generate static output jika diperlukan:

```bash
npm run generate
```

## Integrasi Backend

Frontend memakai bearer token dari auth store untuk request yang membutuhkan autentikasi. Token dikirim otomatis oleh composable `useApi` pada header:

```text
Authorization: Bearer <access-token>
```

Backend harus mengizinkan origin frontend melalui konfigurasi `CORS_ORIGIN`. Untuk setup lokal, backend biasanya menggunakan:

```text
CORS_ORIGIN=http://localhost:3000
```

## Struktur Project

```text
app/
	components/      Komponen UI, layout, product, cart, dan modal
	composables/     Helper request API
	layouts/         Layout default, auth, dan admin
	middleware/      Guard auth, guest, dan admin
	pages/           Halaman customer, auth, checkout, order, dan admin
	plugins/         Plugin integrasi API
	stores/          State auth, cart, dan UI dengan Pinia
	utils/           Helper currency dan date
server/
	api/             Proxy endpoint RajaOngkir
public/            Asset statis
```

## Halaman Utama

| Area | Route |
| --- | --- |
| Beranda | `/` |
| Produk | `/products` |
| Detail produk | `/products/:id` |
| Login | `/auth/login` |
| Register | `/auth/register` |
| Checkout | `/checkout` |
| Akun | `/account` |
| Pesanan | `/account/orders`, `/orders/:id` |
| Admin | `/admin` |

## Project Terkait

Backend API tersedia di [e-commerce_backend](https://github.com/Salman-artz/e-commerce_backend).

## Catatan Deployment

- Set API base URL ke backend production sebelum build.
- Pastikan backend mengizinkan domain frontend pada `CORS_ORIGIN`.
- Jangan memasukkan credential atau token ke dalam source code.
- Gunakan `npm run build` lalu `npm run preview` untuk memeriksa hasil build production.
