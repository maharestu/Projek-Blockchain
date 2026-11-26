import { RoleInfo } from '@/types';

export const ROLES_DATA: RoleInfo[] = [
  {
    id: 'admin',
    title: 'Kementerian / Admin',
    subtitle: 'Pengawasan Regulasi & Standarisasi',
    badge: 'Regulator & Audit',
    description: 'Memegang kewenangan supervisi menyeluruh, memverifikasi keabsahan entitas yayasan serta perguruan tinggi yang bergabung, dan memantau kepatuhan penyaluran secara agregat.',
    responsibilities: [
      'Verifikasi identitas legal yayasan donor dan perguruan tinggi',
      'Audit log aktivitas dan ringkasan penyaluran beasiswa berkala',
      'Menetapkan regulasi dan batas standar minimum kelayakan beasiswa',
      'Mengelola status operasional dan hak akses institusi dalam platform'
    ],
    highlightColor: 'from-blue-700 to-indigo-900'
  },
  {
    id: 'yayasan',
    title: 'Donatur / Yayasan',
    subtitle: 'Pemberdayaan Program & Pemantauan Dana',
    badge: 'Penyelenggara Bantuan',
    description: 'Membuat program beasiswa dengan kriteria spesifik, mengelola alokasi anggaran bantuan, serta melihat progres seleksi dan penyaluran dana secara transparan tanpa perantara berbelit.',
    responsibilities: [
      'Publikasi program beasiswa baru lengkap dengan persyaratan',
      'Meninjau ringkasan berkas pelamar yang telah tervalidasi kampus',
      'Memantau penyaluran hak penerima sesuai milestone akademik',
      'Menerima laporan pertanggungjawaban terstruktur yang dapat diaudit'
    ],
    highlightColor: 'from-emerald-700 to-teal-900'
  },
  {
    id: 'kampus',
    title: 'Kampus / Perguruan Tinggi',
    subtitle: 'Validasi Akademik & Keaktifan Mahasiswa',
    badge: 'Mitra Validasi',
    description: 'Berperan sebagai pihak otoritas yang memvalidasi keaslian status mahasiswa, nilai IPK, dan kelayakan dokumen akademik sehingga yayasan terhindar dari pemalsuan data pelamar.',
    responsibilities: [
      'Verifikasi status keaktifan mahasiswa pendaftar beasiswa',
      'Otentikasi data akademik (IPK, SKS lulus, riwayat sanksi)',
      'Mengunggah bukti penerimaan resmi kampus secara terenkripsi',
      'Memantau daftar mahasiswa penerima bantuan di lingkungan kampus'
    ],
    highlightColor: 'from-amber-700 to-orange-900'
  },
  {
    id: 'mahasiswa',
    title: 'Mahasiswa / Pelamar',
    subtitle: 'Akses Informasi & Pendaftaran Transparan',
    badge: 'Penerima Manfaat',
    description: 'Menjelajahi beragam pilihan beasiswa terpercaya dalam satu pintu, mendaftar dengan wallet identitas digital, serta memantau status seleksi dan pencairan beasiswa secara real-time.',
    responsibilities: [
      'Menghubungkan akun menggunakan wallet Web3 (MetaMask) tanpa biaya',
      'Mengajukan permohonan beasiswa sesuai kriteria yang diminati',
      'Melacak status verifikasi kampus dan penilaian yayasan terbuka',
      'Menerima kepastian hak dana beasiswa secara tepat waktu'
    ],
    highlightColor: 'from-sky-700 to-blue-900'
  }
];
