'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { AlertOctagon } from 'lucide-react';

export default function DonorCancellationRequestsPage() {
  const { cancellationRequests, programs, activeDonorId, formatRupiah } = useMockApp();

  const myRequests = cancellationRequests.filter((r) => r.donorId === activeDonorId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Status Permintaan Pembatalan"
        description="Pantau pengajuan pembatalan program beasiswa Anda yang sedang ditinjau oleh Admin Kementerian."
      />

      {myRequests.length === 0 ? (
        <EmptyState
          title="Belum Ada Pengajuan Pembatalan"
          description="Anda dapat mengajukan pembatalan dari halaman Program Saya jika terdapat kondisi khusus."
          icon={AlertOctagon}
        />
      ) : (
        <div className="space-y-4">
          {myRequests.map((req) => {
            const prog = programs.find((p) => p.id === req.programId);
            return (
              <div
                key={req.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={req.status} />
                  <span className="text-slate-400">Diajukan: {req.requestedAt}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">{prog?.title}</h3>
                <p className="text-slate-600">{req.reason}</p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap gap-4">
                  <span>
                    Hak Penerima Terlindungi: <strong>{formatRupiah(req.allocatedFunds)}</strong>
                  </span>
                  <span>
                    Dana Belum Terikat: <strong>{formatRupiah(req.uncommittedFunds)}</strong>
                  </span>
                </div>
                {req.adminDecisionNote && (
                  <p className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                    <strong>Keputusan Admin:</strong> {req.adminDecisionNote}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
