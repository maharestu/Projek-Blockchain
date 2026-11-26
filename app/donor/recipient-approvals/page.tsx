'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { GAS_BUFFER_PER_TX } from '@/lib/sepolia';
import { ScholarshipApplication } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { CheckCircle2, XCircle, Lock, UserCheck } from 'lucide-react';

export default function DonorRecipientApprovalsPage() {
  const {
    programs,
    applications,
    students,
    campuses,
    activeDonorId,
    formatRupiah,
    decideRecipient,
  } = useMockApp();

  const [decisionTarget, setDecisionTarget] = useState<{
    app: ScholarshipApplication;
    approve: boolean;
  } | null>(null);

  const myProgramIds = programs
    .filter((p) => p.donorId === activeDonorId)
    .map((p) => p.id);

  const recommendedApps = applications.filter(
    (a) =>
      myProgramIds.includes(a.programId) &&
      [
        'Direkomendasikan ke Donatur',
        'Menunggu Persetujuan Donatur',
        'Disetujui Donatur',
        'Ditolak Donatur',
      ].includes(a.status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Persetujuan Calon Penerima"
        description="Seleksi joint: tinjau calon penerima yang sudah diverifikasi dan direkomendasikan kampus, lalu berikan persetujuan akhir."
      />

      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <span>
          <strong>Pembatasan Privasi & Wewenang:</strong> Donatur hanya menyetujui atau menolak calon yang direkomendasikan kampus dan tidak dapat mengubah hasil verifikasi akademik kampus maupun mengakses dokumen sensitif pribadi mahasiswa.
        </span>
      </div>

      {recommendedApps.length === 0 ? (
        <EmptyState
          title="Belum Ada Rekomendasi Penerima"
          description="Kampus belum mengirimkan rekomendasi calon penerima untuk program Anda."
          icon={UserCheck}
        />
      ) : (
        <div className="space-y-4">
          {recommendedApps.map((app) => {
            const prog = programs.find((p) => p.id === app.programId);
            const student = students.find((s) => s.id === app.studentId);
            const campus = campuses.find((c) => c.id === app.campusId);
            const isPending =
              app.status === 'Menunggu Persetujuan Donatur' ||
              app.status === 'Direkomendasikan ke Donatur';

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={app.status} />
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {prog?.title}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900">
                      {student?.name} ({student?.nim})
                    </h2>
                    <p className="text-xs text-slate-500">
                      {campus?.name} • {student?.degree} {student?.major} • IPK {student?.gpa}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">
                      Hak Penerima (+{GAS_BUFFER_PER_TX} ETH Gas Buffer)
                    </span>
                    <strong className="text-base font-extrabold text-blue-700">
                      {formatRupiah(
                        Number(
                          (
                            (app.recommendedAmount || prog?.amountPerRecipient || 0) +
                            GAS_BUFFER_PER_TX
                          ).toFixed(6)
                        )
                      )}
                    </strong>
                    <span className="block text-[10px] text-slate-500">
                      Mahasiswa terima utuh:{' '}
                      {formatRupiah(app.recommendedAmount || prog?.amountPerRecipient || 0)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                    <strong className="text-emerald-900 block">
                      Status Verifikasi Kampus (Tervalidasi):
                    </strong>
                    <p className="text-emerald-800">{app.campusNote || 'Memenuhi syarat akademik.'}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <strong className="text-slate-800 block">Esai Singkat Pelamar:</strong>
                    <p className="text-slate-600 line-clamp-3">{app.motivationEssay}</p>
                  </div>
                </div>

                {app.donorNote && (
                  <p className="text-xs text-slate-600 bg-slate-100 rounded-xl p-3">
                    <strong>Catatan Keputusan Donatur:</strong> {app.donorNote}
                  </p>
                )}

                {isPending && (
                  <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setDecisionTarget({ app, approve: false })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak</span>
                    </button>
                    <button
                      onClick={() => setDecisionTarget({ app, approve: true })}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Setujui & Alokasikan Dana</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(decisionTarget)}
        title={
          decisionTarget?.approve
            ? 'Setujui Penerima & Alokasikan Dana?'
            : 'Tolak Rekomendasi Penerima?'
        }
        description={
          decisionTarget?.approve
            ? 'Dana alokasi akan dikunci dari saldo escrow program menuju wallet kampus untuk disalurkan kepada mahasiswa.'
            : 'Mahasiswa tidak akan ditetapkan sebagai penerima bantuan pada program ini.'
        }
        confirmLabel={decisionTarget?.approve ? 'Setujui Penerima' : 'Tolak Penerima'}
        variant={decisionTarget?.approve ? 'primary' : 'danger'}
        requireReason
        onConfirm={(note) => {
          if (decisionTarget) {
            decideRecipient(decisionTarget.app.id, decisionTarget.approve, note);
          }
          setDecisionTarget(null);
        }}
        onCancel={() => setDecisionTarget(null)}
      />
    </div>
  );
}
