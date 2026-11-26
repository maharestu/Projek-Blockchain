'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMockApp } from '@/context/MockAppContext';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import { Building2, Calendar, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

export default function ScholarshipSection() {
  const { programs, donors, campuses, formatRupiah } = useMockApp();
  const [activeFilter, setActiveFilter] = useState<'semua' | 'Dibuka' | 'Seleksi'>('semua');

  const publicPrograms = programs.filter((p) => p.status !== 'Draft');
  const filteredScholarships = publicPrograms.filter((item) => {
    if (activeFilter === 'semua') return true;
    return item.status === activeFilter;
  });

  return (
    <section id="program" className="py-20 md:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Unggulan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pilihan Program Beasiswa Terbuka
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Jelajahi program bantuan pendidikan dari kementerian dan lembaga donor mitra resmi yang telah diverifikasi.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-end">
            <button
              onClick={() => setActiveFilter('semua')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeFilter === 'semua'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({publicPrograms.length})
            </button>
            <button
              onClick={() => setActiveFilter('Dibuka')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeFilter === 'Dibuka'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dibuka
            </button>
            <button
              onClick={() => setActiveFilter('Seleksi')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeFilter === 'Seleksi'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Seleksi
            </button>
          </div>
        </div>

        {filteredScholarships.length === 0 ? (
          <EmptyState
            title="Belum Ada Program Beasiswa Terdaftar"
            description="Program beasiswa yang telah dibuat oleh Donatur dan diverifikasi oleh Admin akan tampil di sini."
            icon={GraduationCap}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredScholarships.slice(0, 4).map((prog) => {
              const donor = donors.find((d) => d.id === prog.donorId);
              const targetLabel = prog.targetCampusIds.includes('ALL')
                ? 'Seluruh Kampus Mitra'
                : prog.targetCampusIds
                    .map((id) => campuses.find((c) => c.id === id)?.name || id)
                    .join(', ');

              return (
                <div
                  key={prog.id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-5 pb-3 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-slate-500 truncate">
                        {prog.category}
                      </span>
                      <StatusBadge status={prog.status} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {prog.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{donor?.name || 'Penyelenggara Resmi'}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Besaran Bantuan
                      </span>
                      <div className="text-lg font-extrabold text-blue-700 mt-0.5">
                        {formatRupiah(prog.amountPerRecipient)}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{targetLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Batas: {prog.closeDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-3 border-t border-slate-100 mt-2 bg-slate-50/50">
                    <Link
                      href={`/program/${prog.id}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-200 font-semibold text-xs transition-all"
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

        <div className="mt-12 text-center p-8 rounded-2xl bg-blue-50/70 border border-blue-200/80 max-w-3xl mx-auto space-y-3">
          <h4 className="font-bold text-slate-900 text-base">
            Ingin Mengajukan Pendaftaran Beasiswa?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Masuk dengan dompet MetaMask Anda untuk melihat program yang sesuai kampus Anda dan mengajukan pendaftaran.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs transition"
            >
              <span>Lihat Semua Program</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <span>Masuk dengan MetaMask</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
