'use client';

import React, { useState } from 'react';
import { useMockApp } from '@/context/MockAppContext';
import { Student } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';
import WalletAddress from '@/components/common/WalletAddress';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { Plus, Power, Eye, X, ShieldAlert } from 'lucide-react';

export default function CampusStudentsPage() {
  const { students, activeCampusId, addStudent, toggleStudentStatus } = useMockApp();

  const [showAdd, setShowAdd] = useState(false);
  const [detailTarget, setDetailTarget] = useState<Student | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<Student | null>(null);

  const [form, setForm] = useState({
    name: '',
    nim: '',
    major: '',
    degree: 'S1' as Student['degree'],
    semester: 3,
    gpa: 3.5,
    email: '',
    walletAddress: '',
  });

  const myStudents = students.filter((s) => s.campusId === activeCampusId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.nim || !form.walletAddress) return;
    addStudent({
      ...form,
      campusId: activeCampusId,
    });
    setForm({
      name: '',
      nim: '',
      major: '',
      degree: 'S1',
      semester: 3,
      gpa: 3.5,
      email: '',
      walletAddress: '',
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mahasiswa Terdaftar Kampus"
        description="Daftarkan alamat wallet mahasiswa aktif kampus Anda agar dapat masuk dengan MetaMask dan mengajukan beasiswa."
        actions={
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mahasiswa</span>
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
              <th className="py-3.5 px-4">Nama & Prodi</th>
              <th className="py-3.5 px-4">NIM</th>
              <th className="py-3.5 px-4">IPK / Sem</th>
              <th className="py-3.5 px-4">Wallet Mahasiswa</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myStudents.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70">
                <td className="py-3.5 px-4">
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {s.degree} {s.major}
                  </p>
                </td>
                <td className="py-3.5 px-4 font-mono">{s.nim}</td>
                <td className="py-3.5 px-4">
                  IPK <strong>{s.gpa}</strong> • Sem {s.semester}
                </td>
                <td className="py-3.5 px-4">
                  <WalletAddress address={s.walletAddress} />
                </td>
                <td className="py-3.5 px-4">
                  <StatusBadge status={s.status} />
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setDetailTarget(s)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                    <button
                      onClick={() => setConfirmTarget(s)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer ${
                        s.status === 'Aktif'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{s.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Mahasiswa */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setShowAdd(false)} />
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Daftarkan Mahasiswa Baru</h3>
              <button type="button" onClick={() => setShowAdd(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Pastikan alamat wallet publik mahasiswa benar. <strong>Jangan pernah meminta Private Key atau Seed Phrase</strong> milik mahasiswa.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold block mb-1">Nama Lengkap *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">NIM *</label>
                <input
                  required
                  value={form.nim}
                  onChange={(e) => setForm({ ...form, nim: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Program Studi *</label>
                <input
                  required
                  value={form.major}
                  onChange={(e) => setForm({ ...form, major: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Jenjang</label>
                <select
                  value={form.degree}
                  onChange={(e) =>
                    setForm({ ...form, degree: e.target.value as Student['degree'] })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
                >
                  <option value="D3">D3</option>
                  <option value="D4">D4</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">IPK Terakhir</label>
                <input
                  type="number"
                  step="0.01"
                  max="4"
                  value={form.gpa}
                  onChange={(e) => setForm({ ...form, gpa: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Email Mahasiswa *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold block mb-1">
                  Alamat Wallet Publik (0x...) *
                </label>
                <input
                  required
                  value={form.walletAddress}
                  onChange={(e) => setForm({ ...form, walletAddress: e.target.value })}
                  placeholder="0x..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-semibold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold cursor-pointer"
              >
                Daftarkan Mahasiswa
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Detail Modal */}
      {detailTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setDetailTarget(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <StatusBadge status={detailTarget.status} />
                <h3 className="font-bold text-slate-900 text-lg mt-2">{detailTarget.name}</h3>
                <p className="text-slate-500">
                  NIM {detailTarget.nim} • {detailTarget.degree} {detailTarget.major}
                </p>
              </div>
              <button onClick={() => setDetailTarget(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <strong>{detailTarget.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IPK / Semester</span>
                <strong>
                  {detailTarget.gpa} / Sem {detailTarget.semester}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wallet</span>
                <WalletAddress address={detailTarget.walletAddress} />
              </div>
            </div>
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
        description="Mahasiswa berstatus Nonaktif tidak dapat masuk ke portal mahasiswa maupun mengajukan pendaftaran beasiswa."
        confirmLabel={confirmTarget?.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
        variant={confirmTarget?.status === 'Aktif' ? 'danger' : 'primary'}
        requireReason
        onConfirm={(reason) => {
          if (confirmTarget) toggleStudentStatus(confirmTarget.id, reason);
          setConfirmTarget(null);
        }}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}
