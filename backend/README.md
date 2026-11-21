# Backend penyimpanan video yang disukai

Backend ini memvalidasi Firebase ID token, lalu menyimpan data ke Supabase menggunakan secret key yang hanya tersedia di server. Supabase Third-Party Auth tidak diperlukan.

## 1. Buat tabel

1. Buka `backend/supabase-schema.sql` di VS Code dan salin seluruh isinya.
2. Di dashboard Supabase, buka **SQL Editor > New query**, tempel SQL, lalu klik **Run**.

RLS aktif pada tabel. Akses langsung untuk role `anon` dan `authenticated` dicabut; hanya backend yang menggunakan `service_role` yang dapat mengakses tabel.

## 2. Isi root `.env`

Buka file `.env` di root proyek. Ambil **Project URL** dan **Secret key** dari **Supabase > Project Settings > API**, lalu isi:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
FIREBASE_PROJECT_ID=myweb-id
PORT=3001
FRONTEND_ORIGINS=http://localhost:5501,http://127.0.0.1:5501
```

Jika Supabase hanya menampilkan key lama, gunakan `service_role` sebagai `SUPABASE_SECRET_KEY`. Jangan menaruh key ini di file frontend, jangan kirim lewat chat, dan jangan commit `.env`.

## 3. Jalankan backend

Dari terminal di root proyek:

```powershell
cd backend
npm install
npm start
```

Backend berjalan di `http://localhost:3001`. Cek `http://localhost:3001/health`; status `ok` berarti backend dapat mengakses tabel Supabase.

## 4. Jalankan website

`frontend/api-config.js` sudah diarahkan ke `http://localhost:3001`. Buka `index.html` melalui Live Server di port `5501`, login dengan Firebase, lalu tekan **Suka**. Data dapat dilihat di **Supabase > Table Editor > video_likes**.

Untuk hosting, deploy folder `backend/` ke server Node.js, atur variabel `.env` di penyedia hosting, ubah `FRONTEND_ORIGINS` ke origin website, dan ubah URL di `frontend/api-config.js` ke URL backend HTTPS.
