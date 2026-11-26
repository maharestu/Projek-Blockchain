'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import Timeline from '@/components/common/Timeline';
import EmptyState from '@/components/common/EmptyState';
import { ArrowLeft, Lock, Upload, FileText, Send, AlertTriangle } from 'lucide-react';

export default function StudentApplicationDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { applications, programs, activeStudentId, reviseApplication } = useMockApp();
  const app = applications.find((a) => a.id === id && a.studentId === activeStudentId);

  const [essay, setEssay] = useState(app?.motivationEssay || '');
  const [revisedFiles, setRevisedFiles] = useState<Record<string, string>>({});

  if (!app) {
    return (
      <EmptyState
        title="Pengajuan Tidak Ditemukan"
        description="Data pengajuan beasiswa tidak ditemukan atau bukan milik akun Anda."
      />
    );
  }

  const prog = programs.find((p) => p.id === app.programId);
  const canRevise = app.status === 'Perlu Perbaikan';

  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docs = (prog?.requiredDocuments || ['Dokumen Pendukung']).map((docName) => ({
      name: docName,
      type: 'Dokumen Perbaikan',
      fileName:
        revisedFiles[docName] ||
        `${docName.toLowerCase().replace(/\s+/g, '_')}_revisi.pdf`,
    }));

    reviseApplication(app.id, essay || app.motivationEssay, docs);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/student/applications"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beasiswa Saya</span>
      </Link>

      <PageHeader
        title={prog?.title || 'Detail Pengajuan'}
        description={`Diajukan pada ${app.submittedAt}`}
        badge={app.status}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Status */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
          <h2 className="font-bold text-slate-900 text-base">Timeline Status Pengajuan</h2>
          <Timeline items={app.timeline} />

          {app.donorNote && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
              <strong>Catatan Keputusan Donatur:</strong> {app.donorNote}
            </div>
          )}
        </div>

        {/* Status Dokumen & Kunci */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Dokumen Pengajuan</h3>

          {!canRevise ? (
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-start gap-2">
              <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <span>
                <strong>Dokumen Dikunci:</strong> Pengubahan dokumen hanya tersedia apabila kampus menetapkan status <em>Perlu Perbaikan</em>.
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Perbaikan Diperlukan:</strong> {app.campusNote}
              </span>
            </div>
          )}

          <div className="space-y-2">
            {app.documents.map((d) => (
              <div
                key={d.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{d.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{d.fileName}</p>
                </div>
                <StatusBadge status={d.verified ? 'Disetujui' : 'Menunggu Verifikasi'} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Perbaikan Dokumen (jika Perlu Perbaikan) */}
      {canRevise && (
        <form
          onSubmit={handleReviseSubmit}
          className="rounded-2xl bg-white border border-amber-300 p-6 space-y-4 text-xs"
        >
          <h3 className="font-bold text-slate-900 text-base">
            Unggah Perbaikan Dokumen
          </h3>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Esai Motivasi</label>
            <textarea
              rows={3}
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </div>
          <div className="space-y-2">
            {(prog?.requiredDocuments || ['Dokumen Perbaikan']).map((docName) => (
              <div
                key={docName}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
              >
                <span className="font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  {docName}
                </span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{revisedFiles[docName] || 'Pilih File Baru (Simulasi)'}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setRevisedFiles({ ...revisedFiles, [docName]: f.name });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Ulang Dokumen Perbaikan</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
