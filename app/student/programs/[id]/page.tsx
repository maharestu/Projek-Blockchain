'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Send,
  Ban,
} from 'lucide-react';

export default function StudentProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    programs,
    donors,
    campuses,
    students,
    applications,
    activeStudentId,
    formatRupiah,
    submitApplication,
  } = useMockApp();

  const student = students.find((s) => s.id === activeStudentId);
  const program = programs.find((p) => p.id === id);

  const [showApplyForm, setShowApplyForm] = useState(false);
  const [essay, setEssay] = useState('');
  const [docFiles, setDocFiles] = useState<Record<string, string>>({});

  if (!program) {
    return (
      <EmptyState
        title="Program Tidak Ditemukan"
        description="Program beasiswa tidak tersedia."
      />
    );
  }

  const donor = donors.find((d) => d.id === program.donorId);
  const campusEligible =
    program.targetCampusIds.includes('ALL') ||
    (student && program.targetCampusIds.includes(student.campusId));
  const alreadyApplied = applications.find(
    (a) => a.programId === program.id && a.studentId === activeStudentId
  );
  const canApply =
    program.status === 'Dibuka' &&
    campusEligible &&
    !alreadyApplied &&
    student?.status === 'Aktif';

  const targetCampusesLabel = program.targetCampusIds.includes('ALL')
    ? 'Semua Kampus Mitra Terdaftar'
    : program.targetCampusIds
        .map((cid) => campuses.find((c) => c.id === cid)?.name || cid)
        .join(', ');

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const docs = program.requiredDocuments.map((docName) => ({
      name: docName,
      type: 'Dokumen Wajib',
      fileName: docFiles[docName] || `${docName.toLowerCase().replace(/\s+/g, '_')}_simulasi.pdf`,
    }));

    const ok = submitApplication(program.id, essay, docs);
    if (ok) {
      router.push('/student/applications');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/student/programs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Cari Beasiswa</span>
      </Link>

      <PageHeader
        title={program.title}
        description={`Penyelenggara: ${donor?.name} • Periode ${program.scholarshipPeriod}`}
        badge={program.status}
      />

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <span className="text-slate-500 block">Nominal Bantuan</span>
            <strong className="text-lg font-extrabold text-blue-700">
              {formatRupiah(program.amountPerRecipient)}
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Kuota & Jenjang</span>
            <strong className="text-sm font-bold text-slate-900">
              {program.quota} Penerima • {program.targetDegree}
            </strong>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 block">Jadwal Pendaftaran</span>
            <strong className="text-sm font-bold text-slate-900">
              {program.openDate} s/d {program.closeDate}
            </strong>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-slate-900 text-sm">Deskripsi & Cakupan Kampus</h2>
          <p className="text-slate-600 leading-relaxed text-sm">{program.description}</p>
          <p className="text-slate-700">
            <strong>Kampus yang Memenuhi Syarat:</strong> {targetCampusesLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Persyaratan</h3>
            <ul className="space-y-1.5">
              {program.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">Dokumen Wajib</h3>
            <ul className="space-y-1.5">
              {program.requiredDocuments.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Status & Apply Action */}
        <div className="pt-4 border-t border-slate-100">
          {alreadyApplied ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StatusBadge status={alreadyApplied.status} />
                <span className="font-semibold text-emerald-900">
                  Anda sudah mengajukan pendaftaran pada program ini.
                </span>
              </div>
              <Link
                href={`/student/applications/${alreadyApplied.id}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                Lihat Pengajuan Saya
              </Link>
            </div>
          ) : !campusEligible ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-800">
              <Ban className="w-4 h-4 shrink-0" />
              <span>
                <strong>Tombol Apply Nonaktif:</strong> Program ini tidak mencakup perguruan tinggi Anda.
              </span>
            </div>
          ) : program.status !== 'Dibuka' ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
              Pendaftaran belum dibuka atau sudah memasuki tahap {program.status}.
            </div>
          ) : !showApplyForm ? (
            <button
              onClick={() => setShowApplyForm(true)}
              disabled={!canApply}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Ajukan Beasiswa Sekarang</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Form Pengajuan Beasiswa */}
      {showApplyForm && canApply && (
        <form
          onSubmit={handleApplySubmit}
          className="rounded-2xl bg-white border border-blue-200 shadow-sm p-6 space-y-5 text-xs"
        >
          <h3 className="text-base font-bold text-slate-900">
            Formulir Pengajuan Beasiswa
          </h3>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Esai Motivasi & Rencana Studi *
            </label>
            <textarea
              required
              rows={4}
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              placeholder="Jelaskan latar belakang prestasi, kebutuhan dukungan, serta rencana kontribusi Anda..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />
          </div>

          <div className="space-y-3">
            <label className="font-semibold text-slate-700 block">
              Unggah Dokumen Wajib (Simulasi Upload Berkas)
            </label>
            {program.requiredDocuments.map((docName) => (
              <div
                key={docName}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="font-semibold text-slate-800">{docName}</span>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{docFiles[docName] || 'Pilih File PDF (Simulasi)'}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setDocFiles({ ...docFiles, [docName]: f.name });
                    }}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowApplyForm(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pengajuan ke Kampus</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
