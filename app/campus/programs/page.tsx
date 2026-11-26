'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import { Building2, Calendar } from 'lucide-react';

export default function CampusProgramsPage() {
  const { programs, donors, applications, activeCampusId, formatRupiah } = useMockApp();

  const eligiblePrograms = programs.filter(
    (p) =>
      p.status !== 'Draft' &&
      (p.targetCampusIds.includes('ALL') || p.targetCampusIds.includes(activeCampusId))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Program Beasiswa Mitra"
        description="Daftar program beasiswa yang menerima pendaftaran dari mahasiswa perguruan tinggi Anda."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {eligiblePrograms.map((prog) => {
          const donor = donors.find((d) => d.id === prog.donorId);
          const campusAppCount = applications.filter(
            (a) => a.programId === prog.id && a.campusId === activeCampusId
          ).length;

          return (
            <div
              key={prog.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                  {prog.category}
                </span>
                <StatusBadge status={prog.status} />
              </div>

              <div>
                <h2 className="text-base font-bold text-slate-900">{prog.title}</h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {donor?.name}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block">Nominal</span>
                  <strong className="text-blue-700">
                    {formatRupiah(prog.amountPerRecipient)}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Kuota Total</span>
                  <strong>{prog.quota} Mahasiswa</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Pendaftar Kampus</span>
                  <strong>{campusAppCount} Orang</strong>
                </div>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Periode: {prog.openDate} s/d {prog.closeDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
