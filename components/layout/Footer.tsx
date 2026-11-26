'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const isDashboard =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/donor') ||
    pathname.startsWith('/campus') ||
    pathname.startsWith('/student');

  if (isDashboard) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Kolom 1 & 2: Identitas Platform */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-xl text-white tracking-tight">
                  EduChain Beasiswa
                </span>
                <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  Prototype UI
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Membuka akses pendidikan tinggi melalui integrasi terpercaya antara Kementerian, Yayasan Donatur, Perguruan Tinggi, dan Mahasiswa dengan transparansi pencatatan berbasis blockchain.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-xs text-slate-300 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Komitmen Privasi:</strong> Seluruh data identitas pribadi mahasiswa dilindungi enkripsi standar dan tidak disimpan mentah pada buku besar publik (public ledger).
              </p>
            </div>
          </div>

          {/* Kolom 3: Navigasi Platform */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#beranda" className="text-slate-400 hover:text-white transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="text-slate-400 hover:text-white transition">
                  Tentang Platform
                </Link>
              </li>
              <li>
                <Link href="/program" className="text-slate-400 hover:text-white transition">
                  Daftar Program Beasiswa
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="text-slate-400 hover:text-white transition">
                  Alur & Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/#peran" className="text-slate-400 hover:text-white transition">
                  Ekosistem Pengguna
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-slate-400 hover:text-white transition">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Ekosistem 4 Role */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Portal Peran
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/student" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Portal Mahasiswa</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/campus" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Portal Kampus / Validator</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/donor" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Portal Yayasan / Donatur</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-white transition flex items-center justify-between">
                  <span>Portal Kementerian / Admin</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 5: Kontak & Bantuan Dummy */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">
              Bantuan & Kontak
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs">bantuan@educhain-beasiswa.id</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs">(021) 500-EDU-CHAIN</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="text-xs">Gedung Pusat Inovasi Pendidikan Tinggi, Jakarta, Indonesia</span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-500">
                Prototype Frontend — Mock Data
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 EduChain Beasiswa Platform. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Kebijakan Privasi</span>
            <span className="hover:text-slate-400 cursor-pointer">Syarat & Ketentuan Layanan</span>
            <span className="hover:text-slate-400 cursor-pointer">Protokol Keamanan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
