import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  Lock, 
  Users2, 
  Coins, 
  FileCheck2,
  CheckCircle2
} from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Pusat Informasi Tunggal & Kredibel',
      desc: 'Tidak ada lagi informasi beasiswa palsu atau phishing. Seluruh penyelenggara diverifikasi legalitasnya sebelum diizinkan menerbitkan program.',
      icon: Layers,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Transparansi Penyaluran Dana',
      desc: 'Setiap tahap pencairan beasiswa dicatat dalam riwayat yang dapat diaudit secara terbuka oleh pengawas, menekan risiko pemotongan liar.',
      icon: Coins,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Verifikasi Akademik Anti-Pemalsuan',
      desc: 'Kampus bertindak sebagai validator resmi keaslian IPK dan status keaktifan mahasiswa pelamar, memastikan penerima benar-benar memenuhi kualifikasi.',
      icon: FileCheck2,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      title: 'Perlindungan Data Pribadi (UU PDP)',
      desc: 'Kerahasiaan data mahasiswa tetap menjadi prioritas utama. Dokumen identitas tidak dipublikasikan ke buku besar publik, melainkan disimpan terenkripsi.',
      icon: Lock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      title: 'Bebas Biaya Gas (Zero Gas Fee)',
      desc: 'Mahasiswa dan institusi tidak dipungut biaya jaringan apa pun saat melakukan login maupun penandatanganan berkas pendaftaran.',
      icon: ShieldCheck,
      color: 'text-sky-600',
      bg: 'bg-sky-50'
    },
    {
      title: 'Kolaborasi Terintegrasi 4 Pihak',
      desc: 'Menghubungkan Kementerian, Perguruan Tinggi, Yayasan Donatur, dan Mahasiswa dalam satu alur kerja digital yang terpadu dan efisien.',
      icon: Users2,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            Keunggulan Sistem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mengapa Memilih EduChain Beasiswa?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Menghadirkan standar baru akuntabilitas pembiayaan pendidikan di era transformasi digital.
          </p>
        </div>

        {/* Grid 6 Keunggulan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all duration-200 space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${b.color}`} />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
