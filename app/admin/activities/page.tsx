'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import TransactionHistory from '@/components/common/TransactionHistory';

export default function AdminActivitiesPage() {
  const { activities, transactions } = useMockApp();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Log Aktivitas & Audit Transaksi"
        description="Rekaman aktivitas lintas peran dan riwayat aliran dana simulasi untuk pengawasan menyeluruh."
      />

      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 text-base">Aktivitas Sistem Terbaru</h2>
        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-bold text-slate-900">
                  {act.actorName}{' '}
                  <span className="font-normal text-slate-500">({act.actorRole})</span>
                </p>
                <p className="text-slate-600 mt-0.5">
                  {act.action} — <strong>{act.target}</strong>
                </p>
              </div>
              <div className="text-right shrink-0 space-y-1">
                <StatusBadge status={act.category} />
                <p className="text-[11px] text-slate-400">{act.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-slate-900 text-base">
          Riwayat Transaksi Dana (Simulasi)
        </h2>
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
}
