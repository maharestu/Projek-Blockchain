'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { FolderOpen, FileText, Lock } from 'lucide-react';

export default function StudentDocumentsPage() {
  const { applications, programs, activeStudentId } = useMockApp();
  const myApps = applications.filter((a) => a.studentId === activeStudentId);

  const allDocs = myApps.flatMap((app) => {
    const prog = programs.find((p) => p.id === app.programId);
    return app.documents.map((doc) => ({
      ...doc,
      appId: app.id,
      appStatus: app.status,
      programTitle: prog?.title || app.programId,
    }));
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dokumen Saya"
        description="Daftar dokumen pribadi yang telah Anda unggah. Dokumen pribadi hanya terlihat oleh Anda dan validator kampus berwenang."
      />

      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-center gap-2.5">
        <Lock className="w-4 h-4 text-slate-600 shrink-0" />
        <span>
          Dokumen yang sudah masuk tahap verifikasi dikunci secara otomatis dan hanya dapat diganti apabila kampus meminta perbaikan.
        </span>
      </div>

      {allDocs.length === 0 ? (
        <EmptyState
          title="Belum Ada Dokumen Diunggah"
          description="Unggah dokumen saat mengajukan pendaftaran program beasiswa."
          icon={FolderOpen}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Nama Dokumen & Berkas</th>
                <th className="py-3.5 px-4">Program Terkait</th>
                <th className="py-3.5 px-4">Tanggal Unggah</th>
                <th className="py-3.5 px-4">Status Verifikasi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.fileName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{doc.programTitle}</td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.uploadedAt}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge
                      status={doc.verified ? 'Disetujui' : 'Menunggu Verifikasi'}
                    />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/student/applications/${doc.appId}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      {doc.appStatus === 'Perlu Perbaikan'
                        ? 'Perbaiki Dokumen'
                        : 'Lihat Pengajuan'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
