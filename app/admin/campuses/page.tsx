'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { Campus } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import EmptyState from '@/components/common/EmptyState';
import { Plus, Eye, Power, X, Building2, AlertTriangle } from 'lucide-react';

export default function AdminCampusesPage() {
  const { campuses, students, programs, addCampus, toggleCampusStatus } = useMockApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [detailCampus, setDetailCampus] = useState<Campus | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Campus | null>(null);

  const [form, setForm] = useState({
    name: '',
    code: '',
    walletAddress: '',
    email: '',
    phone: '',
    city: '',
    supportingInfo: '',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code || !form.walletAddress || !form.email) return;
    addCampus(form);
    setForm({
      name: '',
      code: '',
      walletAddress: '',
      email: '',
      phone: '',
      city: '',
      supportingInfo: '',
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manajemen Akun Kampus"
        description="Kelola perguruan tinggi mitra yang berwenang mendaftarkan mahasiswa, memvalidasi dokumen akademik, dan menyalurkan dana beasiswa."
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Kampus</span>
          </button>
        }
      />

      {campuses.length === 0 ? (
        <EmptyState
          title="Belum Ada Kampus Terdaftar"
          description="Tambahkan akun perguruan tinggi pertama untuk memulai verifikasi mahasiswa."
          icon={Building2}
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Nama Kampus & Kode</th>
                <th className="py-3.5 px-4">Wallet Institusi</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal Registrasi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {campuses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {c.code} • {c.city}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <WalletAddress address={c.walletAddress} />
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-700">{c.email}</p>
                    <p className="text-[11px] text-slate-400">{c.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{c.registeredAt}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailCampus(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                      <button
                        onClick={() => setConfirmTarget(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                          c.status === 'Aktif'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{c.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah Kampus */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setShowAddModal(false)} />
          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Tambah Akun Kampus Baru</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Resmi Perguruan Tinggi *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Universitas Gadjah Mada"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Kode Institusi *
                </label>
                <input
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="UGM-003"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kota</label>
                <input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Yogyakarta"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Alamat Wallet Institusi *
                </label>
                <input
                  required
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  placeholder="0x..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Resmi *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="beasiswa@ugm.ac.id"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Telepon</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(0274) ..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">
                  Informasi Pendukung
                </label>
                <textarea
                  rows={2}
                  value={form.supportingInfo}
                  onChange={(e) => setForm({ ...form, supportingInfo: e.target.value })}
                  placeholder="Nomor SK akreditasi atau unit pengelola beasiswa..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                Simpan & Aktifkan Kampus
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Detail Kampus */}
      {detailCampus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setDetailCampus(null)} />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <StatusBadge status={detailCampus.status} />
                <h3 className="font-bold text-slate-900 text-lg mt-2">{detailCampus.name}</h3>
                <p className="text-xs text-slate-500">
                  Kode: {detailCampus.code} • Terdaftar: {detailCampus.registeredAt}
                </p>
              </div>
              <button
                onClick={() => setDetailCampus(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Wallet:</span>
                <WalletAddress address={detailCampus.walletAddress} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kontak:</span>
                <span className="font-semibold text-slate-800">{detailCampus.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mahasiswa Terdaftar:</span>
                <span className="font-bold text-blue-700">
                  {students.filter((s) => s.campusId === detailCampus.id).length} Mahasiswa
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Program Terkait:</span>
                <span className="font-bold text-slate-800">
                  {
                    programs.filter(
                      (p) =>
                        p.targetCampusIds.includes('ALL') ||
                        p.targetCampusIds.includes(detailCampus.id)
                    ).length
                  }{' '}
                  Program
                </span>
              </div>
            </div>

            {detailCampus.supportingInfo && (
              <p className="text-xs text-slate-600 bg-blue-50/60 border border-blue-100 rounded-xl p-3">
                <strong>Catatan Institusi:</strong> {detailCampus.supportingInfo}
              </p>
            )}

            {detailCampus.status === 'Nonaktif' && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Dampak Akun Nonaktif: Kampus ini tidak dapat login, memverifikasi dokumen mahasiswa, atau melakukan penyaluran dana baru hingga diaktifkan kembali.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialog Konfirmasi Aktif/Nonaktif */}
      <ConfirmDialog
        isOpen={Boolean(confirmTarget)}
        title={
          confirmTarget?.status === 'Aktif'
            ? `Nonaktifkan ${confirmTarget?.name}?`
            : `Aktifkan Kembali ${confirmTarget?.name}?`
        }
        description={
          confirmTarget?.status === 'Aktif'
            ? 'Dampak: Akun kampus tidak akan bisa login, memverifikasi mahasiswa, maupun menyalurkan dana beasiswa selama dinonaktifkan.'
            : 'Kampus akan kembali memiliki akses penuh untuk validasi mahasiswa dan penyaluran beasiswa.'
        }
        confirmLabel={confirmTarget?.status === 'Aktif' ? 'Ya, Nonaktifkan' : 'Aktifkan Kampus'}
        variant={confirmTarget?.status === 'Aktif' ? 'danger' : 'primary'}
        requireReason
        onConfirm={(reason) => {
          if (confirmTarget) toggleCampusStatus(confirmTarget.id, reason);
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
