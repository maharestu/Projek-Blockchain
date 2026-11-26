'use client';

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'danger',
  requireReason = false,
  reasonPlaceholder = 'Tuliskan alasan atau catatan keputusan...',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError('Alasan wajib diisi sebelum melanjutkan.');
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setError('');
  };

  const btnStyle =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onCancel} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in duration-150"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-rose-100 text-rose-600'
                  : variant === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>

        {requireReason && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Alasan / Catatan Resmi <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder={reasonPlaceholder}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-[11px] text-rose-600">{error}</p>}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-xs cursor-pointer ${btnStyle}`}
          >
            {confirmLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
