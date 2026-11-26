'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { ADMIN_WALLET } from '@/data/mockStore';
import PageHeader from '@/components/layout/PageHeader';
import WalletAddress from '@/components/common/WalletAddress';
import { ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const { notify } = useMockApp();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Platform & Tata Kelola"
        description="Konfigurasi otoritas admin dan tata kelola platform beasiswa."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Identitas Otoritas Admin</span>
          </div>
          <div className="text-xs space-y-2.5 text-slate-600">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span>Instansi Pengawas</span>
              <strong className="text-slate-900">Kementerian Pendidikan Tinggi</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 items-center">
              <span>Wallet Admin Terdaftar</span>
              <WalletAddress address={ADMIN_WALLET} />
            </div>
            <div className="flex justify-between py-2">
              <span>Hak Akses Escrow</span>
              <span className="font-semibold text-rose-600">
                Read-Only (Tidak dapat menarik dana)
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Preferensi Sistem</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pengaturan tata kelola akun institusi dan integrasi smart contract akan disinkronkan dengan jaringan blockchain yang dipilih.
          </p>
          <button
            onClick={() =>
              notify({
                type: 'info',
                title: 'Preferensi Disimpan',
                description: 'Konfigurasi sistem berhasil diperbarui.',
              })
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
          >
            Simpan Preferensi
          </button>
        </div>
      </div>
    </div>
  );
}
