'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useMockApp } from '@/context/MockAppContext';
import { ADMIN_WALLET } from '@/data/mockStore';
import {
  getConfiguredContractAddress,
  setConfiguredContractAddress,
  SEPOLIA_EXPLORER_URL,
} from '@/lib/sepolia';
import PageHeader from '@/components/layout/PageHeader';
import WalletAddress from '@/components/common/WalletAddress';
import { ShieldCheck, Save, ExternalLink } from 'lucide-react';

export default function AdminSettingsPage() {
  const { notify } = useMockApp();
  const [contractAddr, setContractAddr] = useState('');

  useEffect(() => {
    setContractAddr(getConfiguredContractAddress());
  }, []);

  const handleSaveContract = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = contractAddr.trim();
    if (trimmed && !ethers.isAddress(trimmed)) {
      notify({
        type: 'error',
        title: 'Alamat Contract Tidak Valid',
        description: 'Masukkan alamat contract Ethereum Sepolia (0x...) yang valid.',
      });
      return;
    }
    setConfiguredContractAddress(trimmed);
    notify({
      type: 'success',
      title: 'Konfigurasi Sepolia Tersimpan',
      description: trimmed
        ? `Smart contract diarahkan ke ${trimmed} pada jaringan Sepolia.`
        : 'Alamat contract dikosongkan.',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Platform & Jaringan Sepolia"
        description="Konfigurasi otoritas admin dan alamat Smart Contract pada jaringan Ethereum Sepolia Testnet."
        badge="Sepolia Testnet"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            <span>Identitas Otoritas Admin</span>
          </div>
          <div className="text-xs space-y-2.5 text-slate-600">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span>Instansi Pengawas</span>
              <strong className="text-slate-900">Kementerian Pendidikan Tinggi</strong>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 items-center">
              <span>Wallet Admin Terdaftar</span>
              <WalletAddress address={ADMIN_WALLET} />
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span>Jaringan Blockchain</span>
              <strong className="text-blue-700">Ethereum Sepolia (Chain ID: 11155111)</strong>
            </div>
            <div className="flex justify-between py-2">
              <span>Hak Akses Escrow</span>
              <span className="font-semibold text-rose-600">
                Read-Only (Tidak dapat menarik dana)
              </span>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSaveContract}
          className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 text-xs"
        >
          <h3 className="font-bold text-slate-900 text-sm">
            Alamat Smart Contract Sepolia (contract.sol)
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Setelah men-deploy <code className="bg-slate-100 px-1 py-0.5 rounded">contracts/contract.sol</code> ke jaringan Sepolia (misal via Remix IDE atau Hardhat), tempelkan alamat kontrak di bawah ini agar seluruh transaksi escrow terhubung ke kontrak Anda.
          </p>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Contract Address (0x...)
            </label>
            <input
              type="text"
              value={contractAddr}
              onChange={(e) => setContractAddr(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Alamat Contract</span>
            </button>

            {contractAddr && ethers.isAddress(contractAddr) && (
              <a
                href={`${SEPOLIA_EXPLORER_URL}/address/${contractAddr}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
              >
                <span>Lihat di Sepolia Etherscan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
