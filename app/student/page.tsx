'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import {
  FileText,
  FileClock,
  UserCheck,
  CheckCircle2,
  Coins,
  Search,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export default function StudentOverviewPage() {
  const {
    students,
    campuses,
    programs,
    applications,
    transactions,
    activeStudentId,
    formatRupiah,
  } = useMockApp();

  const student = students.find((s) => s.id === activeStudentId);
  const campus = campuses.find((c) => c.id === student?.campusId);
  const myApps = applications.filter((a) => a.studentId === activeStudentId);

  const waitingCampus = myApps.filter(
    (a) => a.status === 'Diajukan' || a.status === 'Perlu Perbaikan'
  ).length;
  const waitingDonor = myApps.filter(
    (a) =>
      a.status === 'Menunggu Persetujuan Donatur' ||
      a.status === 'Direkomendasikan ke Donatur' ||
      a.status === 'Diverifikasi Kampus'
  ).length;
  const approvedCount = myApps.filter((a) => a.status === 'Disetujui Donatur').length;

  const totalFundsReceived = transactions
    .filter(
      (t) =>
        t.type === 'Penyaluran ke Mahasiswa' &&
        t.toWallet.toLowerCase() === student?.walletAddress.toLowerCase()
    )
    .reduce((acc, t) => acc + t.amount, 0);

  const recommendedPrograms = programs.filter(
    (p) =>
      p.status === 'Dibuka' &&
      (p.targetCampusIds.includes('ALL') ||
        (student && p.targetCampusIds.includes(student.campusId)))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Halo, ${student?.name || 'Mahasiswa'}`}
        description={`${campus?.name || ''} • ${student?.degree} ${student?.major} (NIM: ${student?.nim})`}
        badge={student?.status || 'Aktif'}
        actions={
          <Link
            href="/student/programs"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
          >
            <Search className="w-4 h-4" />
            <span>Cari Beasiswa</span>
          </Link>
        }
      />

      {/* 5 Kartu Ringkasan Section 8 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Pengajuan Aktif"
          value={myApps.length}
          icon={FileText}
          tone="blue"
        />
        <StatCard
          label="Menunggu Verifikasi Kampus"
          value={waitingCampus}
          icon={FileClock}
          tone="amber"
        />
        <StatCard
          label="Menunggu Persetujuan Donatur"
          value={waitingDonor}
          icon={UserCheck}
          tone="indigo"
        />
        <StatCard
          label="Disetujui"
          value={approvedCount}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Total Dana Diterima"
          value={formatRupiah(totalFundsReceived)}
          icon={Coins}
          tone="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rekomendasi Program Sesuai Kampus */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Rekomendasi Beasiswa untuk Kampus Anda</span>
            </h2>
            <Link
              href="/student/programs"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {recommendedPrograms.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">
              Belum ada program terbuka yang sesuai kampus Anda saat ini.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendedPrograms.map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <StatusBadge status={prog.status} />
                    <p className="text-xs font-bold text-slate-900 mt-1.5 truncate">
                      {prog.title}
                    </p>
                    <p className="text-[11px] text-blue-700 font-semibold">
                      {formatRupiah(prog.amountPerRecipient)} • Tutup: {prog.closeDate}
                    </p>
                  </div>
                  <Link
                    href={`/student/programs/${prog.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shrink-0"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Pengajuan Saya */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">Beasiswa Saya Terbaru</h2>
            <Link
              href="/student/applications"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Semua Pengajuan
            </Link>
          </div>

          {myApps.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl">
              Anda belum mengajukan pendaftaran beasiswa apa pun.
            </p>
          ) : (
            <div className="space-y-3">
              {myApps.map((app) => {
                const prog = programs.find((p) => p.id === app.programId);
                return (
                  <Link
                    key={app.id}
                    href={`/student/applications/${app.id}`}
                    className="block p-4 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {prog?.title}
                      </p>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Diajukan: {app.submittedAt}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
