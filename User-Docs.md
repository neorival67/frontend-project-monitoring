# 📖 Panduan Pengguna — Dashboard Monitoring Proyek

**Versi Dokumen**: 1.0.0 | **Terakhir Diperbarui**: Juni 2026

---

## Daftar Isi

1. [Memulai — Login & Registrasi](#1-memulai--login--registrasi)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Manajemen Proyek](#3-manajemen-proyek)
4. [Detail Proyek](#4-detail-proyek)
5. [Master Tim (Anggota Tim)](#5-master-tim-anggota-tim)
6. [Master Client & Vendor](#6-master-client--vendor)
7. [Profil Pengguna](#7-profil-pengguna)
8. [Panduan per Role](#8-panduan-per-role)
9. [Pertanyaan Umum (FAQ)](#9-pertanyaan-umum-faq)

---

## 1. Memulai — Login & Registrasi

### 1.1 Login

1. Buka aplikasi di browser Anda (contoh: `http://[IP-SERVER]:3000/login`)
2. Masukkan **Email** dan **Password** akun Anda
3. Klik tombol **"Masuk"**
4. Jika berhasil, Anda akan diarahkan ke halaman Dashboard

> **Tips:** Gunakan ikon 👁 di sebelah kanan kolom password untuk menampilkan/menyembunyikan password yang diketik.

**Pesan error yang mungkin muncul:**
- `Email atau password salah` → Periksa kembali kredensial Anda
- `Akun Anda tidak aktif` → Hubungi Admin untuk mengaktifkan akun

---

### 1.2 Registrasi Akun Baru

> ⚠️ Fitur registrasi mandiri hanya untuk role **ADMIN** dan **PM**. Role lain (Vendor, Tim, Client) mendapatkan akun melalui undangan dari Admin/PM.

1. Dari halaman Login, klik **"Daftar sekarang"**
2. Isi semua kolom yang tersedia:
   - **Nama Lengkap**
   - **Email**
   - **Password** (minimal 6 karakter)
   - **Role** (Admin atau PM)
3. Klik **"Daftar"**
4. Setelah berhasil, Anda akan diarahkan kembali ke Login

---

### 1.3 Aktivasi Akun via Undangan

Jika Anda menerima **link undangan** dari Admin/PM (dikirim via WhatsApp atau email):

1. Buka link undangan yang diberikan
2. Anda akan diarahkan ke halaman **Accept Invite** atau **Activate**
3. Buat password baru untuk akun Anda
4. Klik **"Aktifkan Akun"**
5. Setelah berhasil, login menggunakan email dan password yang baru dibuat

---

### 1.4 Logout

Untuk keluar dari sistem:
- Klik nama/avatar akun di sidebar atau header
- Pilih **"Logout"**
- Anda akan diarahkan kembali ke halaman Login

---

## 2. Dashboard Overview

Halaman ini menampilkan **ringkasan kondisi seluruh proyek** secara real-time.

> 🔒 **Akses:** ADMIN dan PM melihat semua data. CLIENT hanya melihat data proyek mereka. VENDOR, TIM, dan STAFF tidak memiliki akses ke halaman ini.

---

### 2.1 Kartu Statistik Utama

Di bagian atas terdapat 4 kartu statistik:

| Kartu | Isi |
|---|---|
| 📁 **Total Proyek** | Jumlah proyek yang terdaftar di sistem |
| 📈 **Total Budget** | Akumulasi anggaran seluruh proyek (dalam juta Rupiah) |
| ⚠️ **Total Risiko** | Jumlah risiko yang teridentifikasi |
| ✅ **Total Deliverable** | Jumlah deliverable yang ada |

---

### 2.2 Proyek Aktif

Menampilkan daftar proyek yang sedang berjalan beserta:
- **Kode proyek** dan **status** (label biru)
- **Nama proyek** dan **tanggal selesai**
- **Progress bar** beserta persentase
- **Budget** proyek

---

### 2.3 Chart Analitik

Terdapat 2 chart perbandingan:

**Chart Budget vs Realisasi**
- Bar chart yang menampilkan selisih antara anggaran yang direncanakan vs yang sudah terpakai per proyek

**Chart Target vs Aktual Progress**
- Bar chart yang menampilkan perbandingan target progress yang seharusnya vs progress aktual

---

### 2.4 Analitik Prediktif (EVM)

Bagian ini menggunakan metode **Earned Value Management** untuk memberikan prediksi:

**Forecast Kinerja (CPI/SPI)**
- Menampilkan metrik EV (Earned Value) dan progress aktual per proyek

**Prediksi Overbudget (EAC)**
- Membandingkan BAC (Budget at Completion) dengan prediksi EAC
- Label 🟢 **Aman** atau 🔴 **Overbudget** ditampilkan untuk setiap proyek

**Analisis Vendor**
- Ringkasan performa vendor berdasarkan skor keseluruhan
- Bar progress menampilkan tingkat penyelesaian

---

### 2.5 Distribusi Risiko

Donut chart yang menampilkan jumlah risiko berdasarkan level:
- 🔵 **Low** (Rendah)
- 🟡 **Medium** (Sedang)
- 🟠 **High** (Tinggi)
- 🔴 **Critical** (Kritis)

---

### 2.6 Aktivitas Terkini

Daftar aktivitas proyek yang baru-baru ini diperbarui, menampilkan:
- Nama aktivitas
- Nama proyek terkait
- Progress aktivitas (mini progress bar)

---

## 3. Manajemen Proyek

Halaman ini (`/proyek`) menampilkan **daftar semua proyek** dalam bentuk kartu.

---

### 3.1 Melihat Daftar Proyek

Setiap kartu proyek menampilkan:
- Nama dan kode proyek
- Status proyek (Planning, On Going, Closing)
- Progress keseluruhan
- Informasi client dan vendor
- Timeline (tanggal mulai - selesai)
- Budget

**Filter & Pencarian:**
- Gunakan kolom pencarian untuk mencari berdasarkan **nama** atau **kode** proyek
- Gunakan tab filter untuk menyaring berdasarkan status:
  - `All` — Semua proyek
  - `Planning` — Proyek dalam tahap perencanaan
  - `On Going` — Proyek yang sedang berjalan
  - `Closing` — Proyek yang dalam proses penutupan

---

### 3.2 Membuat Proyek Baru *(ADMIN & PM)*

1. Klik tombol **"+ Buat Proyek Baru"** (pojok kanan atas)
2. Isi form yang muncul:
   - **Nama Proyek** *(wajib)*
   - **Deskripsi** proyek
   - **Objectives** / Tujuan proyek
   - **Client** — pilih dari daftar client terdaftar *(wajib)*
   - **Tanggal Mulai** dan **Tanggal Selesai** *(wajib)*
   - **Budget** (dalam Rupiah) *(wajib)*
   - **Status** awal proyek
   - **Vendor** — pilih satu atau lebih vendor
   - **Anggota Tim** — pilih anggota dari daftar tim internal
3. Klik **"Simpan"** untuk membuat proyek

---

### 3.3 Menghapus Proyek *(ADMIN & PM)*

1. Pada kartu proyek, klik tombol **Hapus** (ikon 🗑️)
2. Konfirmasi penghapusan pada modal yang muncul
3. Klik **"Hapus"** untuk melanjutkan

> ⚠️ **Perhatian:** Penghapusan proyek bersifat permanen dan tidak dapat dibatalkan.

---

### 3.4 Membuka Detail Proyek

Klik nama proyek atau kartu proyek untuk membuka **halaman detail proyek** lengkap.

---

## 4. Detail Proyek

Halaman detail proyek memiliki **6 tab** yang masing-masing mengelola aspek berbeda dari proyek.

---

### 4.1 Tab Overview

Menampilkan informasi lengkap proyek:
- Deskripsi dan tujuan proyek
- Status, budget, dan timeline
- Daftar client, vendor, dan anggota tim
- Ringkasan progres keseluruhan

---

### 4.2 Tab Monitoring

Memantau perkembangan aktivitas proyek:
- Daftar semua aktivitas dengan status dan progress
- Tambah log aktivitas harian
- Lihat histori log per aktivitas
- Manajemen risiko proyek (tambah/hapus risiko)

**Cara menambah Aktivitas:**
1. Klik **"+ Tambah Aktivitas"**
2. Isi nama, deskripsi, tanggal, kategori, bobot, dan budget
3. Pilih anggota yang bertanggung jawab
4. Klik **"Simpan"**

**Cara input Log Aktivitas:**
1. Pada aktivitas yang ingin diperbarui, klik **"+ Log"**
2. Isi deskripsi pekerjaan, tanggal log, progress yang ditambahkan, dan biaya
3. Klik **"Simpan Log"**

---

### 4.3 Tab Planning (Gantt Chart)

Menampilkan **Gantt Chart** interaktif untuk visualisasi timeline proyek:
- Setiap aktivitas ditampilkan sebagai bar horizontal
- Warna bar mengindikasikan status aktivitas
- Hover untuk melihat detail aktivitas

---

### 4.4 Tab Approval

Mengelola proses **review dan persetujuan deliverable** proyek.

**Alur Pengajuan Deliverable (VENDOR/TIM):**
1. Klik **"Submit Deliverable"**
2. Pilih aktivitas terkait
3. Upload file lampiran (jika ada)
4. Klik **"Submit"**

**Alur Review Deliverable (ADMIN/CLIENT):**
1. Pilih deliverable yang ingin direview
2. Klik **"Review"**
3. Berikan komentar/catatan
4. Pilih keputusan: **Approve** ✅ atau **Reject** ❌
5. Klik **"Submit Review"**

> 🔒 Tombol "Review" hanya muncul untuk role **ADMIN** dan **CLIENT**.

---

### 4.5 Tab Tim

Mengelola anggota tim yang terlibat dalam proyek:
- Lihat daftar anggota tim proyek
- Undang anggota baru ke proyek
- Lihat peran masing-masing anggota dalam proyek

**Cara Mengundang Anggota:**
1. Klik **"+ Undang Anggota"**
2. Isi informasi email dan role dalam proyek
3. Link undangan akan digenerate
4. Salin link dan bagikan via **WhatsApp** atau media lain kepada yang bersangkutan

---

### 4.6 Tab Closing (Penutupan Proyek)

Tahap akhir proyek yang harus dilakukan secara berurutan:

**Langkah 1 — Upload Dokumen BAST**
1. Klik tombol **"Upload BAST"**
2. Pilih file PDF dokumen Berita Acara Serah Terima
3. File akan diunggah ke sistem
4. Setelah berhasil, tombol berubah menjadi **"Download BAST"** untuk verifikasi

**Langkah 2 — Verifikasi Aktivitas**
- Semua aktivitas proyek ditampilkan dalam daftar
- Klik **"Verifikasi"** pada setiap aktivitas yang sudah selesai
- Progress bar menunjukkan persentase aktivitas yang terverifikasi
- Semua aktivitas **harus** diverifikasi 100% sebelum dapat menutup proyek

**Langkah 3 — Tutup Proyek**
- Setelah semua aktivitas terverifikasi (100%), tombol **"Tutup Proyek"** akan muncul
- Klik tombol tersebut untuk secara resmi menutup proyek
- Konfirmasi dengan membaca notifikasi yang muncul

**Langkah 4 — Generate Laporan PDF**
- Setelah proyek ditutup, tombol **"Generate Laporan"** akan muncul
- Klik untuk men-download laporan penutupan proyek dalam format **PDF**
- Laporan berisi daftar semua aktivitas yang telah terverifikasi

---

## 5. Master Tim (Anggota Tim)

Halaman ini (`/master-tim`) mengelola **database anggota tim internal** perusahaan.

---

### 5.1 Melihat Daftar Anggota Tim

Anggota tim ditampilkan dalam bentuk **kartu grid** yang menampilkan:
- Avatar dengan inisial nama (berwarna otomatis)
- Nama lengkap dan posisi/jabatan
- Email dan nomor telepon
- Department dan status akun (badge)
- Daftar skills (hingga 3 skill, lebih akan ditampilkan sebagai `+N`)

---

### 5.2 Pencarian & Filter

- **Kotak Pencarian**: Cari berdasarkan nama, email, atau nomor telepon
- **Filter Department**: Filter berdasarkan departemen:
  - Engineering
  - Design
  - Business
  - QA
  - PMO
  - Lainnya

> Filter dan pencarian bekerja secara bersamaan dan diperbarui secara real-time.

---

### 5.3 Menambah Anggota Tim Baru

1. Klik tombol **"+ Tambah Anggota"**
2. Isi form yang muncul:
   - **Department** *(wajib)* — pilih dari dropdown
   - **Status** — Active, Inactive, atau Pending
   - **Nama Lengkap** *(wajib)*
   - **Posisi/Jabatan** *(wajib)*
   - **Email** *(wajib)* — digunakan sebagai username login
   - **Nomor Telepon**
   - **Skills** — ketik skill dan tekan Enter atau klik tombol **+** untuk menambahkan
3. Klik **"Simpan"** untuk menyimpan data

---

### 5.4 Mengedit Data Anggota Tim

1. Klik tombol edit (ikon ✎) pada kartu anggota yang ingin diubah, **atau** klik header kartu
2. Form akan terbuka dengan data yang sudah terisi otomatis
3. Ubah data yang diperlukan
   > ⚠️ **Catatan:** Kolom **Email** tidak dapat diubah setelah data dibuat
4. Untuk menambah skill baru, ketik di kotak skill dan tekan Enter
5. Untuk menghapus skill, klik tanda **×** di sebelah skill tersebut
6. Klik **"Simpan"** untuk menyimpan perubahan

---

### 5.5 Menghapus Anggota Tim

1. Klik tombol hapus (ikon 🗑️) pada kartu anggota
2. Modal konfirmasi akan muncul dengan peringatan
3. Klik **"Hapus"** untuk mengkonfirmasi penghapusan

> ⚠️ **Perhatian:** Data yang dihapus tidak dapat dikembalikan.

---

## 6. Master Client & Vendor

Halaman ini (`/clients`) mengelola **master data client dan vendor** perusahaan.

---

### 6.1 Melihat Daftar Data

Data ditampilkan dalam format **tabel** dengan kolom:
- Nama Perusahaan
- Tipe (Client / Vendor)
- Industri
- PIC (Person in Charge)
- Email
- Status (Aktif / Tidak Aktif)
- Tombol Aksi

**Statistik Ringkasan** tersedia di bagian atas:
- Total Data
- Jumlah Client
- Jumlah Vendor
- Jumlah Aktif

---

### 6.2 Pencarian & Filter

- **Kotak Pencarian**: Cari berdasarkan nama perusahaan, PIC, atau email
- **Filter Tipe**: Semua / Client / Vendor
- **Filter Status**: Semua / Aktif / Tidak Aktif

---

### 6.3 Menambah Client/Vendor Baru

1. Klik tombol **"+ Tambah Baru"**
2. Isi form:
   - **Tipe** — Client atau Vendor
   - **Status** — Aktif atau Tidak Aktif
   - **Nama Perusahaan** *(wajib)*
   - **Industri** (opsional)
   - **Person in Charge (PIC)** — nama kontak utama
   - **Email** perusahaan
   - **Nomor Telepon**
   - **Alamat** lengkap perusahaan
3. Klik **"Simpan"**

---

### 6.4 Melihat Detail

Klik nama perusahaan atau tombol 👁 untuk melihat **detail lengkap** termasuk:
- Semua informasi kontak
- Tanggal dibuat dan terakhir diperbarui
- Tombol Edit dan Hapus langsung dari modal detail

---

### 6.5 Mengedit Data

1. Klik tombol ✏️ pada baris data yang ingin diubah
2. Ubah informasi yang diperlukan
3. Klik **"Simpan Perubahan"**

---

### 6.6 Menghapus Data

1. Klik tombol 🗑️ pada baris data
2. Konfirmasi penghapusan pada modal yang muncul
3. Klik **"Hapus"** untuk mengkonfirmasi

> ⚠️ **Perhatian:** Data yang dihapus tidak dapat dikembalikan. Pastikan data tidak sedang digunakan di proyek aktif.

---

## 7. Profil Pengguna

Halaman ini memungkinkan Anda untuk mengelola informasi akun pribadi.

**Informasi yang dapat dilihat dan diubah:**
- Nama lengkap
- Email (tampilan saja, tidak dapat diubah)
- Role / jabatan dalam sistem
- Nomor telepon
- Department
- Skills

---

## 8. Panduan per Role

### 👑 ADMIN
Memiliki akses penuh ke seluruh fitur sistem:
- ✅ Lihat semua proyek dan data dashboard
- ✅ Buat, edit, dan hapus proyek
- ✅ Kelola Master Tim dan Client/Vendor
- ✅ Review dan approve deliverable
- ✅ Tutup proyek dan generate laporan
- ✅ Undang anggota baru

---

### 📋 PM (Project Manager)
Akses hampir sama dengan Admin:
- ✅ Lihat semua proyek dan data dashboard
- ✅ Buat dan kelola proyek
- ✅ Kelola tim dan client/vendor
- ✅ Tutup proyek dan generate laporan
- ✅ Undang anggota baru
- ❌ Tidak dapat approve/review deliverable (hanya ADMIN & CLIENT)

---

### 🏢 CLIENT
Akses terbatas pada proyek yang terkait dengan perusahaan mereka:
- ✅ Lihat dashboard proyek mereka saja
- ✅ Lihat daftar dan detail proyek mereka
- ✅ Review dan approve deliverable proyek mereka
- ❌ Tidak dapat membuat atau mengelola proyek
- ❌ Tidak dapat mengakses Master Tim atau Client/Vendor
- ❌ Tidak dapat menutup proyek

---

### 🤝 VENDOR
Akses terbatas pada proyek tempat mereka terlibat:
- ❌ Tidak dapat mengakses Dashboard Overview
- ✅ Lihat proyek tempat mereka dilibatkan
- ✅ Submit deliverable pada proyek mereka
- ✅ Input log aktivitas
- ❌ Tidak dapat membuat proyek
- ❌ Tidak dapat menutup proyek atau approve deliverable

---

### 👤 TIM (Anggota Tim Internal)
Akses terbatas pada proyek tempat mereka ditugaskan:
- ❌ Tidak dapat mengakses Dashboard Overview
- ✅ Lihat proyek tempat mereka ditugaskan
- ✅ Input log aktivitas pada proyek mereka
- ✅ Submit deliverable
- ❌ Tidak dapat membuat proyek
- ❌ Tidak dapat menutup proyek atau approve deliverable

---

## 9. Pertanyaan Umum (FAQ)

**Q: Mengapa saya tidak bisa melihat Dashboard Overview?**
> A: Dashboard Overview hanya dapat diakses oleh role ADMIN, PM, dan CLIENT. Role VENDOR dan TIM tidak memiliki akses ke halaman ini.

---

**Q: Saya CLIENT tapi tidak melihat proyek saya di dashboard, kenapa?**
> A: Pastikan akun Anda sudah terhubung dengan data perusahaan (companyId) yang sesuai dengan proyek. Hubungi Admin untuk memverifikasi.

---

**Q: Mengapa tombol "Review" tidak muncul di tab Approval?**
> A: Tombol Review hanya tersedia untuk role **ADMIN** dan **CLIENT**. Jika Anda adalah VENDOR atau TIM, Anda hanya dapat melihat status review.

---

**Q: Mengapa tombol "Tutup Proyek" belum muncul?**
> A: Pastikan **semua aktivitas** sudah diverifikasi (progress 100%). Tombol baru akan muncul setelah semua aktivitas berstatus terverifikasi.

---

**Q: Bagaimana cara mengubah email saya?**
> A: Email tidak dapat diubah setelah akun dibuat karena digunakan sebagai identitas unik. Hubungi Admin jika ada kebutuhan khusus.

---

**Q: Saya lupa password, bagaimana cara reset?**
> A: Fitur reset password mandiri belum tersedia. Hubungi Admin untuk mendapatkan akun baru atau bantuan lainnya.

---

**Q: Apakah ada batas jumlah skill yang bisa ditambahkan ke profil?**
> A: Tidak ada batasan jumlah skill. Namun pada tampilan kartu tim, hanya 3 skill pertama yang ditampilkan, sisanya ditampilkan sebagai `+N lagi`.

---

**Q: File apa saja yang bisa di-upload untuk dokumen BAST?**
> A: Saat ini sistem hanya mendukung file **PDF** untuk upload dokumen BAST.

---

**Q: Mengapa data di dashboard tidak langsung berubah setelah saya melakukan perubahan?**
> A: Sistem menggunakan **cache data (React Query)** untuk performa optimal. Data biasanya akan diperbarui otomatis dalam beberapa detik atau setelah halaman di-refresh.

---

*Untuk pertanyaan teknis atau kendala lain, hubungi tim pengembang atau Admin sistem Anda.*
