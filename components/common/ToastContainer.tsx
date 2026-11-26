'use client';

import React from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useMockApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
        };
        const borderMap = {
          success: 'border-emerald-200 bg-white',
          error: 'border-rose-200 bg-white',
          warning: 'border-amber-200 bg-white',
          info: 'border-blue-200 bg-white',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border p-4 shadow-xl flex items-start gap-3 animate-in slide-in-from-right-4 fade-in duration-200 ${borderMap[toast.type]}`}
          >
            {iconMap[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900">{toast.title}</p>
              {toast.description && (
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
