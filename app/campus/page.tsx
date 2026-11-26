'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import {
  Users,
  GraduationCap,
  FileText,
  FileClock,
  UserCheck,
  Coins,
  Send,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default function CampusOverviewPage() {
  const {
    campuses,
    students,
    programs,
    applications,
    transactions,
    activeCampusId,
    formatRupiah,
  } = useMockApp();

  const campus = campuses.find((c) => c.id === activeCampusId);
  const myStudents = students.filter((s) => s.campusId === activeCampusId);
  const eligiblePrograms = programs.filter(
    (p) =>
      p.status !== 'Draft' &&
      (p.targetCampusIds.includes('ALL') || p.targetCampusIds.includes(activeCampusId))
  );
  const myApps = applications.filter((a) => a.campusId === activeCampusId);
  const pendingDocs = myApps.filter(
    (a) => a.status === 'Diajukan' || a.status === 'Perlu Perbaikan'
  );
  const waitingDonor = myApps.filter(
    (a) =>
      a.status === 'Menunggu Persetujuan Donatur' ||
      a.status === 'Direkomendasikan ke Donatur'
  );

  const fundsReceived = transactions
    .filter(
      (t) =>
        t.type === 'Alokasi ke Kampus' &&
        t.toWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
    )
    .reduce((acc, t) => acc + t.amount, 0);

  const fundsDisbursed = transactions
    .filter(
      (t) =>
        t.type === 'Penyaluran ke Mahasiswa' &&
        t.fromWallet.toLowerCase() === campus?.walletAddress.toLowerCase()
    )
    .reduce((acc, t) => acc + t.amount, 0);

  const remainingObligation = Math.max(0, fundsReceived - fundsDisbursed);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Validator Kampus"
        description={`Portal resmi ${campus?.name || 'Kampus'} untuk registrasi mahasiswa, verifikasi dokumen akademik, dan penyaluran dana beasiswa.`}
        badge={campus?.code || 'Kampus'}
      />

      {/* 8 Kartu Ringkasan Section 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Mahasiswa Terdaftar"
          value={myStudents.length}
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Program Tersedia"
          value={eligiblePrograms.length}
          icon={GraduationCap}
          tone="indigo"
        />
        <StatCard
          label="Pendaftar Aktif"
          value={myApps.length}
          icon={FileText}
          tone="slate"
        />
        <StatCard
          label="Menunggu Verifikasi Dokumen"
          value={pendingDocs.length}
          icon={FileClock}
          tone="amber"
        />
        <StatCard
          label="Menunggu Persetujuan Donatur"
          value={waitingDonor.length}
          icon={UserCheck}
          tone="indigo"
        />
        <StatCard
          label="Dana Diterima Kampus"
          value={formatRupiah(fundsReceived)}
          icon={Coins}
          tone="blue"
        />
        <StatCard
          label="Dana Disalurkan ke Mahasiswa"
          value={formatRupiah(fundsDisbursed)}
          icon={Send}
          tone="emerald"
        />
        <StatCard
          label="Kewajiban Penyaluran Tersisa"
          value={formatRupiah(remainingObligation)}
          icon={AlertCircle}
          tone={remainingObligation > 0 ? 'rose' : 'slate'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
          <h2 className="font-bold text-slate-900 text-base">
            Antrean Verifikasi Dokumen ({pendingDocs.length})
          </h2>
          <p className="text-xs text-slate-500">
            Validasi keaktifan mahasiswa dan kelengkapan berkas pendaftar sebelum direkomendasikan ke donatur.
          </p>
          <Link
            href="/campus/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            <span>Buka Pendaftar & Verifikasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
          <h2 className="font-bold text-slate-900 text-base">
            Kewajiban Penyaluran Dana ({formatRupiah(remainingObligation)})
          </h2>
          <p className="text-xs text-slate-500">
            Dana yang sudah dialokasikan oleh donatur ke wallet kampus wajib disalurkan kepada mahasiswa penerima yang disetujui.
          </p>
          <Link
            href="/campus/disbursements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            <span>Kelola Penyaluran Dana</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
