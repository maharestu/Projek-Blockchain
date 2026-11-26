'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';
import { Search, Info } from 'lucide-react';

export default function AdminStudentsPage() {
  const { students, campuses } = useMockApp();
  const [query, setQuery] = useState('');

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.nim.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pemantauan Mahasiswa Terdaftar"
        description="Daftar mahasiswa yang didaftarkan oleh masing-masing kampus mitra."
      />

      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <span>
          Sesuai aturan bisnis, Admin Kementerian memantau data agregat mahasiswa terdaftar namun <strong>tidak perlu memverifikasi mahasiswa satu per satu</strong>. Verifikasi mahasiswa menjadi wewenang kampus masing-masing.
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama atau NIM mahasiswa..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Nama & Prodi</th>
              <th className="py-3.5 px-4">NIM</th>
              <th className="py-3.5 px-4">Kampus</th>
              <th className="py-3.5 px-4">Wallet</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Tanggal Terdaftar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.map((s) => {
              const campus = campuses.find((c) => c.id === s.campusId);
              return (
                <tr key={s.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{s.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {s.degree} {s.major} • IPK {s.gpa}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{s.nim}</td>
                  <td className="py-3.5 px-4 text-slate-700">{campus?.name || s.campusId}</td>
                  <td className="py-3.5 px-4">
                    <WalletAddress address={s.walletAddress} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{s.registeredAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
