import { FaqItem } from '@/types';

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Blockchain & Wallet',
    question: 'Apa itu platform beasiswa berbasis blockchain ini?',
    answer: 'Platform ini adalah ekosistem beasiswa terpusat yang mempertemukan Mahasiswa, Perguruan Tinggi, Yayasan Donatur, dan Kementerian. Teknologi blockchain dimanfaatkan untuk mencatat jejak audit (audit trail) integritas data penerima, status verifikasi kampus, dan riwayat penyaluran dana agar prosesnya transparan, akuntabel, dan tidak dapat dimanipulasi secara sepihak.'
  },
  {
    id: 'faq-2',
    category: 'Blockchain & Wallet',
    question: 'Apakah mahasiswa wajib memiliki dompet digital MetaMask?',
    answer: 'Ya, pada tahap ini identitas pengguna diverifikasi melalui alamat dompet Web3 (MetaMask). Wallet ini berfungsi sebagai tanda tangan digital unik pengganti kata sandi tradisional, memastikan bahwa hanya pemilik sah yang dapat mengakses akun dan menandatangani permohonan beasiswa.'
  },
  {
    id: 'faq-3',
    category: 'Blockchain & Wallet',
    question: 'Apakah menghubungkan wallet dan login dikenakan biaya gas (Gas Fee)?',
    answer: 'Tidak sama sekali. Proses menghubungkan dompet dan menandatangani pesan autentikasi (signature request) untuk masuk ke platform 100% GRATIS dan dilakukan secara off-chain (cryptographic signature). Anda tidak perlu memiliki saldo ETH, MATIC, atau aset kripto apa pun untuk masuk ke akun Anda.'
  },
  {
    id: 'faq-4',
    category: 'Keamanan & Privasi',
    question: 'Apakah seluruh data pribadi mahasiswa akan disimpan secara terbuka di blockchain?',
    answer: 'Tentu tidak. Dokumen sensitif seperti KTP, Kartu Keluarga, dan nomor rekening perbankan TIDAK disimpan di blockchain publik demi mematuhi undang-undang pelindungan data pribadi (UU PDP). Blockchain hanya menyimpan nilai hash kriptografi untuk pembuktian keaslian berkas dan rekaman status verifikasi, sedangkan dokumen asli disimpan di penyimpanan aman terenkripsi.'
  },
  {
    id: 'faq-5',
    category: 'Pendaftaran',
    question: 'Bagaimana peran kampus dalam proses seleksi beasiswa?',
    answer: 'Kampus bertindak sebagai validator terpercaya. Ketika seorang mahasiswa mendaftar beasiswa, pihak kampus (bagian kemahasiswaan atau akademik) akan memvalidasi kebenaran status keaktifan mahasiswa, transkrip IPK, dan riwayat studi sebelum berkas diteruskan ke pihak yayasan/donatur.'
  },
  {
    id: 'faq-6',
    category: 'Institusi',
    question: 'Bagaimana yayasan atau perguruan tinggi mendaftarkan akun di platform?',
    answer: 'Untuk menjaga keamanan dan mencegah penipuan, akun institusi (Kampus dan Yayasan Donatur) tidak dapat didaftarkan secara sembarangan. Akun harus melalui verifikasi legalitas dan otorisasi oleh Kementerian / Administrator platform sebelum alamat dompetnya diberikan hak akses role institusi.'
  }
];
