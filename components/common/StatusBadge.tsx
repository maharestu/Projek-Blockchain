import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<string, string> = {
  // Program & General
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  'Menunggu Verifikasi': 'bg-amber-50 text-amber-800 border-amber-200',
  Dibuka: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Seleksi: 'bg-blue-50 text-blue-700 border-blue-200',
  Aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Selesai: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Dibatalkan: 'bg-rose-50 text-rose-700 border-rose-200',
  Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
  Nonaktif: 'bg-slate-100 text-slate-600 border-slate-300',

  // Application
  Diajukan: 'bg-sky-50 text-sky-700 border-sky-200',
  'Diverifikasi Kampus': 'bg-teal-50 text-teal-700 border-teal-200',
  'Perlu Perbaikan': 'bg-amber-50 text-amber-800 border-amber-300',
  'Ditolak Kampus': 'bg-rose-50 text-rose-700 border-rose-200',
  'Direkomendasikan ke Donatur': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Menunggu Persetujuan Donatur': 'bg-purple-50 text-purple-700 border-purple-200',
  'Disetujui Donatur': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Disetujui: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Ditolak Donatur': 'bg-rose-50 text-rose-700 border-rose-200',

  // Cancellation
  'Menunggu Admin': 'bg-amber-50 text-amber-800 border-amber-200',

  // Transaction
  'Berhasil (Simulasi)': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style =
    STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  const sizeClass =
    size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap ${style} ${sizeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {status}
    </span>
  );
}
