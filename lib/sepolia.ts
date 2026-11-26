import { ethers } from 'ethers';

export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
export const SEPOLIA_EXPLORER_URL = 'https://sepolia.etherscan.io';
export const SEPOLIA_CONTRACT_STORAGE_KEY = 'educhain_sepolia_contract_address';
export const GAS_BUFFER_PER_TX = 0.005;

export const SEPOLIA_NETWORK_PARAMS = {
  chainId: SEPOLIA_CHAIN_ID_HEX,
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.sepolia.org'],
  blockExplorerUrls: [SEPOLIA_EXPLORER_URL],
};

export const SCHOLARSHIP_CONTRACT_ABI = [
  // Role Management
  'function addCampus(address campus) external',
  'function addDonor(address donor) external',
  'function addStudent(address student) external',
  'function setUserActive(address user, bool active) external',
  'function setStudentActive(address student, bool active) external',
  'function hasRole(bytes32 role, address account) external view returns (bool)',
  'function isUserActive(address user) external view returns (bool)',

  // Scholarship Management
  'function createScholarship(string metadataURI, uint256 targetAmount, uint64 startTime, uint64 endTime, uint256 maxRecipients, bool allCampusesAllowed, address[] allowedCampuses) external returns (uint256)',
  'function verifyScholarship(uint256 scholarshipId) external',
  'function rejectScholarship(uint256 scholarshipId, string reason) external',
  'function openFundraising(uint256 scholarshipId) external',
  'function startSelection(uint256 scholarshipId) external',
  'function startDisbursing(uint256 scholarshipId) external',
  'function completeScholarship(uint256 scholarshipId) external',
  'function nextScholarshipId() external view returns (uint256)',

  // Funding
  'function fundScholarship(uint256 scholarshipId) external payable',
  'function getScholarshipBalance(uint256 scholarshipId) external view returns (uint256)',

  // Candidate Selection
  'function submitCandidate(uint256 scholarshipId, address student, bytes32 applicationHash) external returns (uint256)',
  'function setCandidateValidation(uint256 applicationId, bool valid) external',
  'function recommendCandidate(uint256 applicationId, uint256 amount) external',
  'function donorDecision(uint256 applicationId, bool approved) external',
  'function nextApplicationId() external view returns (uint256)',

  // Disbursement
  'function disburse(uint256 applicationId) external',

  // Cancellation & Refund
  'function requestCancellation(uint256 scholarshipId) external',
  'function approveCancellation(uint256 scholarshipId) external',
  'function refundDonor(uint256 scholarshipId) external',
];

export function formatSepoliaEth(amount: number): string {
  if (!Number.isFinite(amount) || amount === 0) return '0 SepoliaETH';
  const formatted = Number(amount.toFixed(6)).toString();
  return `${formatted} SepoliaETH`;
}

export function getConfiguredContractAddress(): string {
  const envAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.trim();
  if (envAddr && ethers.isAddress(envAddr)) return envAddr;
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(SEPOLIA_CONTRACT_STORAGE_KEY)?.trim();
    if (saved && ethers.isAddress(saved)) return saved;
  }
  return '';
}

export function setConfiguredContractAddress(address: string): void {
  if (typeof window !== 'undefined') {
    if (address.trim()) {
      localStorage.setItem(SEPOLIA_CONTRACT_STORAGE_KEY, address.trim());
    } else {
      localStorage.removeItem(SEPOLIA_CONTRACT_STORAGE_KEY);
    }
  }
}

export async function ensureSepoliaNetwork(): Promise<void> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask tidak terdeteksi di browser.');
  }

  const currentChainId = (await window.ethereum.request({
    method: 'eth_chainId',
  })) as string;

  if (currentChainId?.toLowerCase() === SEPOLIA_CHAIN_ID_HEX) {
    return;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
    });
  } catch (err: unknown) {
    const switchErr = err as { code?: number };
    if (switchErr?.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [SEPOLIA_NETWORK_PARAMS],
      });
    } else {
      throw new Error('Silakan alihkan jaringan MetaMask Anda ke Sepolia Testnet.');
    }
  }
}

export async function getSepoliaSigner() {
  await ensureSepoliaNetwork();
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask tidak terdeteksi.');
  }
  const provider = new ethers.BrowserProvider(
    window.ethereum as ethers.Eip1193Provider
  );
  return provider.getSigner();
}

export async function getSepoliaWalletBalance(address: string): Promise<string> {
  if (typeof window === 'undefined' || !window.ethereum || !address) return '0';
  const provider = new ethers.BrowserProvider(
    window.ethereum as ethers.Eip1193Provider
  );
  const bal = await provider.getBalance(address);
  return Number(ethers.formatEther(bal)).toFixed(4);
}

export async function getScholarshipContractWithSigner() {
  const contractAddr = getConfiguredContractAddress();
  if (!contractAddr) {
    throw new Error(
      'Alamat Smart Contract Sepolia belum dikonfigurasi. Atur di menu Pengaturan Admin (/admin/settings) atau NEXT_PUBLIC_CONTRACT_ADDRESS.'
    );
  }
  const signer = await getSepoliaSigner();
  return new ethers.Contract(contractAddr, SCHOLARSHIP_CONTRACT_ABI, signer);
}
