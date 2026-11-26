import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Wallet, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  GraduationCap, 
  Layers
} from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="beranda" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
      
      {/* Decorative background grid & blurs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Sisi Kiri: Teks & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Inovasi Transparansi Beasiswa Nasional</span>
            </div>

            {/* Headline Utama */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Membuka Akses Pendidikan, Membangun Masa Depan dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                Transparansi.
              </span>
            </h1>

            {/* Sub-headline / Deskripsi */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Platform beasiswa digital terpadu yang menghubungkan <strong>Mahasiswa</strong>, <strong>Kampus</strong>, <strong>Yayasan Donatur</strong>, dan <strong>Kementerian</strong>. Memanfaatkan pencatatan berbasis blockchain untuk integritas verifikasi, transparansi penyaluran, dan akuntabilitas tanpa perantara berbelit.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <a
                href="#program"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] transition-all"
              >
                <span>Jelajahi Beasiswa</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                <Wallet className="w-4 h-4 text-blue-600" />
                <span>Masuk dengan MetaMask</span>
              </Link>
            </div>

            {/* Keunggulan Cepat */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 border-t border-slate-200/70">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Gratis Tanpa Gas Fee</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Validasi Resmi Kampus</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Audit Trail Terbuka</span>
              </div>
            </div>

          </div>

          {/* Sisi Kanan: Visual Card Ekosistem Kolaborasi */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card */}
              <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-6 space-y-5">
                
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-800">
                      Siklus Verifikasi Beasiswa Terpadu
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Live Demo
                  </span>
                </div>

                {/* 4 Entitas Alur Interaktif Mini */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">Yayasan Merilis Program</p>
                      <p className="text-[11px] text-slate-500 truncate">Alokasi dana & kriteria penerima tercatat</p>
                    </div>
                    <span className="text-[10px] font-medium text-blue-700 bg-white px-2 py-1 rounded shadow-2xs">
                      On-Chain
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">Mahasiswa Mendaftar</p>
                      <p className="text-[11px] text-slate-500 truncate">Login wallet & tanda tangan digital aman</p>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700 bg-white px-2 py-1 rounded shadow-2xs">
                      Web3 Auth
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">Kampus Validasi Akademik</p>
                      <p className="text-[11px] text-slate-500 truncate">Verifikasi IPK & status aktif anti-pemalsuan</p>
                    </div>
                    <span className="text-[10px] font-medium text-amber-700 bg-white px-2 py-1 rounded shadow-2xs">
                      Validator
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">Kementerian & Publik Memantau</p>
                      <p className="text-[11px] text-slate-500 truncate">Audit penyaluran dana transparan & adil</p>
                    </div>
                    <span className="text-[10px] font-medium text-indigo-700 bg-white px-2 py-1 rounded shadow-2xs">
                      Audit Trail
                    </span>
                  </div>
                </div>

                {/* Footer status summary */}
                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    Memastikan dana tepat sasaran tanpa manipulasi birokrasi manual
                  </p>
                </div>

              </div>

              {/* Decorative floating mini badges */}
              <div className="hidden sm:flex absolute -bottom-5 -left-5 bg-white border border-slate-200 rounded-xl px-3.5 py-2 shadow-lg items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">Integritas Terverifikasi</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
