import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  tone?: 'blue' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate';
}

const TONE_MAP = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone = 'blue',
}: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">{label}</p>
          <p className="text-2xl font-extrabold text-slate-900 tracking-tight truncate">
            {value}
          </p>
          {sublabel && (
            <p className="text-[11px] text-slate-400 truncate">{sublabel}</p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${TONE_MAP[tone]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
