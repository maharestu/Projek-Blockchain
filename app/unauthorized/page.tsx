import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Wallet } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 shadow-lg p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Akses Ditolak (403)
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Role Akun Tidak Sesuai
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Alamat wallet Anda tidak memiliki otorisasi untuk mengakses halaman portal ini. Hak akses ditentukan oleh sistem berdasarkan registrasi institusi atau kampus Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <Link
            href="/login"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            <Wallet className="w-4 h-4" />
            <span>Ganti Wallet Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
