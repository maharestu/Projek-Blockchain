'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { CancellationRequest } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { AlertOctagon, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

export default function AdminCancellationRequestsPage() {
  const { cancellationRequests, programs, donors, formatRupiah, decideCancellation } =
    useMockApp();

  const [target, setTarget] = useState<{
    req: CancellationRequest;
    approve: boolean;
  } | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Permintaan Pembatalan Program"
        description="Tinjau permintaan pembatalan program yang sudah dibuka. Admin mengawasi dampak dan persetujuan, namun tidak dapat mengambil dana escrow secara langsung."
      />

      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Aturan Perlindungan Dana:</strong> Dana yang telah dialokasikan atau menjadi hak penerima yang disetujui <strong>tidak dapat dibatalkan maupun ditarik</strong> oleh donatur maupun admin.
        </span>
      </div>

      {cancellationRequests.length === 0 ? (
        <EmptyState
          title="Belum Ada Permintaan Pembatalan"
          description="Saat ini tidak ada permintaan pembatalan program dari donatur."
          icon={AlertOctagon}
        />
      ) : (
        <div className="space-y-4">
          {cancellationRequests.map((req) => {
            const prog = programs.find((p) => p.id === req.programId);
            const donor = donors.find((d) => d.id === req.donorId);

            return (
              <div
                key={req.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={req.status} />
                      <span className="text-[11px] text-slate-500">
                        Diajukan: {req.requestedAt}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {prog?.title || req.programId}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Donatur: <strong>{donor?.name || req.donorId}</strong> • Tahap saat pengajuan: <strong>{req.programStage}</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <strong className="text-slate-800 block">Alasan Pembatalan Donatur:</strong>
                  <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    {req.reason}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
                    <span className="text-slate-500 block">Dana Dialokasikan (Hak Penerima)</span>
                    <strong className="text-base font-extrabold text-blue-800">
                      {formatRupiah(req.allocatedFunds)}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-slate-500 block">Sudah Disalurkan</span>
                    <strong className="text-base font-extrabold text-emerald-800">
                      {formatRupiah(req.disbursedFunds)}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block">Belum Terikat Kewajiban</span>
                    <strong className="text-base font-extrabold text-slate-900">
                      {formatRupiah(req.uncommittedFunds)}
                    </strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900">
                  <strong>Dampak Terhadap Pendaftar & Penerima:</strong> {req.impactSummary}
                </div>

                {req.adminDecisionNote && (
                  <div className="p-3 rounded-xl bg-slate-100 text-xs text-slate-700">
                    <strong>Catatan Keputusan Admin ({req.decidedAt}):</strong> {req.adminDecisionNote}
                  </div>
                )}

                {req.status === 'Menunggu Admin' && (
                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setTarget({ req, approve: false })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Tolak Pembatalan</span>
                    </button>
                    <button
                      onClick={() => setTarget({ req, approve: true })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui Pembatalan</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(target)}
        title={
          target?.approve ? 'Setujui Pembatalan Program?' : 'Tolak Permintaan Pembatalan?'
        }
        description={
          target?.approve
            ? 'Program akan berstatus Dibatalkan. Dana yang belum terikat kewajiban dapat diproses refund kepada donatur sesuai simulasi.'
            : 'Program tetap berjalan sesuai jadwal yang telah ditetapkan.'
        }
        confirmLabel={target?.approve ? 'Setujui Pembatalan' : 'Tolak Permintaan'}
        variant={target?.approve ? 'danger' : 'primary'}
        requireReason
        onConfirm={(reason) => {
          if (target) decideCancellation(target.req.id, target.approve, reason);
          setTarget(null);
        }}
        onCancel={() => setTarget(null)}
      />
    </div>
  );
}
