# InstanceWatch

Dashboard monitoring & kontrol EC2 instance berbasis web — Tugas Besar (Individu) Cloud Computing.

InstanceWatch menampilkan seluruh EC2 instance pada akun AWS kamu dalam bentuk kartu status
real-time, lengkap dengan grafik CPU utilization, aksi start/stop/reboot/terminate, estimasi
biaya berjalan, dan riwayat aktivitas.

## Struktur Proyek

```
instancewatch/
├── backend/          Express API + AWS SDK v3 (EC2, CloudWatch)
│   ├── routes/
│   ├── services/
│   ├── data/logs.json
│   └── server.js
├── frontend/         React (Vite) SPA
│   └── src/
└── README.md
```

## Prasyarat

- Node.js 18+ dan npm
- Akun AWS dengan minimal 1 EC2 instance (bisa `t2.micro` free tier)
- IAM user/role dengan izin: `ec2:DescribeInstances`, `ec2:StartInstances`,
  `ec2:StopInstances`, `ec2:RebootInstances`, `ec2:TerminateInstances`,
  `cloudwatch:GetMetricStatistics`

## Menjalankan Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env, isi AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
npm start
```

Backend berjalan di `http://localhost:4000`.

## Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend berjalan di `http://localhost:5173` dan otomatis mem-proxy `/api` ke backend
(lihat `vite.config.js`).

## Build untuk Produksi

```bash
cd frontend
npm run build
```

Hasil build statis ada di `frontend/dist/`, bisa disajikan lewat server statis apa pun
(atau digabungkan ke Express dengan `express.static`).

## Fitur

- Daftar semua EC2 instance beserta status, tipe, availability zone, IP publik/privat
- Start, Stop, Reboot, Terminate instance (dengan dialog konfirmasi untuk aksi berisiko)
- Grafik CPU utilization 60 menit terakhir per instance (via Amazon CloudWatch)
- Pencarian dan filter berdasarkan status
- Estimasi biaya on-demand (per jam/hari/bulan) dari instance yang sedang berjalan
- Riwayat aktivitas (log aksi start/stop/reboot/terminate)
- Auto-refresh setiap 30 detik

## Catatan Keamanan

Jangan commit file `.env` (berisi kredensial AWS asli) ke GitHub — sudah termasuk dalam
`.gitignore`. Gunakan `.env.example` sebagai referensi.
