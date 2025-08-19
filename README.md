# Karyawan Reporting

## Deskripsi Proyek

**Karyawan Reporting** adalah sebuah aplikasi web yang dirancang untuk memfasilitasi proses pelaporan tugas dari karyawan kepada manajer. Proyek ini memberikan platform yang sederhana namun efektif bagi karyawan untuk mengunggah tugas yang telah diselesaikan. Sementara itu, manajer dapat dengan mudah meninjau, memeriksa, dan memvalidasi hasil pekerjaan yang telah dikirimkan.

Aplikasi ini dibuat dengan pendekatan umum sehingga dapat digunakan oleh berbagai departemen tanpa perlu penyesuaian spesifik, menjadikannya solusi yang fleksibel untuk manajemen tugas internal.

## Fitur Utama

### Sisi Karyawan

- **Unggah Tugas**: Karyawan dapat mengunggah tugas yang sudah dikerjakan melalui antarmuka yang intuitif.
- **Edit dan Revisi**: Karyawan bisa mengedit atau memperbarui tugas yang sudah diunggah jika ada revisi yang diperlukan.
- **Riwayat Tugas**: Melihat daftar tugas yang telah diunggah sebelumnya.

### Sisi Manajer

- **Pemeriksaan Tugas**: Manajer dapat meninjau semua tugas yang diunggah oleh karyawan.
- **Validasi**: Manajer dapat memvalidasi dan memberikan persetujuan pada tugas yang telah diperiksa.

---

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan _stack_ teknologi modern untuk memastikan performa dan skalabilitas yang optimal.

- **Frontend**:
  - **Next.js**: Framework React untuk _server-side rendering_ (SSR) dan performa yang lebih cepat.
  - **TypeScript**: Menambahkan _static typing_ untuk kode yang lebih terstruktur dan bebas dari kesalahan.
- **Backend**:
  - **Express.js**: Framework backend untuk Node.js yang kuat dan fleksibel.
  - **TypeScript**: Menjaga konsistensi bahasa di seluruh _stack_.

---

## Cara Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal kamu.

### 1. Klon Repositori

git clone [https://github.com/farisrahman674/FE-Karyawan-Report.git]
cd karyawan-reporting

### 2. Instal Dependensi

Jalankan perintah berikut untuk menginstal semua library yang diperlukan:
npm install

### 3. Konfigurasi Lingkungan

Buat file .env di root direktori proyek dan tambahkan variabel lingkungan berikut:
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
**Catatan**: Sesuaikan URL backend (http://localhost:5000/api) dengan alamat API yang kamu gunakan.

## Cara Menjalankan Aplikasi

Setelah semua langkah instalasi selesai, kamu bisa menjalankan aplikasi dengan perintah:
npm run dev
Aplikasi akan berjalan di http://localhost:3000 atau port lain yang tersedia.
