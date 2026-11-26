'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  formatSepoliaEth,
  GAS_BUFFER_PER_TX,
  getConfiguredContractAddress,
  getSepoliaSigner,
  SCHOLARSHIP_CONTRACT_ABI,
} from '@/lib/sepolia';
import {
  UserRole,
  Campus,
  Donor,
  Student,
  ScholarshipProgram,
  ScholarshipApplication,
  MockTransaction,
  CancellationRequest,
  ActivityLog,
  ProgramStatus,
  StudentDocument,
} from '@/types';
import {
  ADMIN_WALLET,
  INITIAL_CAMPUSES,
  INITIAL_DONORS,
  INITIAL_STUDENTS,
  INITIAL_PROGRAMS,
  INITIAL_APPLICATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_CANCELLATION_REQUESTS,
  INITIAL_ACTIVITIES,
} from '@/data/mockStore';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface MockAppContextType {
  // State
  campuses: Campus[];
  donors: Donor[];
  students: Student[];
  programs: ScholarshipProgram[];
  applications: ScholarshipApplication[];
  transactions: MockTransaction[];
  cancellationRequests: CancellationRequest[];
  activities: ActivityLog[];
  toasts: ToastMessage[];

  // Active Demo Session
  currentRole: UserRole | null;
  activeWallet: string | null;
  activeCampusId: string;
  activeDonorId: string;
  activeStudentId: string;

  // Helpers
  formatRupiah: (amount: number) => string;
  notify: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;

  // Auth
  loginByWallet: (wallet: string) => {
    success: boolean;
    role?: UserRole;
    reason?: 'unregistered' | 'inactive';
  };
  logout: () => void;

  // Admin Actions
  addCampus: (campus: Omit<Campus, 'id' | 'registeredAt' | 'status'>) => void;
  toggleCampusStatus: (campusId: string, reason: string) => void;
  addDonor: (donor: Omit<Donor, 'id' | 'registeredAt' | 'status'>) => void;
  toggleDonorStatus: (donorId: string, reason: string) => void;
  verifyProgram: (programId: string, approved: boolean, reason?: string) => void;
  decideCancellation: (requestId: string, approved: boolean, reason: string) => void;

  // Donor Actions
  createProgram: (
    data: Omit<
      ScholarshipProgram,
      'id' | 'donorId' | 'escrowDeposited' | 'allocatedToCampus' | 'disbursedToStudents' | 'createdAt'
    >
  ) => void;
  submitProgramForVerification: (programId: string) => void;
  depositToEscrow: (programId: string, amount: number) => Promise<boolean>;
  decideRecipient: (applicationId: string, approved: boolean, note: string) => void;
  requestCancellation: (programId: string, reason: string) => void;
  settleRemainingFunds: (programId: string, action: 'refund' | 'transfer', note: string) => void;

  // Campus Actions
  addStudent: (student: Omit<Student, 'id' | 'registeredAt' | 'status'>) => void;
  toggleStudentStatus: (studentId: string, reason: string) => void;
  verifyApplication: (
    applicationId: string,
    decision: 'valid' | 'revision' | 'reject',
    checklist: ScholarshipApplication['checklist'],
    note: string
  ) => void;
  recommendRecipient: (applicationId: string, note: string) => void;
  disburseFunds: (applicationId: string, amount: number) => Promise<boolean>;

  // Student Actions
  submitApplication: (
    programId: string,
    essay: string,
    documents: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verified'>[]
  ) => boolean;
  reviseApplication: (
    applicationId: string,
    essay: string,
    documents: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verified'>[]
  ) => boolean;
}

const MockAppContext = createContext<MockAppContextType | undefined>(undefined);

const STORAGE_KEY = 'educhain_app_state_v2';

export function MockAppProvider({ children }: { children: React.ReactNode }) {
  const [campuses, setCampuses] = useState<Campus[]>(INITIAL_CAMPUSES);
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [programs, setPrograms] = useState<ScholarshipProgram[]>(INITIAL_PROGRAMS);
  const [applications, setApplications] = useState<ScholarshipApplication[]>(INITIAL_APPLICATIONS);
  const [transactions, setTransactions] = useState<MockTransaction[]>(INITIAL_TRANSACTIONS);
  const [cancellationRequests, setCancellationRequests] = useState<CancellationRequest[]>(
    INITIAL_CANCELLATION_REQUESTS
  );
  const [activities, setActivities] = useState<ActivityLog[]>(INITIAL_ACTIVITIES);

  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [activeWallet, setActiveWallet] = useState<string | null>(null);
  const [activeCampusId, setActiveCampusId] = useState<string>('');
  const [activeDonorId, setActiveDonorId] = useState<string>('');
  const [activeStudentId, setActiveStudentId] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.campuses) setCampuses(parsed.campuses);
        if (parsed.donors) setDonors(parsed.donors);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.programs) setPrograms(parsed.programs);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.cancellationRequests) setCancellationRequests(parsed.cancellationRequests);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.activeWallet) setActiveWallet(parsed.activeWallet);
        if (parsed.activeCampusId) setActiveCampusId(parsed.activeCampusId);
        if (parsed.activeDonorId) setActiveDonorId(parsed.activeDonorId);
        if (parsed.activeStudentId) setActiveStudentId(parsed.activeStudentId);
      }
    } catch {
      // fallback to initial
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          campuses,
          donors,
          students,
          programs,
          applications,
          transactions,
          cancellationRequests,
          activities,
          currentRole,
          activeWallet,
          activeCampusId,
          activeDonorId,
          activeStudentId,
        })
      );
    } catch {
      // ignore quota errors
    }
  }, [
    isHydrated,
    campuses,
    donors,
    students,
    programs,
    applications,
    transactions,
    cancellationRequests,
    activities,
    currentRole,
    activeWallet,
    activeCampusId,
    activeDonorId,
    activeStudentId,
  ]);

  const formatRupiah = (amount: number) => formatSepoliaEth(amount);

  const notify = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (
    actorRole: UserRole,
    actorName: string,
    action: string,
    target: string,
    category: ActivityLog['category']
  ) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp,
        actorRole,
        actorName,
        action,
        target,
        category,
      },
      ...prev,
    ]);
  };

  const genSimHash = () =>
    '0x' +
    Array.from({ length: 34 }, () => Math.floor(Math.random() * 16).toString(16)).join('') +
    'sim';

  // Auth lookup by wallet
  const loginByWallet = (wallet: string) => {
    const normalized = wallet.trim().toLowerCase();

    if (normalized === ADMIN_WALLET.toLowerCase()) {
      setCurrentRole('admin');
      setActiveWallet(ADMIN_WALLET);
      return { success: true, role: 'admin' as UserRole };
    }

    const foundCampus = campuses.find(
      (c) => c.walletAddress.trim().toLowerCase() === normalized
    );
    if (foundCampus) {
      if (foundCampus.status === 'Nonaktif') {
        return { success: false, reason: 'inactive' as const };
      }
      setCurrentRole('campus');
      setActiveWallet(foundCampus.walletAddress.trim());
      setActiveCampusId(foundCampus.id);
      return { success: true, role: 'campus' as UserRole };
    }

    const foundDonor = donors.find(
      (d) => d.walletAddress.trim().toLowerCase() === normalized
    );
    if (foundDonor) {
      if (foundDonor.status === 'Nonaktif') {
        return { success: false, reason: 'inactive' as const };
      }
      setCurrentRole('donor');
      setActiveWallet(foundDonor.walletAddress.trim());
      setActiveDonorId(foundDonor.id);
      return { success: true, role: 'donor' as UserRole };
    }

    const foundStudent = students.find(
      (s) => s.walletAddress.trim().toLowerCase() === normalized
    );
    if (foundStudent) {
      if (foundStudent.status === 'Nonaktif') {
        return { success: false, reason: 'inactive' as const };
      }
      setCurrentRole('student');
      setActiveWallet(foundStudent.walletAddress.trim());
      setActiveStudentId(foundStudent.id);
      return { success: true, role: 'student' as UserRole };
    }

    return { success: false, reason: 'unregistered' as const };
  };

  const logout = () => {
    setCurrentRole(null);
    setActiveWallet(null);
  };

  // ==================== ADMIN ACTIONS ====================
  const addCampus = (campus: Omit<Campus, 'id' | 'registeredAt' | 'status'>) => {
    const newCampus: Campus = {
      ...campus,
      walletAddress: campus.walletAddress.trim(),
      id: `campus-${Date.now()}`,
      status: 'Aktif',
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setCampuses((prev) => [newCampus, ...prev]);
    addActivity('admin', 'Kementerian / Admin', 'Mendaftarkan akun kampus baru', campus.name, 'Akun');
    notify({
      type: 'success',
      title: 'Kampus Berhasil Ditambahkan',
      description: `${campus.name} kini terdaftar dan aktif sebagai validator.`,
    });
  };

  const toggleCampusStatus = (campusId: string, reason: string) => {
    setCampuses((prev) =>
      prev.map((c) => {
        if (c.id !== campusId) return c;
        const nextStatus = c.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        addActivity(
          'admin',
          'Kementerian / Admin',
          `${nextStatus === 'Nonaktif' ? 'Menonaktifkan' : 'Mengaktifkan'} akun kampus (${reason})`,
          c.name,
          'Akun'
        );
        notify({
          type: nextStatus === 'Nonaktif' ? 'warning' : 'success',
          title: `Status Kampus Diperbarui: ${nextStatus}`,
          description: `${c.name} — Alasan: ${reason}`,
        });
        return { ...c, status: nextStatus };
      })
    );
  };

  const addDonor = (donor: Omit<Donor, 'id' | 'registeredAt' | 'status'>) => {
    const newDonor: Donor = {
      ...donor,
      walletAddress: donor.walletAddress.trim(),
      id: `donor-${Date.now()}`,
      status: 'Aktif',
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setDonors((prev) => [newDonor, ...prev]);
    addActivity('admin', 'Kementerian / Admin', 'Mendaftarkan akun donatur baru', donor.name, 'Akun');
    notify({
      type: 'success',
      title: 'Donatur Berhasil Ditambahkan',
      description: `${donor.name} kini dapat membuat dan mendanai program beasiswa.`,
    });
  };

  const toggleDonorStatus = (donorId: string, reason: string) => {
    setDonors((prev) =>
      prev.map((d) => {
        if (d.id !== donorId) return d;
        const nextStatus = d.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        addActivity(
          'admin',
          'Kementerian / Admin',
          `${nextStatus === 'Nonaktif' ? 'Menonaktifkan' : 'Mengaktifkan'} akun donatur (${reason})`,
          d.name,
          'Akun'
        );
        notify({
          type: nextStatus === 'Nonaktif' ? 'warning' : 'success',
          title: `Status Donatur Diperbarui: ${nextStatus}`,
          description: `${d.name} — Alasan: ${reason}`,
        });
        return { ...d, status: nextStatus };
      })
    );
  };

  const verifyProgram = (programId: string, approved: boolean, reason?: string) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== programId) return p;
        const nextStatus: ProgramStatus = approved ? 'Dibuka' : 'Ditolak';
        addActivity(
          'admin',
          'Kementerian / Admin',
          approved ? 'Menyetujui & membuka program beasiswa' : `Menolak program (${reason || '-'})`,
          p.title,
          'Program'
        );
        notify({
          type: approved ? 'success' : 'error',
          title: approved ? 'Program Disetujui & Dibuka' : 'Program Ditolak',
          description: `${p.title}${reason ? ` — ${reason}` : ''}`,
        });
        return {
          ...p,
          status: nextStatus,
          rejectionReason: approved ? undefined : reason,
        };
      })
    );
  };

  const decideCancellation = (requestId: string, approved: boolean, reason: string) => {
    const req = cancellationRequests.find((r) => r.id === requestId);
    if (!req) return;

    setCancellationRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: approved ? 'Disetujui' : 'Ditolak',
              adminDecisionNote: reason,
              decidedAt: new Date().toISOString().slice(0, 10),
            }
          : r
      )
    );

    if (approved) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === req.programId ? { ...p, status: 'Dibatalkan' } : p))
      );
    }

    const prog = programs.find((p) => p.id === req.programId);
    addActivity(
      'admin',
      'Kementerian / Admin',
      approved ? 'Menyetujui pembatalan program (Simulasi)' : 'Menolak permintaan pembatalan',
      prog?.title || req.programId,
      'Pembatalan'
    );
    notify({
      type: approved ? 'warning' : 'info',
      title: approved ? 'Pembatalan Program Disetujui' : 'Permintaan Pembatalan Ditolak',
      description: `Dana yang sudah menjadi hak penerima tetap terlindungi. Catatan: ${reason}`,
    });
  };

  // ==================== DONOR ACTIONS ====================
  const createProgram = (
    data: Omit<
      ScholarshipProgram,
      'id' | 'donorId' | 'escrowDeposited' | 'allocatedToCampus' | 'disbursedToStudents' | 'createdAt'
    >
  ) => {
    const donor = donors.find((d) => d.id === activeDonorId);
    const newProg: ScholarshipProgram = {
      ...data,
      id: `prog-${Date.now()}`,
      donorId: activeDonorId,
      escrowDeposited: 0,
      allocatedToCampus: 0,
      disbursedToStudents: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setPrograms((prev) => [newProg, ...prev]);
    addActivity(
      'donor',
      donor?.name || 'Donatur',
      data.status === 'Draft' ? 'Menyimpan draft program beasiswa' : 'Mengajukan verifikasi program baru',
      data.title,
      'Program'
    );
    notify({
      type: 'success',
      title: data.status === 'Draft' ? 'Draft Program Disimpan' : 'Program Diajukan ke Admin',
      description: `${data.title} berhasil dibuat.`,
    });
  };

  const submitProgramForVerification = (programId: string) => {
    const donor = donors.find((d) => d.id === activeDonorId);
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id !== programId) return p;
        addActivity('donor', donor?.name || 'Donatur', 'Mengajukan verifikasi program', p.title, 'Program');
        notify({
          type: 'success',
          title: 'Diajukan ke Kementerian',
          description: `${p.title} kini menunggu verifikasi Admin.`,
        });
        return { ...p, status: 'Menunggu Verifikasi' };
      })
    );
  };

  const depositToEscrow = async (programId: string, amount: number): Promise<boolean> => {
    const donor = donors.find((d) => d.id === activeDonorId);
    const prog = programs.find((p) => p.id === programId);
    if (!prog || !donor) return false;

    const contractAddr = getConfiguredContractAddress();
    if (!contractAddr) {
      notify({
        type: 'error',
        title: 'Alamat Smart Contract Sepolia Belum Diatur',
        description:
          'Deploy contracts/contract.sol ke jaringan Sepolia lalu masukkan alamat kontraknya di menu Pengaturan Admin (/admin/settings).',
      });
      return false;
    }

    try {
      const signer = await getSepoliaSigner();
      const valueWei = ethers.parseEther(amount.toString());

      let txResponse: ethers.TransactionResponse;
      if (prog.onChainId) {
        const contract = new ethers.Contract(
          contractAddr,
          SCHOLARSHIP_CONTRACT_ABI,
          signer
        );
        txResponse = await contract.fundScholarship(prog.onChainId, {
          value: valueWei,
        });
      } else {
        txResponse = await signer.sendTransaction({
          to: contractAddr,
          value: valueWei,
        });
      }

      notify({
        type: 'info',
        title: 'Transaksi Sepolia Dikirim',
        description: 'Menunggu konfirmasi block di jaringan Sepolia...',
      });

      const receipt = await txResponse.wait();
      const confirmedHash = receipt?.hash || txResponse.hash;

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === programId
            ? { ...p, escrowDeposited: p.escrowDeposited + amount }
            : p
        )
      );

      const newTx: MockTransaction = {
        id: `tx-${Date.now()}`,
        type: 'Deposit Escrow',
        programId,
        fromName: donor.name,
        fromWallet: await signer.getAddress(),
        toName: `Escrow ${prog.title}`,
        toWallet: contractAddr,
        amount,
        date: new Date().toISOString().slice(0, 10),
        txHash: confirmedHash,
        status: 'Terkonfirmasi (Sepolia)',
        note: `Deposit SepoliaETH ke smart contract escrow`,
      };
      setTransactions((prev) => [newTx, ...prev]);
      addActivity(
        'donor',
        donor.name,
        `Deposit escrow ${formatRupiah(amount)} (Sepolia)`,
        prog.title,
        'Dana'
      );
      notify({
        type: 'success',
        title: 'Deposit Sepolia Berhasil',
        description: `${formatRupiah(amount)} telah masuk ke escrow ${prog.title}.`,
      });
      return true;
    } catch (err: unknown) {
      const e = err as { code?: string | number; shortMessage?: string; message?: string };
      notify({
        type: 'error',
        title: 'Transaksi Sepolia Gagal',
        description:
          e?.code === 'ACTION_REJECTED' || e?.code === 4001
            ? 'Anda membatalkan transaksi di MetaMask.'
            : e?.shortMessage || e?.message || 'Gagal mengirim SepoliaETH.',
      });
      return false;
    }
  };

  const decideRecipient = (applicationId: string, approved: boolean, note: string) => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const prog = programs.find((p) => p.id === app.programId);
    const donor = donors.find((d) => d.id === (prog?.donorId || activeDonorId));
    const campus = campuses.find((c) => c.id === app.campusId);
    const student = students.find((s) => s.id === app.studentId);

    const recipientAmount = app.recommendedAmount || prog?.amountPerRecipient || 0;
    const totalAllocationWithGas = Number((recipientAmount + GAS_BUFFER_PER_TX).toFixed(6));

    if (approved && prog) {
      const availableEscrow = prog.escrowDeposited - prog.allocatedToCampus;
      if (availableEscrow + 1e-9 < totalAllocationWithGas) {
        notify({
          type: 'error',
          title: 'Saldo Escrow Program Tidak Mencukupi',
          description: `Dibutuhkan ${formatRupiah(totalAllocationWithGas)} (${formatRupiah(recipientAmount)} + cadangan gas ${formatRupiah(GAS_BUFFER_PER_TX)}), sedangkan sisa escrow: ${formatRupiah(availableEscrow)}.`,
        });
        return;
      }

      // Allocate funds (principal + gas buffer) from escrow to campus wallet
      setPrograms((prev) =>
        prev.map((p) =>
          p.id === prog.id
            ? {
                ...p,
                allocatedToCampus: Number(
                  (p.allocatedToCampus + totalAllocationWithGas).toFixed(6)
                ),
              }
            : p
        )
      );

      if (campus && donor) {
        const txAlloc: MockTransaction = {
          id: `tx-${Date.now()}`,
          type: 'Alokasi ke Kampus',
          programId: prog.id,
          fromName: `Escrow ${prog.title}`,
          fromWallet:
            getConfiguredContractAddress() ||
            `0xEs${prog.id.slice(-4)}000000000000000000000000000000`,
          toName: campus.name,
          toWallet: campus.walletAddress,
          amount: totalAllocationWithGas,
          date: new Date().toISOString().slice(0, 10),
          txHash: genSimHash(),
          status: 'Terkonfirmasi (Sepolia)',
          note: `Alokasi ${formatRupiah(recipientAmount)} untuk ${student?.name} + cadangan gas ${formatRupiah(GAS_BUFFER_PER_TX)}`,
        };
        setTransactions((prev) => [txAlloc, ...prev]);
      }
    }

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: approved ? 'Disetujui Donatur' : 'Ditolak Donatur',
              donorNote: note,
              timeline: [
                ...a.timeline,
                {
                  status: approved ? 'Disetujui Donatur' : 'Ditolak Donatur',
                  date: new Date().toISOString().slice(0, 10),
                  actor: donor?.name || 'Donatur',
                  note,
                },
              ],
            }
          : a
      )
    );

    addActivity(
      'donor',
      donor?.name || 'Donatur',
      approved ? 'Menyetujui calon penerima & mengalokasikan dana (Simulasi)' : 'Menolak rekomendasi calon penerima',
      student?.name || applicationId,
      'Verifikasi'
    );
    notify({
      type: approved ? 'success' : 'warning',
      title: approved ? 'Penerima Disetujui & Dana Dialokasikan (Simulasi)' : 'Calon Penerima Ditolak',
      description: `${student?.name} — ${prog?.title}`,
    });
  };

  const requestCancellation = (programId: string, reason: string) => {
    const prog = programs.find((p) => p.id === programId);
    const donor = donors.find((d) => d.id === activeDonorId);
    if (!prog || !donor) return;

    const uncommitted = Math.max(0, prog.escrowDeposited - prog.allocatedToCampus);

    if (prog.status === 'Draft' || prog.status === 'Menunggu Verifikasi') {
      setPrograms((prev) =>
        prev.map((p) => (p.id === programId ? { ...p, status: 'Dibatalkan' } : p))
      );
      addActivity('donor', donor.name, 'Membatalkan program sebelum dibuka', prog.title, 'Pembatalan');
      notify({
        type: 'info',
        title: 'Program Dibatalkan',
        description: `${prog.title} dibatalkan sebelum masa pendaftaran dibuka.`,
      });
      return;
    }

    const newReq: CancellationRequest = {
      id: `cancel-${Date.now()}`,
      programId,
      donorId: donor.id,
      reason,
      programStage: prog.status,
      allocatedFunds: prog.allocatedToCampus,
      disbursedFunds: prog.disbursedToStudents,
      uncommittedFunds: uncommitted,
      impactSummary: `Dana hak penerima (${formatRupiah(prog.allocatedToCampus)}) tetap terlindungi. Sisa belum terikat kewajiban: ${formatRupiah(uncommitted)}.`,
      status: 'Menunggu Admin',
      requestedAt: new Date().toISOString().slice(0, 10),
    };
    setCancellationRequests((prev) => [newReq, ...prev]);
    addActivity('donor', donor.name, 'Mengajukan pembatalan program ke Admin', prog.title, 'Pembatalan');
    notify({
      type: 'warning',
      title: 'Permintaan Pembatalan Dikirim ke Admin',
      description: 'Karena pendaftaran sudah dibuka, pembatalan memerlukan persetujuan Kementerian/Admin.',
    });
  };

  const settleRemainingFunds = (programId: string, action: 'refund' | 'transfer', note: string) => {
    const prog = programs.find((p) => p.id === programId);
    const donor = donors.find((d) => d.id === activeDonorId);
    if (!prog || !donor) return;

    const remaining = Math.max(0, prog.escrowDeposited - prog.allocatedToCampus);
    if (remaining <= 0) {
      notify({ type: 'info', title: 'Tidak Ada Sisa Dana', description: 'Seluruh dana escrow telah dialokasikan.' });
      return;
    }

    setPrograms((prev) =>
      prev.map((p) =>
        p.id === programId ? { ...p, escrowDeposited: p.escrowDeposited - remaining } : p
      )
    );

    const tx: MockTransaction = {
      id: `tx-${Date.now()}`,
      type: 'Refund Donatur',
      programId,
      fromName: `Escrow ${prog.title}`,
      fromWallet: `0xEs${prog.id.slice(-4)}000000000000000000000000000000`,
      toName: action === 'refund' ? donor.name : 'Pool Program Berikutnya',
      toWallet: donor.walletAddress,
      amount: remaining,
      date: new Date().toISOString().slice(0, 10),
      txHash: genSimHash(),
      status: 'Berhasil (Simulasi)',
      note: `${action === 'refund' ? 'Refund sisa dana' : 'Pengalihan sisa dana'}: ${note}`,
    };
    setTransactions((prev) => [tx, ...prev]);
    notify({
      type: 'success',
      title: action === 'refund' ? 'Refund Sisa Dana Berhasil (Simulasi)' : 'Pengalihan Dana Berhasil (Simulasi)',
      description: `${formatRupiah(remaining)} telah diproses sesuai persetujuan donatur.`,
    });
  };

  // ==================== CAMPUS ACTIONS ====================
  const addStudent = (student: Omit<Student, 'id' | 'registeredAt' | 'status'>) => {
    const campus = campuses.find((c) => c.id === student.campusId);
    const newStudent: Student = {
      ...student,
      walletAddress: student.walletAddress.trim(),
      id: `student-${Date.now()}`,
      status: 'Aktif',
      registeredAt: new Date().toISOString().slice(0, 10),
    };
    setStudents((prev) => [newStudent, ...prev]);
    addActivity('campus', campus?.name || 'Kampus', 'Mendaftarkan wallet mahasiswa baru', student.name, 'Akun');
    notify({
      type: 'success',
      title: 'Mahasiswa Berhasil Didaftarkan',
      description: `${student.name} (${student.nim}) kini dapat masuk dengan MetaMask.`,
    });
  };

  const toggleStudentStatus = (studentId: string, reason: string) => {
    const campus = campuses.find((c) => c.id === activeCampusId);
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const nextStatus = s.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        addActivity(
          'campus',
          campus?.name || 'Kampus',
          `${nextStatus === 'Nonaktif' ? 'Menonaktifkan' : 'Mengaktifkan'} akun mahasiswa (${reason})`,
          s.name,
          'Akun'
        );
        notify({
          type: nextStatus === 'Nonaktif' ? 'warning' : 'success',
          title: `Status Mahasiswa: ${nextStatus}`,
          description: `${s.name} — ${reason}`,
        });
        return { ...s, status: nextStatus };
      })
    );
  };

  const verifyApplication = (
    applicationId: string,
    decision: 'valid' | 'revision' | 'reject',
    checklist: ScholarshipApplication['checklist'],
    note: string
  ) => {
    const campus = campuses.find((c) => c.id === activeCampusId);
    const statusMap = {
      valid: 'Diverifikasi Kampus' as const,
      revision: 'Perlu Perbaikan' as const,
      reject: 'Ditolak Kampus' as const,
    };
    const nextStatus = statusMap[decision];

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id !== applicationId) return a;
        const student = students.find((s) => s.id === a.studentId);
        addActivity(
          'campus',
          campus?.name || 'Kampus',
          `Memperbarui status verifikasi menjadi ${nextStatus}`,
          student?.name || applicationId,
          'Verifikasi'
        );
        return {
          ...a,
          status: nextStatus,
          checklist,
          campusNote: note,
          documents: a.documents.map((d) => ({ ...d, verified: decision === 'valid' })),
          timeline: [
            ...a.timeline,
            {
              status: nextStatus,
              date: new Date().toISOString().slice(0, 10),
              actor: campus?.name || 'Kampus',
              note,
            },
          ],
        };
      })
    );

    notify({
      type: decision === 'valid' ? 'success' : decision === 'revision' ? 'warning' : 'error',
      title: `Status Diperbarui: ${nextStatus}`,
      description: note || 'Catatan verifikasi kampus telah disimpan.',
    });
  };

  const recommendRecipient = (applicationId: string, note: string) => {
    const campus = campuses.find((c) => c.id === activeCampusId);
    const app = applications.find((a) => a.id === applicationId);
    if (!app) return;
    const prog = programs.find((p) => p.id === app.programId);
    const student = students.find((s) => s.id === app.studentId);

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'Menunggu Persetujuan Donatur',
              recommendedAmount: prog?.amountPerRecipient || 0,
              campusNote: note || a.campusNote,
              timeline: [
                ...a.timeline,
                {
                  status: 'Direkomendasikan ke Donatur',
                  date: new Date().toISOString().slice(0, 10),
                  actor: campus?.name || 'Kampus',
                  note,
                },
              ],
            }
          : a
      )
    );

    addActivity(
      'campus',
      campus?.name || 'Kampus',
      'Mengirim rekomendasi calon penerima ke Donatur',
      student?.name || applicationId,
      'Verifikasi'
    );
    notify({
      type: 'success',
      title: 'Rekomendasi Dikirim ke Donatur',
      description: `${student?.name} kini menunggu persetujuan akhir dari penyelenggara.`,
    });
  };

  const disburseFunds = async (applicationId: string, amount: number): Promise<boolean> => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app || app.status !== 'Disetujui Donatur') {
      notify({
        type: 'error',
        title: 'Tidak Dapat Menyalurkan Dana',
        description: 'Hanya penerima yang telah disetujui donatur yang dapat menerima penyaluran.',
      });
      return false;
    }

    const prog = programs.find((p) => p.id === app.programId);
    const campus = campuses.find((c) => c.id === app.campusId);
    const student = students.find((s) => s.id === app.studentId);
    if (!prog || !campus || !student) return false;

    const alreadyDisbursedToStudent = transactions
      .filter(
        (t) =>
          t.type === 'Penyaluran ke Mahasiswa' &&
          t.programId === prog.id &&
          t.toWallet.toLowerCase() === student.walletAddress.toLowerCase()
      )
      .reduce((acc, t) => acc + t.amount, 0);

    const maxAllocationForStudent = app.recommendedAmount || prog.amountPerRecipient;
    const remainingStudentObligation = maxAllocationForStudent - alreadyDisbursedToStudent;

    if (amount > remainingStudentObligation) {
      notify({
        type: 'error',
        title: 'Melebihi Alokasi Penerima',
        description: `Sisa kewajiban untuk ${student.name} adalah ${formatRupiah(remainingStudentObligation)}.`,
      });
      return false;
    }

    const remainingProgramAllocation = prog.allocatedToCampus - prog.disbursedToStudents;
    if (amount > remainingProgramAllocation) {
      notify({
        type: 'error',
        title: 'Saldo Alokasi Kampus Tidak Cukup',
        description: `Saldo tersedia pada program ini: ${formatRupiah(remainingProgramAllocation)}.`,
      });
      return false;
    }

    try {
      const signer = await getSepoliaSigner();
      const valueWei = ethers.parseEther(amount.toString());

      const txResponse = await signer.sendTransaction({
        to: student.walletAddress,
        value: valueWei,
      });

      notify({
        type: 'info',
        title: 'Mengirim SepoliaETH ke Mahasiswa',
        description: 'Menunggu konfirmasi transaksi di jaringan Sepolia...',
      });

      const receipt = await txResponse.wait();
      const confirmedHash = receipt?.hash || txResponse.hash;

      setPrograms((prev) =>
        prev.map((p) =>
          p.id === prog.id ? { ...p, disbursedToStudents: p.disbursedToStudents + amount } : p
        )
      );

      const tx: MockTransaction = {
        id: `tx-${Date.now()}`,
        type: 'Penyaluran ke Mahasiswa',
        programId: prog.id,
        fromName: campus.name,
        fromWallet: await signer.getAddress(),
        toName: student.name,
        toWallet: student.walletAddress,
        amount,
        date: new Date().toISOString().slice(0, 10),
        txHash: confirmedHash,
        status: 'Terkonfirmasi (Sepolia)',
        note: `Penyaluran SepoliaETH beasiswa ${prog.title}`,
      };
      setTransactions((prev) => [tx, ...prev]);

      addActivity(
        'campus',
        campus.name,
        `Menyalurkan ${formatRupiah(amount)} (Sepolia)`,
        student.name,
        'Dana'
      );
      notify({
        type: 'success',
        title: 'Penyaluran SepoliaETH Berhasil',
        description: `${formatRupiah(amount)} telah dikirim ke wallet ${student.name}.`,
      });
      return true;
    } catch (err: unknown) {
      const e = err as { code?: string | number; shortMessage?: string; message?: string };
      notify({
        type: 'error',
        title: 'Penyaluran SepoliaETH Gagal',
        description:
          e?.code === 'ACTION_REJECTED' || e?.code === 4001
            ? 'Anda membatalkan transaksi di MetaMask.'
            : e?.shortMessage || e?.message || 'Gagal mengirim SepoliaETH ke wallet mahasiswa.',
      });
      return false;
    }
  };

  // ==================== STUDENT ACTIONS ====================
  const submitApplication = (
    programId: string,
    essay: string,
    docs: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verified'>[]
  ) => {
    const student = students.find((s) => s.id === activeStudentId);
    const prog = programs.find((p) => p.id === programId);
    if (!student || !prog) return false;

    if (student.status !== 'Aktif') {
      notify({ type: 'error', title: 'Akun Nonaktif', description: 'Akun Anda tidak dapat mengajukan beasiswa.' });
      return false;
    }

    const isEligibleCampus =
      prog.targetCampusIds.includes('ALL') || prog.targetCampusIds.includes(student.campusId);
    if (!isEligibleCampus) {
      notify({
        type: 'error',
        title: 'Kampus Tidak Memenuhi Syarat',
        description: 'Program ini tidak mencakup perguruan tinggi Anda.',
      });
      return false;
    }

    const existing = applications.find(
      (a) => a.programId === programId && a.studentId === student.id
    );
    if (existing) {
      notify({ type: 'warning', title: 'Sudah Mendaftar', description: 'Anda sudah mengajukan pada program ini.' });
      return false;
    }

    const nowDate = new Date().toISOString().slice(0, 10);
    const newApp: ScholarshipApplication = {
      id: `app-${Date.now()}`,
      programId,
      studentId: student.id,
      campusId: student.campusId,
      submittedAt: nowDate,
      motivationEssay: essay,
      documents: docs.map((d, idx) => ({
        ...d,
        id: `doc-${Date.now()}-${idx}`,
        uploadedAt: nowDate,
        verified: false,
      })),
      status: 'Diajukan',
      checklist: {
        activeStatus: false,
        gpaVerified: false,
        documentsComplete: false,
      },
      timeline: [
        {
          status: 'Diajukan',
          date: nowDate,
          actor: student.name,
          note: 'Pengajuan dikirim untuk verifikasi kampus',
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    addActivity('student', student.name, 'Mengajukan pendaftaran beasiswa', prog.title, 'Program');
    notify({
      type: 'success',
      title: 'Pengajuan Beasiswa Terkirim',
      description: 'Berkas Anda kini menunggu proses verifikasi akademik oleh pihak kampus.',
    });
    return true;
  };

  const reviseApplication = (
    applicationId: string,
    essay: string,
    docs: Omit<StudentDocument, 'id' | 'uploadedAt' | 'verified'>[]
  ) => {
    const app = applications.find((a) => a.id === applicationId);
    const student = students.find((s) => s.id === activeStudentId);
    if (!app || app.status !== 'Perlu Perbaikan') {
      notify({
        type: 'error',
        title: 'Dokumen Terkunci',
        description: 'Perbaikan dokumen hanya diizinkan saat status pengajuan "Perlu Perbaikan".',
      });
      return false;
    }

    const nowDate = new Date().toISOString().slice(0, 10);
    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              motivationEssay: essay,
              documents: docs.map((d, idx) => ({
                ...d,
                id: `doc-${Date.now()}-${idx}`,
                uploadedAt: nowDate,
                verified: false,
              })),
              status: 'Diajukan',
              timeline: [
                ...a.timeline,
                {
                  status: 'Diajukan (Perbaikan)',
                  date: nowDate,
                  actor: student?.name || 'Mahasiswa',
                  note: 'Dokumen perbaikan telah diunggah ulang',
                },
              ],
            }
          : a
      )
    );

    notify({
      type: 'success',
      title: 'Perbaikan Dokumen Terkirim',
      description: 'Berkas diperbarui dan dikirim ulang ke validator kampus.',
    });
    return true;
  };

  return (
    <MockAppContext.Provider
      value={{
        campuses,
        donors,
        students,
        programs,
        applications,
        transactions,
        cancellationRequests,
        activities,
        toasts,
        currentRole,
        activeWallet,
        activeCampusId,
        activeDonorId,
        activeStudentId,
        formatRupiah,
        notify,
        dismissToast,
        loginByWallet,
        logout,
        addCampus,
        toggleCampusStatus,
        addDonor,
        toggleDonorStatus,
        verifyProgram,
        decideCancellation,
        createProgram,
        submitProgramForVerification,
        depositToEscrow,
        decideRecipient,
        requestCancellation,
        settleRemainingFunds,
        addStudent,
        toggleStudentStatus,
        verifyApplication,
        recommendRecipient,
        disburseFunds,
        submitApplication,
        reviseApplication,
      }}
    >
      {children}
    </MockAppContext.Provider>
  );
}

export function useMockApp() {
  const ctx = useContext(MockAppContext);
  if (!ctx) {
    throw new Error('useMockApp must be used inside MockAppProvider');
  }
  return ctx;
}
