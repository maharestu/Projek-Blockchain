import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, GraduationCap, Lock } from 'lucide-react';
import WalletLoginCard from '@/components/auth/WalletLoginCard';

export const metadata = {
  title: 'Masuk dengan MetaMask - EduChain Beasiswa',
  description: 'Pintu masuk autentikasi terpadu berbasis dompet Web3 untuk Mahasiswa, Perguruan Tinggi, Yayasan Donatur, dan Kementerian.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Tombol Navigasi Kembali */}
        <div className="max-w-xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Halaman Beranda</span>
          </Link>
        </div>

        {/* Kartu Login */}
        <WalletLoginCard />

        {/* Security & FAQ Helper Link */}
        <div className="max-w-xl mx-auto mt-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
            <Link href="/#faq" className="hover:text-blue-600 transition">
              FAQ Autentikasi Wallet
            </Link>
            <span>•</span>
            <Link href="/#tentang" className="hover:text-blue-600 transition">
              Tentang Keamanan Data
            </Link>
            <span>•</span>
            <a href="mailto:bantuan@educhain-beasiswa.id" className="hover:text-blue-600 transition">
              Bantuan Akun
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            EduChain Beasiswa ID © 2026. Standar Verifikasi Pendidikan Tinggi Terpercaya.
          </p>
        </div>

      </div>
    </div>
  );
}
