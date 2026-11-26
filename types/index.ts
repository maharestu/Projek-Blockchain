export type UserRole = 'admin' | 'donor' | 'campus' | 'student';

export type ProgramStatus =
  | 'Draft'
  | 'Menunggu Verifikasi'
  | 'Dibuka'
  | 'Seleksi'
  | 'Aktif'
  | 'Selesai'
  | 'Dibatalkan'
  | 'Ditolak';

export type ApplicationStatus =
  | 'Diajukan'
  | 'Diverifikasi Kampus'
  | 'Perlu Perbaikan'
  | 'Ditolak Kampus'
  | 'Direkomendasikan ke Donatur'
  | 'Menunggu Persetujuan Donatur'
  | 'Disetujui Donatur'
  | 'Ditolak Donatur';

export type AccountStatus = 'Aktif' | 'Nonaktif';

export type CancellationStatus = 'Menunggu Admin' | 'Disetujui' | 'Ditolak';

export interface Campus {
  id: string;
  name: string;
  code: string;
  walletAddress: string;
  email: string;
  phone: string;
  city: string;
  status: AccountStatus;
  registeredAt: string;
  supportingInfo?: string;
}

export interface Donor {
  id: string;
  name: string;
  organizationType: 'Yayasan' | 'Kementerian' | 'Korporasi / BUMN';
  walletAddress: string;
  email: string;
  phone: string;
  status: AccountStatus;
  registeredAt: string;
  supportingInfo?: string;
}

export interface Student {
  id: string;
  name: string;
  nim: string;
  campusId: string;
  major: string;
  degree: 'D3' | 'D4' | 'S1' | 'S2';
  semester: number;
  gpa: number;
  email: string;
  walletAddress: string;
  status: AccountStatus;
  registeredAt: string;
}

export interface ScholarshipProgram {
  id: string;
  donorId: string;
  title: string;
  category: string;
  description: string;
  targetCampusIds: string[]; // ['ALL'] or specific campus IDs
  targetDegree: string;
  criteria: string;
  quota: number;
  amountPerRecipient: number;
  totalBudget: number;
  escrowDeposited: number;
  allocatedToCampus: number;
  disbursedToStudents: number;
  assetSymbol: string;
  openDate: string;
  closeDate: string;
  selectionDate: string;
  announcementDate: string;
  scholarshipPeriod: string;
  requirements: string[];
  requiredDocuments: string[];
  status: ProgramStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface StudentDocument {
  id: string;
  name: string;
  type: string;
  fileName: string;
  uploadedAt: string;
  verified: boolean;
}

export interface ApplicationTimelineItem {
  status: string;
  date: string;
  actor: string;
  note?: string;
}

export interface ScholarshipApplication {
  id: string;
  programId: string;
  studentId: string;
  campusId: string;
  submittedAt: string;
  motivationEssay: string;
  documents: StudentDocument[];
  status: ApplicationStatus;
  campusNote?: string;
  donorNote?: string;
  recommendedAmount?: number;
  checklist: {
    activeStatus: boolean;
    gpaVerified: boolean;
    documentsComplete: boolean;
  };
  timeline: ApplicationTimelineItem[];
}

export type TransactionType =
  | 'Deposit Escrow'
  | 'Alokasi ke Kampus'
  | 'Penyaluran ke Mahasiswa'
  | 'Refund Donatur';

export interface MockTransaction {
  id: string;
  type: TransactionType;
  programId: string;
  fromName: string;
  fromWallet: string;
  toName: string;
  toWallet: string;
  amount: number;
  date: string;
  txHash: string; // Selalu diberi penanda Simulasi di UI
  status: 'Berhasil (Simulasi)';
  note?: string;
}

export interface CancellationRequest {
  id: string;
  programId: string;
  donorId: string;
  reason: string;
  programStage: ProgramStatus;
  allocatedFunds: number;
  disbursedFunds: number;
  uncommittedFunds: number;
  impactSummary: string;
  status: CancellationStatus;
  adminDecisionNote?: string;
  requestedAt: string;
  decidedAt?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  target: string;
  category: 'Program' | 'Verifikasi' | 'Dana' | 'Akun' | 'Pembatalan';
}

export interface RoleInfo {
  id: 'admin' | 'yayasan' | 'kampus' | 'mahasiswa';
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  responsibilities: string[];
  highlightColor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Blockchain & Wallet' | 'Pendaftaran' | 'Keamanan & Privasi' | 'Institusi';
}

export type ScholarshipStatus = 'dibuka' | 'segera' | 'ditutup';

export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  providerType: 'Kementerian' | 'Yayasan' | 'BUMN / Swasta';
  badge: string;
  amount: string;
  amountPeriod: string;
  targetDegree: string;
  deadline: string;
  status: ScholarshipStatus;
  description: string;
  quota: string;
  requirements: string[];
  benefits: string[];
  fundingType: 'Biaya Pendidikan Penuh' | 'Biaya Hidup & Pendidikan' | 'Bantuan Riset & Talenta';
}
