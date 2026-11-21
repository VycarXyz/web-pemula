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

## 3. Jalankan backend lokal

Dari terminal di root proyek, jalankan:

```powershell
npm --prefix backend start
```

Backend lokal berjalan di `http://localhost:3001`. Cek `http://localhost:3001/health`; status `ok` berarti backend dapat mengakses tabel Supabase. Biarkan proses backend berjalan saat mencoba website lokal.

## 4. Deploy ke Cloudflare Pages

Pages Functions di folder `functions/` menyediakan endpoint produksi `/api/liked-videos` dan `/health`. Fungsi memverifikasi Firebase ID token lalu memakai secret Supabase dari environment Cloudflare. Supabase Third-Party Auth tidak diperlukan.

1. Hubungkan repository melalui **Workers & Pages > Create application > Pages > Connect to Git**. Pages Functions tidak didukung melalui Direct Upload.
2. Gunakan root repository sebagai project root, preset **None**, build command kosong, dan build output directory `.`. `index.html` serta folder `functions/` berada di root.
3. Di pengaturan Pages **Settings > Variables and Secrets**, isi untuk Production (dan Preview jika diperlukan):
   - `SUPABASE_URL`
   - `FIREBASE_PROJECT_ID` dengan nilai `myweb-id`
   - `SUPABASE_SECRET_KEY` sebagai **Secret**
4. Deploy ulang. `frontend/api-config.js` otomatis memakai origin Pages di production, sehingga request menuju Function pada domain yang sama.
5. Cek `https://DOMAIN-PAGES-MU/health` dan pastikan hasilnya `{"status":"ok"}`. Setelah itu login dan coba tombol **Suka**.

Secret key tidak boleh dimasukkan ke `frontend/`, tidak boleh di-commit, dan tidak perlu mengatur CORS untuk request same-origin dari Pages.

## 5. Jalankan website lokal

Jalankan `npm --prefix backend start`, lalu buka `index.html` melalui Live Server di port `5501`. Data dapat dilihat di **Supabase > Table Editor > video_likes**.
