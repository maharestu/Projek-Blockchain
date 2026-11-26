'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { ScholarshipApplication } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import Timeline from '@/components/common/Timeline';
import EmptyState from '@/components/common/EmptyState';
import { FileCheck2, CheckCircle2, XCircle, AlertTriangle, X, FileText } from 'lucide-react';

export default function CampusApplicationsPage() {
  const { applications, students, programs, activeCampusId, verifyApplication } = useMockApp();

  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
  const [checklist, setChecklist] = useState({
    activeStatus: true,
    gpaVerified: true,
    documentsComplete: true,
  });
  const [note, setNote] = useState('');

  const myApps = applications.filter((a) => a.campusId === activeCampusId);

  const openDetail = (app: ScholarshipApplication) => {
    setSelectedApp(app);
    setChecklist(app.checklist);
    setNote(app.campusNote || '');
  };

  const handleDecision = (decision: 'valid' | 'revision' | 'reject') => {
    if (!selectedApp) return;
    if ((decision === 'revision' || decision === 'reject') && !note.trim()) {
      alert('Harap isi catatan atau alasan untuk permintaan perbaikan / penolakan.');
      return;
    }
    verifyApplication(selectedApp.id, decision, checklist, note);
    setSelectedApp(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pendaftar & Verifikasi Dokumen"
        description="Periksa dokumen privat pendaftar dari kampus Anda, isi checklist persyaratan, dan tetapkan hasil validasi akademik."
      />

      {myApps.length === 0 ? (
        <EmptyState
          title="Belum Ada Pendaftar Beasiswa"
          description="Belum ada mahasiswa dari kampus Anda yang mengajukan pendaftaran beasiswa."
          icon={FileCheck2}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                <th className="py-3.5 px-4">Mahasiswa & NIM</th>
                <th className="py-3.5 px-4">Program Beasiswa</th>
                <th className="py-3.5 px-4">Tanggal Pengajuan</th>
                <th className="py-3.5 px-4">Kelengkapan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myApps.map((app) => {
                const student = students.find((s) => s.id === app.studentId);
                const prog = programs.find((p) => p.id === app.programId);
                return (
                  <tr key={app.id} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{student?.name}</p>
                      <p className="text-[11px] text-slate-500">
                        NIM {student?.nim} • IPK {student?.gpa}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {prog?.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{app.submittedAt}</td>
                    <td className="py-3.5 px-4">{app.documents.length} Dokumen</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openDetail(app)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold cursor-pointer"
                      >
                        Periksa & Verifikasi
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail & Verifikasi */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setSelectedApp(null)} />
          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5 my-8 text-xs">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <StatusBadge status={selectedApp.status} />
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {students.find((s) => s.id === selectedApp.studentId)?.name}
                </h3>
                <p className="text-slate-500">
                  Program: {programs.find((p) => p.id === selectedApp.programId)?.title}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Dokumen Privat Mahasiswa */}
            <div className="space-y-2">
              <strong className="text-slate-800 block uppercase tracking-wider text-[11px]">
                Dokumen Privat Pelamar (Hanya Terlihat oleh Kampus Berwenang)
              </strong>
              <div className="space-y-2">
                {selectedApp.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.fileName} • Diunggah {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-700">
                      Pratinjau (Simulasi)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Verifikasi */}
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
              <strong className="text-slate-900 block">Checklist Persyaratan Akademik:</strong>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.activeStatus}
                  onChange={(e) =>
                    setChecklist({ ...checklist, activeStatus: e.target.checked })
                  }
                />
                <span>Status Mahasiswa Aktif Terkonfirmasi di PDDikti</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.gpaVerified}
                  onChange={(e) =>
                    setChecklist({ ...checklist, gpaVerified: e.target.checked })
                  }
                />
                <span>IPK dan Transkrip Resmi Sesuai Kriteria Program</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.documentsComplete}
                  onChange={(e) =>
                    setChecklist({ ...checklist, documentsComplete: e.target.checked })
                  }
                />
                <span>Seluruh Dokumen Pendukung Lengkap & Sah</span>
              </label>
            </div>

            {/* Catatan Validator */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Catatan Verifikasi Kampus
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Tuliskan hasil verifikasi atau instruksi perbaikan berkas..."
                className="w-full rounded-xl border border-slate-300 px-3 py-2"
              />
            </div>

            {/* Riwayat Perubahan Status */}
            <div className="pt-2 border-t border-slate-100">
              <strong className="text-slate-800 block mb-3">Riwayat Status Pengajuan</strong>
              <Timeline items={selectedApp.timeline} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleDecision('reject')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Tolak</span>
              </button>
              <button
                onClick={() => handleDecision('revision')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Minta Perbaikan</span>
              </button>
              <button
                onClick={() => handleDecision('valid')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tandai Valid</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
