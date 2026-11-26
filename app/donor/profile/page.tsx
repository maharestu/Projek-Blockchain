'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';

export default function DonorProfilePage() {
  const { donors, activeDonorId } = useMockApp();
  const donor = donors.find((d) => d.id === activeDonorId);

  if (!donor) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Profil Organisasi Donatur"
        description="Informasi identitas yayasan atau lembaga donor yang terdaftar dan terverifikasi Kementerian."
      />

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{donor.name}</h2>
            <p className="text-slate-500">{donor.organizationType}</p>
          </div>
          <StatusBadge status={donor.status} size="md" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Wallet Terdaftar</span>
            <WalletAddress address={donor.walletAddress} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Resmi</span>
            <strong className="text-slate-800">{donor.email}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telepon</span>
            <strong className="text-slate-800">{donor.phone}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tanggal Registrasi</span>
            <strong className="text-slate-800">{donor.registeredAt}</strong>
          </div>
          {donor.supportingInfo && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-700 mb-1">Legalitas / Catatan:</strong>
              <p className="text-slate-600">{donor.supportingInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
