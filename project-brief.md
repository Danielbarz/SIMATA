# Project Brief: SIMATA

## 1. Project Overview
[cite_start]SIMATA atau Sistem Integrasi Monitoring Aktif Transportasi Aman hadir sebagai infrastruktur keamanan digital pertama yang mengintegrasikan teknologi Edge-AI Computer Vision pada perangkat seluler pengemudi[cite: 19]. [cite_start]Inovasi ini bertujuan memitigasi risiko kekerasan seksual melalui deteksi anomali gestur secara real-time[cite: 247].

## 2. Core Features
[cite_start]Sistem ini memiliki fitur Real-time Behavioral Anomaly Detection yang menggunakan algoritma Pose Estimation untuk memetakan titik-titik koordinat tubuh penumpang dan pengemudi secara instan[cite: 140]. [cite_start]Sistem menjamin privasi mutlak karena pemrosesan citra dilakukan sepenuhnya di perangkat lokal (on-device) tanpa transmisi video ke server eksternal[cite: 249]. [cite_start]Terdapat Evidence Vault untuk menyimpan bukti digital terenkripsi yang memiliki validitas hukum tinggi[cite: 108, 161]. [cite_start]Sistem juga memberikan Peringatan Preventif jika pengemudi melakukan gestur berisiko[cite: 187].

## 3. Technology Stack
[cite_start]Pengembangan full-stack menggunakan Next.js[cite: 337, 338]. [cite_start]Desain antarmuka memanfaatkan Tailwind CSS[cite: 345]. [cite_start]Logika pemrograman menggunakan Typescript dan JavaScript[cite: 349, 358]. [cite_start]Pengelolaan data real-time didukung oleh Firebase[cite: 340, 341]. [cite_start]Penyimpanan objek berskala besar memanfaatkan Azure Blob Storage[cite: 360]. [cite_start]Infrastruktur AI mengandalkan Pose Estimation (TFLite Engine) di perangkat Edge, didukung oleh Azure OpenAI, Azure Vision, dan Azure Search[cite: 318, 365, 368, 371].

## 4. Developer Instructions
Fokus utama pengembangan adalah integrasi model TFLite di dalam ekosistem Next.js. Pastikan pembuatan antarmuka pengguna pada bagian Report dirancang secara responsif menggunakan Tailwind CSS. Seluruh pemrosesan dan pengiriman data vektor anomali harus disinkronisasikan ke Firebase secara real-time.