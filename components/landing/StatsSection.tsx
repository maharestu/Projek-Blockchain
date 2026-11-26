'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { GraduationCap, Coins, Users, Building2 } from 'lucide-react';

export default function StatsSection() {
  const { programs, campuses, donors, students, formatRupiah } = useMockApp();

  const totalFunds = programs.reduce((acc, p) => acc + p.totalBudget, 0);
  const activePrograms = programs.filter((p) => p.status !== 'Draft').length;

  const stats = [
    {
      label: 'Program Tersedia',
      value: activePrograms,
      description: 'Program beasiswa terverifikasi dari institusi pemerintah dan yayasan.',
      icon: GraduationCap,
    },
    {
      label: 'Total Dana Komitmen',
      value: formatRupiah(totalFunds),
      description: 'Alokasi dana bantuan pendidikan yang tercatat di platform.',
      icon: Coins,
    },
    {
      label: 'Mahasiswa Terdaftar',
      value: students.length,
      description: 'Mahasiswa aktif dengan validasi akademik kampus terintegrasi.',
      icon: Users,
    },
    {
      label: 'Mitra Kampus & Yayasan',
      value: campuses.length + donors.length,
      description: 'Jejaring perguruan tinggi dan lembaga donor terverifikasi.',
      icon: Building2,
    },
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 truncate">
                  {item.value}
                </div>
                <div className="text-sm font-bold text-slate-700 mb-2">
                  {item.label}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
