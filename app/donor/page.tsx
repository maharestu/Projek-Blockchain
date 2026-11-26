'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Coins,
  Send,
  Wallet,
  PlusCircle,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export default function DonorOverviewPage() {
  const {
    programs,
    applications,
    donors,
    activeDonorId,
    activities,
    formatRupiah,
  } = useMockApp();

  const donor = donors.find((d) => d.id === activeDonorId);
  const myPrograms = programs.filter((p) => p.donorId === activeDonorId);
  const activeCount = myPrograms.filter((p) =>
    ['Dibuka', 'Seleksi', 'Aktif'].includes(p.status)
  ).length;
  const pendingVerifCount = myPrograms.filter(
    (p) => p.status === 'Menunggu Verifikasi'
  ).length;

  const totalDeposit = myPrograms.reduce((acc, p) => acc + p.escrowDeposited, 0);
  const totalDisbursed = myPrograms.reduce((acc, p) => acc + p.disbursedToStudents, 0);
  const totalAllocated = myPrograms.reduce((acc, p) => acc + p.allocatedToCampus, 0);
  const unallocatedEscrow = Math.max(0, totalDeposit - totalAllocated);

  const myProgramIds = myPrograms.map((p) => p.id);
  const awaitingApproval = applications.filter(
    (a) =>
      myProgramIds.includes(a.programId) &&
      (a.status === 'Menunggu Persetujuan Donatur' ||
        a.status === 'Direkomendasikan ke Donatur')
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Donatur & Yayasan"
        description={`Selamat datang, ${donor?.name || 'Donatur'}. Kelola program beasiswa, setujui rekomendasi penerima, dan pantau dana escrow secara transparan.`}
        badge={donor?.organizationType || 'Donatur'}
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

      {/* 6 Kartu Ringkasan Section 6 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Total Program"
          value={myPrograms.length}
          sublabel="Seluruh program milik yayasan"
          icon={GraduationCap}
          tone="blue"
        />
        <StatCard
          label="Program Aktif"
          value={activeCount}
          sublabel="Dibuka atau dalam tahap seleksi"
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Menunggu Verifikasi Admin"
          value={pendingVerifCount}
          sublabel="Menunggu persetujuan Kementerian"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Total Deposit Escrow"
          value={formatRupiah(totalDeposit)}
          sublabel="Dana terkumpul pada smart contract"
          icon={Coins}
          tone="indigo"
        />
        <StatCard
          label="Dana Disalurkan ke Mahasiswa"
          value={formatRupiah(totalDisbursed)}
          sublabel="Telah diterima mahasiswa via kampus"
          icon={Send}
          tone="emerald"
        />
        <StatCard
          label="Saldo Escrow Belum Dialokasikan"
          value={formatRupiah(unallocatedEscrow)}
          sublabel="Tersedia untuk alokasi penerima baru"
          icon={Wallet}
          tone="slate"
        />
      </div>

      {/* Tugas & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Membutuhkan Persetujuan Anda</span>
            </h2>
            <Link
              href="/donor/recipient-approvals"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Kelola Semua
            </Link>
          </div>

          {awaitingApproval.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
              Belum ada rekomendasi calon penerima baru dari kampus.
            </div>
          ) : (
            <div className="space-y-3">
              {awaitingApproval.map((app) => {
                const prog = programs.find((p) => p.id === app.programId);
                return (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-purple-800">
                        Rekomendasi Kampus
                      </span>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {prog?.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{app.campusNote}</p>
                    </div>
                    <Link
                      href="/donor/recipient-approvals"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0"
                    >
                      <span>Tinjau</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <h2 className="font-bold text-slate-900 text-base">Aktivitas Terbaru</h2>
          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{act.actorName}</p>
                  <p className="text-slate-600 mt-0.5">
                    {act.action}: <strong>{act.target}</strong>
                  </p>
                  <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                </div>
                <StatusBadge status={act.category} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
