'use client';

import React from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { GraduationCap, ArrowRight } from 'lucide-react';

export default function StudentApplicationsListPage() {
  const { applications, programs, donors, activeStudentId, formatRupiah } = useMockApp();

  const myApps = applications.filter((a) => a.studentId === activeStudentId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Beasiswa Saya"
        description="Pantau seluruh pengajuan beasiswa Anda, status verifikasi kampus, hingga persetujuan akhir donatur."
      />

      {myApps.length === 0 ? (
        <EmptyState
          title="Belum Ada Pengajuan Beasiswa"
          description="Anda belum mengajukan pendaftaran pada program mana pun."
          icon={GraduationCap}
          action={
            <Link
              href="/student/programs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
            >
              Cari Beasiswa
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {myApps.map((app) => {
            const prog = programs.find((p) => p.id === app.programId);
            const donor = donors.find((d) => d.id === prog?.donorId);

            return (
              <div
                key={app.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={app.status} />
                    <span className="text-slate-400">Diajukan: {app.submittedAt}</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{prog?.title}</h2>
                  <p className="text-slate-500">
                    {donor?.name} • Bantuan:{' '}
                    <strong className="text-blue-700">
                      {formatRupiah(prog?.amountPerRecipient || 0)}
                    </strong>
                  </p>
                  {app.campusNote && (
                    <p className="text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                      Catatan Kampus: {app.campusNote}
                    </p>
                  )}
                </div>

                <Link
                  href={`/student/applications/${app.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0"
                >
                  <span>Detail & Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
