'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import { ScholarshipProgram } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { PlusCircle, Eye, Send, AlertOctagon, GraduationCap } from 'lucide-react';

export default function DonorProgramsPage() {
  const {
    programs,
    applications,
    activeDonorId,
    formatRupiah,
    submitProgramForVerification,
    requestCancellation,
  } = useMockApp();

  const [cancelTarget, setCancelTarget] = useState<ScholarshipProgram | null>(null);

  const myPrograms = programs.filter((p) => p.donorId === activeDonorId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Program Beasiswa Saya"
        description="Kelola program beasiswa yang dibuat oleh organisasi Anda, pantau pendaftar, dan ajukan verifikasi atau pembatalan."
        actions={
          <Link
            href="/donor/programs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Program Baru</span>
          </Link>
        }
      />

      {myPrograms.length === 0 ? (
        <EmptyState
          title="Belum Ada Program Beasiswa"
          description="Mulai buat program beasiswa pertama untuk membantu mahasiswa berprestasi."
          icon={GraduationCap}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myPrograms.map((prog) => {
            const progApps = applications.filter((a) => a.programId === prog.id);
            const awaitingDonor = progApps.filter(
              (a) =>
                a.status === 'Menunggu Persetujuan Donatur' ||
                a.status === 'Direkomendasikan ke Donatur'
            ).length;

            const canCancel = !['Dibatalkan', 'Selesai', 'Ditolak'].includes(prog.status);

            return (
              <div
                key={prog.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={prog.status} />
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {prog.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Periode: {prog.scholarshipPeriod}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{prog.title}</h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/donor/programs/${prog.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail & Tab</span>
                    </Link>

                    {prog.status === 'Draft' && (
                      <button
                        onClick={() => submitProgramForVerification(prog.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Ajukan Verifikasi</span>
                      </button>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => setCancelTarget(prog)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold cursor-pointer"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Ajukan Pembatalan</span>
                      </button>
                    )}
                  </div>
                </div>

                {prog.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <strong>Alasan Penolakan Admin:</strong> {prog.rejectionReason}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Kuota</span>
                    <strong className="text-slate-900">{prog.quota} Mahasiswa</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Anggaran</span>
                    <strong className="text-slate-900">{formatRupiah(prog.totalBudget)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Dana Disetorkan (Escrow)</span>
                    <strong className="text-blue-700">{formatRupiah(prog.escrowDeposited)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Jumlah Pendaftar</span>
                    <strong className="text-slate-900">{progApps.length} Mahasiswa</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Menunggu Persetujuan</span>
                    <strong className="text-purple-700">{awaitingDonor} Calon Penerima</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        title={`Ajukan Pembatalan: ${cancelTarget?.title}?`}
        description={
          cancelTarget?.status === 'Draft' || cancelTarget?.status === 'Menunggu Verifikasi'
            ? 'Program belum dibuka untuk pendaftaran sehingga dapat dibatalkan langsung.'
            : 'PERINGATAN: Pendaftaran program sudah dibuka. Pembatalan memerlukan persetujuan Kementerian/Admin untuk kondisi khusus, dan dana yang sudah menjadi hak penerima tetap tidak dapat ditarik.'
        }
        confirmLabel="Kirim Permintaan Pembatalan"
        variant="danger"
        requireReason
        reasonPlaceholder="Jelaskan kondisi khusus alasan pembatalan program..."
        onConfirm={(reason) => {
          if (cancelTarget) requestCancellation(cancelTarget.id, reason);
          setCancelTarget(null);
        }}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
}
