# Daftar Git Issues untuk Pembuatan Backend SIPMA

Gunakan template di bawah ini untuk membuat Issue di repositori Git Anda (GitHub/GitLab).

---

## Issue 1: Setup Spring Boot REST API & Database (H2 In-Memory)
**Deskripsi:**
Melakukan konfigurasi awal project Spring Boot dengan dependensi Spring Web, Spring Data JPA, dan database H2 untuk penyimpanan data sementara (*in-memory*).

**Daftar Tugas:**
* [ ] Tambahkan dependensi `spring-boot-starter-web` dan `spring-boot-starter-data-jpa` ke `pom.xml`.
* [ ] Tambahkan driver database `h2` ke `pom.xml`.
* [ ] Konfigurasikan `application.properties` untuk database H2 dan aktifkan H2 Console.
* [ ] Buat package-package utama: `controller`, `model`, `repository`, `service`.
* [ ] Pastikan aplikasi dapat melakukan build dan running tanpa error.

---

## Issue 2: Implementasi Fitur Autentikasi Admin
**Deskripsi:**
Membuat sistem registrasi, login, dan verifikasi OTP bagi akun Administrator.

**Daftar Tugas:**
* [ ] Buat entitas `Admin` beserta repositori `AdminRepository`.
* [ ] Buat controller `AuthController` dan service `AuthService`.
* [ ] Implementasikan endpoint `POST /api/auth/register` untuk pendaftaran admin.
* [ ] Implementasikan endpoint `POST /api/auth/login` untuk masuk sistem.
* [ ] Implementasikan endpoint `POST /api/auth/verify-otp` (simulasi OTP terlebih dahulu).

---

## Issue 3: REST API untuk Dashboard & Statistik Kepatuhan
**Deskripsi:**
Menyediakan data statistik tingkat kepatuhan mahasiswa serta riwayat pemindaian terbaru untuk halaman Dashboard utama.

**Daftar Tugas:**
* [ ] Buat entitas `StudentRecord` beserta repositori `StudentRecordRepository`.
* [ ] Buat service untuk menghitung statistik (total scan, status COMPLETE, status INCOMPLETE, persentase kepatuhan).
* [ ] Implementasikan endpoint `GET /api/dashboard/stats`.
* [ ] Implementasikan endpoint `GET /api/dashboard/recent` dengan dukungan filter pencarian nama/NIM dan status.

---

## Issue 4: REST API Riwayat Pemindaian (History)
**Deskripsi:**
Mengelola data riwayat pemindaian mahasiswa, termasuk pencarian, filtering, dan penghapusan data.

**Daftar Tugas:**
* [ ] Implementasikan endpoint `GET /api/students` untuk mengambil seluruh riwayat pemindaian.
* [ ] Implementasikan endpoint `DELETE /api/students/{id}` untuk menghapus record pemindaian tertentu dari database.

---

## Issue 5: REST API Notifikasi Email Peringatan
**Deskripsi:**
Menyediakan fitur pengiriman email peringatan tertib atribut ke mahasiswa serta penyimpanan log notifikasi tersebut.

**Daftar Tugas:**
* [ ] Buat entitas `NotificationLog` beserta repositori `NotificationLogRepository`.
* [ ] Konfigurasikan library pengiriman email (atau buat mock service pengiriman email terlebih dahulu).
* [ ] Implementasikan endpoint `POST /api/notifications/send` untuk memproses pengiriman email peringatan.
* [ ] Implementasikan endpoint `GET /api/notifications/logs` untuk mengambil daftar log pengiriman email.

---

## Issue 6: REST API Profil & Pengaturan Administrator
**Deskripsi:**
Mengelola pembaruan detail data profil administrator aktif.

**Daftar Tugas:**
* [ ] Buat endpoint `GET /api/admin/profile` untuk mengambil detail profil admin.
* [ ] Buat endpoint `PUT /api/admin/profile` untuk memperbarui data admin aktif (nama, departemen, role, avatar).

---

## Issue 7: Integrasi Frontend React dengan REST API Backend
**Deskripsi:**
Menghubungkan aplikasi frontend React dengan endpoint-endpoint REST API Spring Boot.

**Daftar Tugas:**
* [ ] Hubungkan form Login & Register ke `POST /api/auth/login` dan `POST /api/auth/register`.
* [ ] Hubungkan dashboard charts dan daftar scan terbaru ke endpoint backend.
* [ ] Ganti modul riwayat (History) agar melakukan fetch dan delete langsung ke database backend.
* [ ] Hubungkan halaman notifikasi agar membaca log dari database dan mengirim instruksi kirim email melalui API backend.
