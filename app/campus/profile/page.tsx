'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';

export default function CampusProfilePage() {
  const { campuses, activeCampusId } = useMockApp();
  const campus = campuses.find((c) => c.id === activeCampusId);

  if (!campus) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Profil Perguruan Tinggi"
        description="Identitas resmi institusi kampus validator dan penyalur beasiswa."
      />

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{campus.name}</h2>
            <p className="text-slate-500">
              Kode: {campus.code} • {campus.city}
            </p>
          </div>
          <StatusBadge status={campus.status} size="md" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-500">Wallet Institusi</span>
            <WalletAddress address={campus.walletAddress} />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Email Resmi</span>
            <strong>{campus.email}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Telepon</span>
            <strong>{campus.phone}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Terdaftar Sejak</span>
            <strong>{campus.registeredAt}</strong>
          </div>
          {campus.supportingInfo && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="block text-slate-700 mb-1">Keterangan Akreditasi:</strong>
              <p className="text-slate-600">{campus.supportingInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
