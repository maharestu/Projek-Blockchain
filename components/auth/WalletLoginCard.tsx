'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';
import MetaMaskGuideModal from './MetaMaskGuideModal';
import { useMockApp } from '@/context/MockAppContext';
import { ensureSepoliaNetwork } from '@/lib/sepolia';

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

type AuthStep = 'connect' | 'result';

export default function WalletLoginCard() {
  const router = useRouter();
  const { loginByWallet } = useMockApp();

  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<AuthStep>('connect');
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    role?: string;
    reason?: 'unregistered' | 'inactive';
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const processConnectedAccount = useCallback(
    (selectedAddress: string) => {
      setAccount(selectedAddress);
      const res = loginByWallet(selectedAddress);
      setAuthResult(res);
      setCurrentStep('result');

      if (res.success && res.role) {
        setTimeout(() => {
          router.push(`/${res.role}`);
        }, 800);
      }
    },
    [loginByWallet, router]
  );

  useEffect(() => {
    const ethereum = typeof window !== 'undefined' ? window.ethereum : undefined;
    setHasProvider(Boolean(ethereum));

    if (!ethereum?.on) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const list = accounts as string[];
      if (list && list.length > 0) {
        processConnectedAccount(list[0]);
      } else {
        setAccount(null);
        setAuthResult(null);
        setCurrentStep('connect');
      }
    };

    ethereum.on('accountsChanged', handleAccountsChanged);
    return () => {
      ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, [processConnectedAccount]);

  const truncateAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Hubungkan / Pilih Akun langsung lewat Extension MetaMask
  const handleConnectWallet = async (forceAccountPicker = false) => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        setErrorMessage(
          'Ekstensi MetaMask tidak terdeteksi di browser Anda. Silakan pasang ekstensi MetaMask terlebih dahulu.'
        );
        return;
      }

      await ensureSepoliaNetwork();

      if (forceAccountPicker) {
        try {
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }],
          });
        } catch (permErr: unknown) {
          const errObj = permErr as { code?: number };
          if (errObj?.code === 4001) throw permErr;
          // Lanjut ke eth_requestAccounts jika wallet_requestPermissions tidak didukung
        }
      }

      const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts && accounts.length > 0) {
        processConnectedAccount(accounts[0]);
      } else {
        setErrorMessage('Tidak ada akun MetaMask yang dipilih.');
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: number; message?: string };
      if (errorObj?.code === 4001) {
        setErrorMessage('Koneksi dibatalkan: Anda menolak pemilihan akun di MetaMask.');
      } else {
        setErrorMessage(errorObj?.message || 'Gagal menghubungkan ke dompet MetaMask.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 p-6 sm:p-8 space-y-6">
        {/* Header Kartu */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
            <Wallet className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Masuk ke Akun Anda
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Pilih akun dompet langsung melalui ekstensi MetaMask Anda. Role akan terdeteksi otomatis sesuai wallet yang terdaftar.
          </p>
        </div>

        {/* Status Steps (2 Langkah) */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div
            className={`p-2.5 rounded-xl border ${
              currentStep === 'connect'
                ? 'bg-blue-50 border-blue-300 font-bold text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold'
            }`}
          >
            1. Pilih Akun di MetaMask
          </div>
          <div
            className={`p-2.5 rounded-xl border ${
              currentStep === 'result' && authResult?.success
                ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-800'
                : currentStep === 'result'
                ? 'bg-amber-50 border-amber-300 font-bold text-amber-800'
                : 'bg-slate-50 border-slate-100 text-slate-400'
            }`}
          >
            2. Akses Dashboard
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Gagal:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {hasProvider === false && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Ekstensi MetaMask Belum Terdeteksi</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Pasang dan aktifkan ekstensi MetaMask di browser Anda untuk memilih wallet dan masuk ke sistem.
            </p>
          </div>
        )}

        {currentStep === 'connect' && (
          <div className="space-y-4">
            <button
              onClick={() => handleConnectWallet(true)}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition cursor-pointer disabled:opacity-70"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memilih Akun di MetaMask...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Hubungkan MetaMask</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-medium cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Belum punya MetaMask? Lihat panduan</span>
              </button>
            </div>
          </div>
        )}

        {currentStep === 'result' && account && authResult && (
          <div className="space-y-4">
            {/* Info Wallet Terhubung */}
            <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-medium">Wallet Terpilih:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900">
                  {truncateAddress(account)}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Salin alamat"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {authResult.success && authResult.role ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Berhasil Terhubung
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Role terdeteksi: <strong className="uppercase">{authResult.role}</strong>. Mengarahkan ke dashboard...
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => handleConnectWallet(true)}
                    className="px-4 py-2 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-semibold cursor-pointer"
                  >
                    Ganti Akun di MetaMask
                  </button>
                  <button
                    onClick={() => router.push(`/${authResult.role}`)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
                <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
                <div>
                  <h3 className="font-bold text-amber-950 text-base">
                    {authResult.reason === 'inactive'
                      ? 'Akun Dinonaktifkan'
                      : 'Wallet Belum Terdaftar'}
                  </h3>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    {authResult.reason === 'inactive'
                      ? 'Akun institusi atau mahasiswa yang terhubung dengan wallet ini berstatus Nonaktif dan tidak dapat mengakses sistem.'
                      : 'Alamat wallet ini belum terdaftar pada akun Admin, Kampus, Donatur, maupun Mahasiswa. Silakan pilih akun lain di ekstensi MetaMask Anda.'}
                  </p>
                </div>
                <button
                  onClick={() => handleConnectWallet(true)}
                  disabled={isConnecting}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold cursor-pointer disabled:opacity-70"
                >
                  Pilih Akun Lain di MetaMask
                </button>
              </div>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Tanpa Gas Fee • Tidak Pernah Meminta Seed Phrase / Private Key</span>
        </div>
      </div>

      <MetaMaskGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
