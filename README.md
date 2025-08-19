# Karyawan Reporting

![Proyek Karyawan Reporting](https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop)

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

## Cara Memulai

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal kamu. Kamu perlu menjalankan kedua repositori (_frontend_ dan _backend_) secara bersamaan.

### 1. Backend API

Pertama, siapkan _backend_ API.

1.  **Klon Repositori Backend**:

    ```bash
    git clone [https://github.com/farisrahman674/BE-Karyawan-Report.git](https://github.com/farisrahman674/BE-Karyawan-Report.git)
    cd BE-Karyawan-Report
    ```

2.  **Instal Dependensi**:

    ```bash
    npm install
    ```

3.  **Konfigurasi Lingkungan**: Buat file `.env` di _root_ direktori dan tambahkan variabel lingkungan yang diperlukan untuk koneksi _database_.

    ```env
    DATABASE_URL="postgresql://[USER]:[PASSWORD]@db.[SUPABASE_ID].supabase.co:5432/postgres"
    SUPABASE_URL="https://[SUPABASE_ID].supabase.co"
    SUPABASE_ANON_KEY="[YOUR_SUPABASE_ANON_KEY]"
    JWT_SECRET="[YOUR_OWN_SECURE_JWT_SECRET]"
    ```

4.  **Jalankan Aplikasi**:
    ```bash
    npm run dev
    ```
    Backend akan berjalan di port yang sudah dikonfigurasi, biasanya `http://localhost:5000`.

### 2. Frontend

Selanjutnya, jalankan aplikasi _frontend_.

1.  **Klon Repositori Frontend**:

    ```bash
    git clone [https://github.com/farisrahman674/FE-Karyawan-Report.git](https://github.com/farisrahman674/FE-Karyawan-Report.git)
    cd FE-Karyawan-Report
    ```

2.  **Instal Dependensi**:

    ```bash
    npm install
    ```

3.  **Konfigurasi Lingkungan**: Buat file `.env` di _root_ direktori. Pastikan URL-nya mengarah ke _backend_ yang sudah kamu jalankan.

    ```env
    NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
    ```

4.  **Jalankan Aplikasi**:
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:3000` atau port lain yang tersedia.
