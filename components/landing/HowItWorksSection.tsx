import React from 'react';
import { 
  Building2, 
  GraduationCap, 
  FileCheck2, 
  Eye, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Yayasan Membuat Program',
      actor: 'Donatur / Yayasan',
      desc: 'Penyelenggara beasiswa mempublikasikan kuota dana, kriteria sasaran, dan tenggat pendaftaran yang tercatat di smart contract platform.',
      icon: Building2,
      badge: 'Alokasi Terencana',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      number: '02',
      title: 'Mahasiswa Menemukan & Mendaftar',
      actor: 'Mahasiswa Pelamar',
      desc: 'Mahasiswa masuk via dompet MetaMask, memilih beasiswa yang sesuai, dan mengajukan data akademik tanpa perlu mencetak berkas fisik berulang kali.',
      icon: GraduationCap,
      badge: 'Bebas Kertas & Biaya',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-200'
    },
    {
      number: '03',
      title: 'Kampus Membantu Verifikasi',
      actor: 'Pihak Perguruan Tinggi',
      desc: 'Rektorat atau bagian kemahasiswaan memvalidasi status aktif, IPK, dan kelayakan pendaftar. Bukti validasi menghasilkan hash cryptographic otentik.',
      icon: FileCheck2,
      badge: 'Validasi Resmi',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200'
    },
    {
      number: '04',
      title: 'Program Dipantau Secara Transparan',
      actor: 'Kementerian & Publik',
      desc: 'Seluruh pihak dapat memantau status penyaluran hak penerima sesuai jadwal dan aturan program, bebas pemotongan liar dan manipulasi kuota.',
      icon: Eye,
      badge: 'Audit Trail Terbuka',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <section id="cara-kerja" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            Alur Sistem
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bagaimana Platform EduChain Bekerja?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Empat langkah kolaboratif yang menggabungkan kemudahan antarmuka modern dengan keandalan pencatatan terdesentralisasi.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-white border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 group-hover:text-blue-500 transition-colors">
                    {step.number}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {step.badge}
                  </span>
                </div>

                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${step.bgColor} ${step.borderColor} border flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    {step.actor}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed pt-1">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom line marker */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tahap {idx + 1} dari 4</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>

              </div>
            );
          })}
        </div>

        {/* Konsep Penutup Alur */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 italic max-w-xl mx-auto">
            * Alur di atas menggambarkan konsep arsitektur interaksi. Kebijakan teknis verifikasi detail akan diselaraskan dengan tata kelola perguruan tinggi mitra.
          </p>
        </div>

      </div>
    </section>
  );
}
