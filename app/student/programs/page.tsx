'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { Search, Building2, Calendar, ArrowRight, Ban } from 'lucide-react';

export default function StudentProgramsPage() {
  const { programs, donors, students, activeStudentId, formatRupiah } = useMockApp();
  const student = students.find((s) => s.id === activeStudentId);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  const visiblePrograms = programs.filter((p) => {
    if (p.status === 'Draft' || p.status === 'Menunggu Verifikasi') return false;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === 'semua' || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cari Program Beasiswa"
        description="Hanya program yang dibuka dan menerima mahasiswa dari kampus Anda yang dapat diajukan."
      />

      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama program atau kategori..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs bg-white"
        >
          <option value="semua">Semua Status</option>
          <option value="Dibuka">Dibuka</option>
          <option value="Seleksi">Seleksi</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      {visiblePrograms.length === 0 ? (
        <EmptyState
          title="Program Tidak Ditemukan"
          description="Coba ubah kata kunci pencarian atau filter status."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePrograms.map((prog) => {
            const donor = donors.find((d) => d.id === prog.donorId);
            const campusEligible =
              prog.targetCampusIds.includes('ALL') ||
              (student && prog.targetCampusIds.includes(student.campusId));

            return (
              <div
                key={prog.id}
                className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {prog.category}
                    </span>
                    <StatusBadge status={prog.status} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900 text-base leading-snug">
                      {prog.title}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {donor?.name}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 block">Bantuan</span>
                      <strong className="text-blue-700 text-sm">
                        {formatRupiah(prog.amountPerRecipient)}
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Kuota</span>
                      <strong>{prog.quota} Org</strong>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tutup: {prog.closeDate}</span>
                  </div>

                  {!campusEligible && (
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-center gap-1.5">
                      <Ban className="w-3.5 h-3.5 shrink-0" />
                      <span>Tidak memenuhi cakupan kampus Anda</span>
                    </div>
                  )}
                </div>

                <Link
                  href={`/student/programs/${prog.id}`}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                    campusEligible
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span>{campusEligible ? 'Lihat Detail & Daftar' : 'Lihat Detail'}</span>
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
