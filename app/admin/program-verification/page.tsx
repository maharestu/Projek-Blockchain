'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { ScholarshipProgram } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { CheckCircle2, XCircle, Building2, Calendar, GraduationCap, FileCheck2 } from 'lucide-react';

export default function AdminProgramVerificationPage() {
  const { programs, donors, campuses, formatRupiah, verifyProgram } = useMockApp();
  const [rejectTarget, setRejectTarget] = useState<ScholarshipProgram | null>(null);
  const [approveTarget, setApproveTarget] = useState<ScholarshipProgram | null>(null);

  const pendingPrograms = programs.filter((p) => p.status === 'Menunggu Verifikasi');
  const reviewedPrograms = programs.filter((p) =>
    ['Dibuka', 'Ditolak', 'Seleksi', 'Selesai'].includes(p.status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verifikasi Kelayakan Program"
        description="Admin memverifikasi kelayakan program beasiswa sebelum dibuka ke publik. Admin tidak memilih penerima atau mengubah nominal donatur."
        badge={`${pendingPrograms.length} Menunggu`}
      />

      {pendingPrograms.length === 0 ? (
        <EmptyState
          title="Tidak Ada Antrean Verifikasi Program"
          description="Seluruh program beasiswa yang diajukan oleh donatur telah diverifikasi."
          icon={FileCheck2}
        />
      ) : (
        <div className="space-y-4">
          {pendingPrograms.map((prog) => {
            const donor = donors.find((d) => d.id === prog.donorId);
            const targetNames = prog.targetCampusIds.includes('ALL')
              ? 'Semua Kampus Mitra'
              : prog.targetCampusIds
                  .map((id) => campuses.find((c) => c.id === id)?.name || id)
                  .join(', ');

            return (
              <div
                key={prog.id}
                className="rounded-2xl bg-white border border-amber-200 shadow-sm p-6 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={prog.status} />
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {prog.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">{prog.title}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      Penyelenggara: <strong>{donor?.name || prog.donorId}</strong>
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block">Total Anggaran</span>
                    <strong className="text-lg font-extrabold text-blue-700">
                      {formatRupiah(prog.totalBudget)}
                    </strong>
                    <span className="block text-[11px] text-slate-500">
                      {prog.quota} kuota × {formatRupiah(prog.amountPerRecipient)}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {prog.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Kampus Sasaran</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      {targetNames}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Jadwal Pendaftaran</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      {prog.openDate} s/d {prog.closeDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Periode & Aset</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {prog.scholarshipPeriod} ({prog.assetSymbol})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <strong className="text-slate-800 block mb-1.5">Persyaratan:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {prog.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong className="text-slate-800 block mb-1.5">Dokumen Wajib:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      {prog.requiredDocuments.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setRejectTarget(prog)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak Program</span>
                  </button>
                  <button
                    onClick={() => setApproveTarget(prog)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui & Buka Program</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Riwayat Program yang Sudah Diverifikasi */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-slate-900 text-sm">Riwayat Keputusan Program</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Penyelenggara</th>
                <th className="py-3 px-4">Anggaran</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviewedPrograms.map((p) => {
                const d = donors.find((x) => x.id === p.donorId);
                return (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold text-slate-800">{p.title}</td>
                    <td className="py-3 px-4 text-slate-600">{d?.name}</td>
                    <td className="py-3 px-4 font-semibold">{formatRupiah(p.totalBudget)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(approveTarget)}
        title="Setujui & Buka Program Beasiswa?"
        description={`Program "${approveTarget?.title}" akan berstatus Dibuka sehingga kampus dan mahasiswa sasaran dapat melihat dan mendaftar.`}
        confirmLabel="Ya, Setujui Program"
        variant="primary"
        onConfirm={() => {
          if (approveTarget) verifyProgram(approveTarget.id, true);
          setApproveTarget(null);
        }}
        onCancel={() => setApproveTarget(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(rejectTarget)}
        title="Tolak Pengajuan Program?"
        description={`Berikan alasan penolakan untuk "${rejectTarget?.title}" agar donatur dapat memperbaiki rancangan program.`}
        confirmLabel="Tolak Program"
        variant="danger"
        requireReason
        onConfirm={(reason) => {
          if (rejectTarget) verifyProgram(rejectTarget.id, false, reason);
          setRejectTarget(null);
        }}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
}
