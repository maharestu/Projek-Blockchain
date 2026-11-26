'use client';

import React from 'react';
import { X, ExternalLink, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface MetaMaskGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MetaMaskGuideModal({ isOpen, onClose }: MetaMaskGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden z-10 p-6 space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
              🦊
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Panduan Penggunaan MetaMask
              </h3>
              <p className="text-xs text-slate-500">
                Dompet Web3 gratis untuk identitas digital Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <strong className="text-slate-800 block">Pasang Ekstensi Browser</strong>
              <p className="mt-0.5">
                Unduh ekstensi resmi MetaMask dari situs resmi untuk browser Chrome, Firefox, Edge, atau Brave.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <div>
              <strong className="text-slate-800 block">Buat Dompet Baru</strong>
              <p className="mt-0.5">
                Ikuti instruksi pembuatan kata sandi. Simpan 12 kata pemulihan (Secret Phrase) Anda di tempat aman offline.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <strong className="text-slate-800 block">Klik &apos;Hubungkan MetaMask&apos;</strong>
              <p className="mt-0.5">
                Kembali ke halaman ini dan tekan tombol Hubungkan. Tidak ada saldo kripto atau biaya yang dibutuhkan untuk login.
              </p>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            <strong>Penting:</strong> EduChain tidak pernah meminta seed phrase atau private key Anda. Login wallet bersifat off-chain tanpa transaksi berbayar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Unduh MetaMask Resmi</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
