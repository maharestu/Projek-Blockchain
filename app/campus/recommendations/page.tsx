'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { ScholarshipApplication } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { Send, UserCheck, Lock } from 'lucide-react';

export default function CampusRecommendationsPage() {
  const {
    applications,
    students,
    programs,
    activeCampusId,
    formatRupiah,
    recommendRecipient,
  } = useMockApp();

  const [targetApp, setTargetApp] = useState<ScholarshipApplication | null>(null);

  const myApps = applications.filter(
    (a) =>
      a.campusId === activeCampusId &&
      [
        'Diverifikasi Kampus',
        'Direkomendasikan ke Donatur',
        'Menunggu Persetujuan Donatur',
        'Disetujui Donatur',
        'Ditolak Donatur',
      ].includes(a.status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Rekomendasi Penerima Beasiswa"
        description="Kirimkan daftar mahasiswa yang telah tervalidasi akademik sebagai calon penerima resmi kepada Donatur/Yayasan."
      />

      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
        <Lock className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
        <span>
          Kampus berwenang memverifikasi dan merekomendasikan calon penerima, namun <strong>keputusan persetujuan akhir sepenuhnya berada di pihak Donatur</strong>.
        </span>
      </div>

      {myApps.length === 0 ? (
        <EmptyState
          title="Belum Ada Mahasiswa Siap Direkomendasikan"
          description="Selesaikan verifikasi dokumen mahasiswa pada menu Pendaftar & Verifikasi terlebih dahulu."
          icon={UserCheck}
        />
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const student = students.find((s) => s.id === app.studentId);
            const prog = programs.find((p) => p.id === app.programId);
            const canRecommend = app.status === 'Diverifikasi Kampus';

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={app.status} />
                    <span className="font-semibold text-blue-700">{prog?.title}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {student?.name} ({student?.nim})
                  </h3>
                  <p className="text-slate-500">
                    {student?.degree} {student?.major} • IPK {student?.gpa} • Nominal Usulan:{' '}
                    <strong className="text-slate-800">
                      {formatRupiah(app.recommendedAmount || prog?.amountPerRecipient || 0)}
                    </strong>
                  </p>
                  {app.campusNote && (
                    <p className="text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 mt-1">
                      Catatan Kampus: {app.campusNote}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {canRecommend ? (
                    <button
                      onClick={() => setTargetApp(app)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Rekomendasi ke Donatur</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400">
                      Terkirim ke Donatur
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(targetApp)}
        title="Kirim Rekomendasi Penerima ke Donatur?"
        description="Status pengajuan akan berubah menjadi Menunggu Persetujuan Donatur. Kampus tidak dapat mengubah keputusan akhir donatur."
        confirmLabel="Kirim Rekomendasi"
        variant="primary"
        requireReason
        reasonPlaceholder="Tambahkan ringkasan rekomendasi akademik..."
        onConfirm={(note) => {
          if (targetApp) recommendRecipient(targetApp.id, note);
          setTargetApp(null);
        }}
        onCancel={() => setTargetApp(null)}
      />
    </div>
  );
}
