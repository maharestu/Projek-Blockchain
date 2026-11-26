'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { Donor } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plus, Eye, Power, X } from 'lucide-react';

export default function AdminDonorsPage() {
  const { donors, programs, formatRupiah, addDonor, toggleDonorStatus } = useMockApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [detailDonor, setDetailDonor] = useState<Donor | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Donor | null>(null);

  const [form, setForm] = useState({
    name: '',
    organizationType: 'Yayasan' as Donor['organizationType'],
    walletAddress: '',
    email: '',
    phone: '',
    supportingInfo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.walletAddress || !form.email) return;
    addDonor(form);
    setForm({
      name: '',
      organizationType: 'Yayasan',
      walletAddress: '',
      email: '',
      phone: '',
      supportingInfo: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Akun Donatur & Yayasan"
        description="Kelola organisasi penyelenggara beasiswa yang diizinkan membuat program dan menyetor dana escrow."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Donatur</span>
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Nama Yayasan / Donatur</th>
              <th className="py-3.5 px-4">Wallet</th>
              <th className="py-3.5 px-4">Kontak</th>
              <th className="py-3.5 px-4">Program & Total Dana</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {donors.map((d) => {
              const donorPrograms = programs.filter((p) => p.donorId === d.id);
              const totalFunds = donorPrograms.reduce((acc, p) => acc + p.totalBudget, 0);

              return (
                <tr key={d.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{d.name}</p>
                    <p className="text-[11px] text-slate-500">{d.organizationType}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <WalletAddress address={d.walletAddress} />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-700">{d.email}</p>
                    <p className="text-[11px] text-slate-400">{d.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{donorPrograms.length} Program</p>
                    <p className="text-[11px] text-blue-700 font-semibold">
                      {formatRupiah(totalFunds)}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailDonor(d)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => setConfirmTarget(d)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                          d.status === 'Aktif'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{d.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Donatur */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Tambah Akun Donatur / Yayasan</h3>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Organisasi / Yayasan *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Yayasan Cerdas Bangsa"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenis Organisasi</label>
                <select
                  value={form.organizationType}
                  onChange={(e) =>
                    setForm({ ...form, organizationType: e.target.value as Donor['organizationType'] })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
                >
                  <option value="Yayasan">Yayasan</option>
                  <option value="Korporasi / BUMN">Korporasi / BUMN</option>
                  <option value="Kementerian">Kementerian</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alamat Wallet *</label>
                <input
                  required
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  placeholder="0x..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Kontak *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Telepon</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Informasi Pendukung / Legalitas
                </label>
                <textarea
                  rows={2}
                  value={form.supportingInfo}
                  onChange={(e) => setForm({ ...form, supportingInfo: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold cursor-pointer"
              >
                Simpan Donatur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detail Donatur */}
      {detailDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setDetailDonor(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <StatusBadge status={detailDonor.status} />
                <h3 className="font-bold text-slate-900 text-lg mt-2">{detailDonor.name}</h3>
                <p className="text-slate-500">{detailDonor.organizationType}</p>
              </div>
              <button onClick={() => setDetailDonor(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Wallet:</span>
                <WalletAddress address={detailDonor.walletAddress} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold">{detailDonor.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Terdaftar:</span>
                <span>{detailDonor.registeredAt}</span>
              </div>
            </div>
            {detailDonor.supportingInfo && (
              <p className="text-slate-600 bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                <strong>Legalitas:</strong> {detailDonor.supportingInfo}
              </p>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmTarget)}
        title={
          confirmTarget?.status === 'Aktif'
            ? `Nonaktifkan ${confirmTarget?.name}?`
            : `Aktifkan ${confirmTarget?.name}?`
        }
        description={
          confirmTarget?.status === 'Aktif'
            ? 'Donatur nonaktif tidak dapat membuat program baru atau menyetujui calon penerima.'
            : 'Donatur akan kembali memiliki akses portal penyaluran beasiswa.'
        }
        confirmLabel={confirmTarget?.status === 'Aktif' ? 'Ya, Nonaktifkan' : 'Aktifkan'}
        variant={confirmTarget?.status === 'Aktif' ? 'danger' : 'primary'}
        requireReason
        onConfirm={(reason) => {
          if (confirmTarget) toggleDonorStatus(confirmTarget.id, reason);
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
