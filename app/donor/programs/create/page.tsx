'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMockApp } from '@/context/MockAppContext';
import PageHeader from '@/components/layout/PageHeader';
import { ArrowLeft, ArrowRight, CheckCircle2, Save, Send } from 'lucide-react';

export default function DonorCreateProgramPage() {
  const router = useRouter();
  const { campuses, donors, activeDonorId, createProgram, formatRupiah } = useMockApp();
  const donor = donors.find((d) => d.id === activeDonorId);

  const [step, setStep] = useState(1);
  const [allCampuses, setAllCampuses] = useState(true);
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Prestasi Akademik',
    targetDegree: 'S1 / D4',
    criteria: 'Mahasiswa aktif dengan IPK minimal 3.25',
    quota: 5,
    amountPerRecipient: 10000000,
    assetSymbol: 'IDRX (Placeholder)',
    openDate: '2026-12-01',
    closeDate: '2027-01-15',
    selectionDate: '2027-01-20',
    announcementDate: '2027-01-30',
    scholarshipPeriod: 'Semester Genap 2026/2027',
    requirementsText: 'Mahasiswa aktif terdaftar di kampus mitra\nIPK minimal 3.25 skala 4.00',
    documentsText: 'Transkrip Nilai Resmi\nSurat Keterangan Aktif Kuliah\nEsai Motivasi',
  });

  const totalBudget = form.quota * form.amountPerRecipient;

  const toggleCampus = (id: string) => {
    setSelectedCampuses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = (asDraft: boolean) => {
    const targetIds = allCampuses
      ? ['ALL']
      : selectedCampuses.length > 0
      ? selectedCampuses
      : ['ALL'];

    createProgram({
      title: form.title || 'Program Beasiswa Baru',
      description: form.description || 'Deskripsi program beasiswa.',
      category: form.category,
      targetCampusIds: targetIds,
      targetDegree: form.targetDegree,
      criteria: form.criteria,
      quota: Number(form.quota),
      amountPerRecipient: Number(form.amountPerRecipient),
      totalBudget,
      assetSymbol: form.assetSymbol,
      openDate: form.openDate,
      closeDate: form.closeDate,
      selectionDate: form.selectionDate,
      announcementDate: form.announcementDate,
      scholarshipPeriod: form.scholarshipPeriod,
      requirements: form.requirementsText.split('\n').filter(Boolean),
      requiredDocuments: form.documentsText.split('\n').filter(Boolean),
      status: asDraft ? 'Draft' : 'Menunggu Verifikasi',
    });

    router.push('/donor/programs');
  };

  const steps = [
    '1. Informasi Umum',
    '2. Sasaran',
    '3. Pendanaan',
    '4. Jadwal',
    '5. Persyaratan',
    '6. Ringkasan',
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Buat Program Beasiswa Baru"
        description="Isi rancangan program secara bertahap. Program baru tidak akan menerima pendaftaran sebelum diverifikasi Admin dan dibuka sesuai jadwal."
      />

      {/* Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
        {steps.map((label, idx) => {
          const num = idx + 1;
          return (
            <button
              key={label}
              type="button"
              onClick={() => setStep(num)}
              className={`p-2.5 rounded-xl border text-[11px] font-bold text-left transition cursor-pointer ${
                step === num
                  ? 'bg-blue-600 text-white border-blue-600'
                  : step > num
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-white text-slate-500 border-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 text-xs">
        {/* Step 1: Informasi Umum */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">1. Informasi Umum Program</h2>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Penyelenggara</label>
              <input
                disabled
                value={donor?.name || ''}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-600"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nama Program *</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Contoh: Beasiswa Inovasi Muda 2027"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 bg-white"
              >
                <option value="Prestasi Akademik">Prestasi Akademik</option>
                <option value="Teknologi & STEM">Teknologi & STEM</option>
                <option value="Bantuan Ekonomi">Bantuan Ekonomi</option>
                <option value="Riset Terapan">Riset Terapan</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Deskripsi Program</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Jelaskan tujuan, cakupan bantuan, dan manfaat program..."
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
          </div>
        )}

        {/* Step 2: Sasaran */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">2. Sasaran & Kuota Penerima</h2>
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">
                Kampus yang Boleh Mengikuti
              </label>
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allCampuses}
                  onChange={(e) => setAllCampuses(e.target.checked)}
                />
                <span className="font-semibold text-slate-800">
                  Semua Kampus Mitra Terdaftar
                </span>
              </label>
              {!allCampuses && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {campuses.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCampuses.includes(c.id)}
                        onChange={() => toggleCampus(c.id)}
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jenjang Sasaran</label>
                <input
                  value={form.targetDegree}
                  onChange={(e) => setForm({ ...form, targetDegree: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kuota Penerima</label>
                <input
                  type="number"
                  min={1}
                  value={form.quota}
                  onChange={(e) => setForm({ ...form, quota: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Kriteria Utama</label>
              <input
                value={form.criteria}
                onChange={(e) => setForm({ ...form, criteria: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
          </div>
        )}

        {/* Step 3: Pendanaan */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">3. Rancangan Pendanaan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nominal Bantuan per Penerima (IDR)
                </label>
                <input
                  type="number"
                  min={100000}
                  step={500000}
                  value={form.amountPerRecipient}
                  onChange={(e) =>
                    setForm({ ...form, amountPerRecipient: Number(e.target.value) })
                  }
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Aset / Token (Placeholder)
                </label>
                <input
                  value={form.assetSymbol}
                  onChange={(e) => setForm({ ...form, assetSymbol: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
            </div>
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-slate-600 block">Estimasi Total Anggaran Program:</span>
              <strong className="text-xl font-extrabold text-blue-700">
                {formatRupiah(totalBudget)}
              </strong>
              <span className="block text-[11px] text-slate-500 mt-0.5">
                ({form.quota} penerima × {formatRupiah(form.amountPerRecipient)})
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Jadwal */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">4. Jadwal Pelaksanaan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pembukaan</label>
                <input
                  type="date"
                  value={form.openDate}
                  onChange={(e) => setForm({ ...form, openDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Penutupan</label>
                <input
                  type="date"
                  value={form.closeDate}
                  onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tahap Seleksi</label>
                <input
                  type="date"
                  value={form.selectionDate}
                  onChange={(e) => setForm({ ...form, selectionDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pengumuman</label>
                <input
                  type="date"
                  value={form.announcementDate}
                  onChange={(e) => setForm({ ...form, announcementDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Periode Beasiswa</label>
              <input
                value={form.scholarshipPeriod}
                onChange={(e) => setForm({ ...form, scholarshipPeriod: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
          </div>
        )}

        {/* Step 5: Persyaratan */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">5. Persyaratan & Dokumen</h2>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Daftar Kriteria Wajib (satu per baris)
              </label>
              <textarea
                rows={4}
                value={form.requirementsText}
                onChange={(e) => setForm({ ...form, requirementsText: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Dokumen Wajib Diunggah Mahasiswa (satu per baris)
              </label>
              <textarea
                rows={4}
                value={form.documentsText}
                onChange={(e) => setForm({ ...form, documentsText: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
              />
            </div>
          </div>
        )}

        {/* Step 6: Ringkasan */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">6. Ringkasan Program</h2>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Judul Program</span>
                <strong className="text-slate-900">{form.title || '(Belum diisi)'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kategori & Jenjang</span>
                <strong>
                  {form.category} • {form.targetDegree}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kuota & Bantuan</span>
                <strong>
                  {form.quota} × {formatRupiah(form.amountPerRecipient)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Anggaran</span>
                <strong className="text-blue-700">{formatRupiah(totalBudget)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jadwal Pendaftaran</span>
                <strong>
                  {form.openDate} s/d {form.closeDate}
                </strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Program yang diajukan akan masuk ke antrean verifikasi Admin/Kementerian sebelum dibuka untuk pendaftaran mahasiswa.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-700 disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(6, s + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave(false)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Ajukan Verifikasi</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
