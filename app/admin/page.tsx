'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/common/StatCard';
import StatusBadge from '@/components/common/StatusBadge';
import {
  Building2,
  HeartHandshake,
  Users,
  FileClock,
  GraduationCap,
  AlertOctagon,
  ArrowRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const {
    campuses,
    donors,
    students,
    programs,
    cancellationRequests,
    activities,
  } = useMockApp();

  const activeCampuses = campuses.filter((c) => c.status === 'Aktif').length;
  const activeDonors = donors.filter((d) => d.status === 'Aktif').length;
  const pendingPrograms = programs.filter((p) => p.status === 'Menunggu Verifikasi');
  const activePrograms = programs.filter((p) =>
    ['Dibuka', 'Seleksi', 'Aktif'].includes(p.status)
  ).length;
  const pendingCancellations = cancellationRequests.filter(
    (r) => r.status === 'Menunggu Admin'
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ringkasan Pengawasan Kementerian"
        description="Pantau ekosistem kampus, donatur/yayasan, kelayakan program beasiswa, dan permintaan pembatalan secara terpusat."
        badge="Admin / Regulator"
      />

      {/* 6 Stat Cards sesuai Section 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Kampus Aktif"
          value={activeCampuses}
          sublabel={`Dari total ${campuses.length} kampus terdaftar`}
          icon={Building2}
          tone="blue"
        />
        <StatCard
          label="Donatur / Yayasan Aktif"
          value={activeDonors}
          sublabel={`Dari total ${donors.length} organisasi donor`}
          icon={HeartHandshake}
          tone="emerald"
        />
        <StatCard
          label="Mahasiswa Terdaftar"
          value={students.length}
          sublabel="Didaftarkan oleh kampus mitra"
          icon={Users}
          tone="indigo"
        />
        <StatCard
          label="Program Menunggu Verifikasi"
          value={pendingPrograms.length}
          sublabel="Perlu tinjauan kelayakan admin"
          icon={FileClock}
          tone="amber"
        />
        <StatCard
          label="Program Aktif / Berjalan"
          value={activePrograms}
          sublabel="Dibuka atau dalam tahap seleksi"
          icon={GraduationCap}
          tone="blue"
        />
        <StatCard
          label="Permintaan Pembatalan"
          value={pendingCancellations.length}
          sublabel="Menunggu keputusan admin"
          icon={AlertOctagon}
          tone="rose"
        />
      </div>

      {/* Tugas & Aktivitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tugas Perlu Ditindaklanjuti */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base">
              Tugas Perlu Ditindaklanjuti
            </h2>
            <span className="text-xs font-semibold text-blue-600">
              {pendingPrograms.length + pendingCancellations.length} Antrean
            </span>
          </div>

          <div className="space-y-3">
            {pendingPrograms.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-amber-800">
                    Verifikasi Program Baru
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                </div>
                <Link
                  href="/admin/program-verification"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0"
                >
                  <span>Tinjau</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}

            {pendingCancellations.map((c) => {
              const prog = programs.find((p) => p.id === c.programId);
              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-rose-800">
                      Permintaan Pembatalan
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {prog?.title || c.programId}
                    </p>
                  </div>
                  <Link
                    href="/admin/cancellation-requests"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0"
                  >
                    <span>Keputusan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}

            {pendingPrograms.length === 0 && pendingCancellations.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                Semua antrean verifikasi dan pembatalan telah ditangani.
              </div>
            )}
          </div>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Aktivitas Terbaru Ekosistem</span>
            </h2>
            <Link
              href="/admin/activities"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">{act.actorName}</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {act.action}: <strong className="text-slate-800">{act.target}</strong>
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
