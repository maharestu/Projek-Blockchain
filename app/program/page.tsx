'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { Search, Building2, Calendar, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function PublicProgramsPage() {
  const { programs, donors, campuses, formatRupiah } = useMockApp();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');

  const visiblePrograms = programs.filter((p) => {
    if (p.status === 'Draft') return false;
    const matchQuery =
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === 'semua' || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katalog Beasiswa Terbuka</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Daftar Program Beasiswa
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Temukan program beasiswa terverifikasi dari kementerian dan yayasan donatur mitra. Data di bawah ini terhubung dengan state simulasi prototipe.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama program atau kategori..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="semua">Semua Status</option>
            <option value="Dibuka">Dibuka</option>
            <option value="Seleksi">Seleksi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>

        {visiblePrograms.length === 0 ? (
          <EmptyState
            title="Program Tidak Ditemukan"
            description="Tidak ada program beasiswa yang sesuai dengan kata kunci atau filter status Anda."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePrograms.map((prog) => {
              const donor = donors.find((d) => d.id === prog.donorId);
              const campusNames = prog.targetCampusIds.includes('ALL')
                ? 'Seluruh Kampus Mitra'
                : prog.targetCampusIds
                    .map((id) => campuses.find((c) => c.id === id)?.name || id)
                    .join(', ');

              return (
                <div
                  key={prog.id}
                  className="rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.status} />
                    </div>

                    <div>
                      <h2 className="font-bold text-slate-900 text-lg leading-snug">
                        {prog.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{donor?.name || 'Penyelenggara Resmi'}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Bantuan per Penerima
                        </span>
                        <span className="text-base font-extrabold text-blue-700">
                          {formatRupiah(prog.amountPerRecipient)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Kuota
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {prog.quota} Mahasiswa
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Sasaran: {campusNames}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Tutup Pendaftaran: {prog.closeDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <Link
                      href={`/program/${prog.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 text-xs font-bold transition"
                    >
                      <span>Lihat Detail Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
