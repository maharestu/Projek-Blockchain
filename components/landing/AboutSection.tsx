import React from 'react';
import { 
  Search, 
  FileText, 
  Eye, 
  ShieldAlert, 
  CheckCircle2, 
  Database,
  Lock,
  Network
} from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="tentang" className="py-20 md:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            Tentang Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Menjawab Masalah Nyata Penyaluran Beasiswa
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Menyatukan potongan proses yang selama ini terpisah, lambat, dan rentan terhadap ketidakpastian informasi dalam satu ekosistem terpadu.
          </p>
        </div>

        {/* 2 Kolom: Masalah vs Solusi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Kolom Masalah */}
          <div className="p-8 rounded-2xl bg-white border border-rose-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Tantangan Sistem Konvensional
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✕
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Informasi Tersebar dan Tidak Terpusat</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mahasiswa kesulitan menemukan informasi beasiswa yang kredibel dan sering terlambat mengetahui masa pendaftaran.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✕
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Birokrasi & Validasi Berkas Manual</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Proses legalisir transkrip fisik dan verifikasi status mahasiswa membutuhkan waktu berminggu-minggu serta rentan pemalsuan.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✕
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Minimnya Transparansi Penyaluran Dana</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Donatur dan masyarakat kesulitan memverifikasi apakah alokasi beasiswa sudah terserap tepat sasaran dan tepat waktu.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Kolom Solusi EduChain */}
          <div className="p-8 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Solusi Platform EduChain ID
              </h3>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Katalog Beasiswa Nasional Satu Pintu</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Seluruh program terverifikasi dari kementerian dan yayasan mitra dikurasi dengan kriteria, jadwal, dan manfaat yang transparan.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Validasi Kampus Terintegrasi & Cepat</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Otoritas kampus memvalidasi IPK dan status akademik secara langsung di sistem sebelum berkas diajukan ke yayasan penyedia.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  ✓
                </div>
                <div>
                  <strong className="text-sm text-slate-800 block">Jejak Audit On-Chain yang Tidak Dapat Dimanipulasi</strong>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Setiap milestone seleksi dan penyaluran menghasilkan rekam jejak digital yang terbuka untuk audit kementerian dan publik.
                  </p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Kotak Edukasi Blockchain & Keamanan Data (Sesuai catatan Section 4.4) */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            <div className="md:col-span-2 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <Network className="w-3.5 h-3.5" />
                <span>Prinsip Implementasi Blockchain</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                Bagaimana Blockchain Diterapkan Secara Bijak?
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Platform memisahkan secara tegas antara <strong>data audit transparansi</strong> dan <strong>data pribadi rahasia</strong>. Blockchain mencatat hash bukti verifikasi kampus dan status alur program tanpa membocorkan identitas pribadi atau KTP pendaftar ke publik, menjamin kepatuhan penuh terhadap standar perlindungan data.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Lock className="w-4 h-4" />
                <span>Privasi Terlindungi</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dokumen sensitif terenkripsi secara aman di peladen aplikasi institusi resmi. Hanya pihak berwenang yang dapat membaca rincian dokumen pelamar.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
