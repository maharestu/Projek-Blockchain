// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ScholarshipPlatform
 * @notice Smart contract untuk mengelola role, program beasiswa, pendanaan escrow,
 *         seleksi joint (Kampus + Donatur), pencairan dana, serta pembatalan/refund.
 * @dev Tidak menyimpan data pribadi sensitif (nama, NIK, email, IPK, dokumen) on-chain.
 */
contract ScholarshipPlatform is AccessControl, ReentrancyGuard {
    // =============================================================
    //                            ROLES
    // =============================================================
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DONOR_ROLE = keccak256("DONOR_ROLE");
    bytes32 public constant CAMPUS_ROLE = keccak256("CAMPUS_ROLE");
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    // =============================================================
    //                            ENUMS
    // =============================================================
    enum ProgramStatus {
        Draft,
        Verified,
        Fundraising,
        Selection,
        Disbursing,
        Completed,
        Cancelled,
        Rejected
    }

    // =============================================================
    //                           STRUCTS
    // =============================================================
    struct User {
        address wallet;
        bytes32 role;
        bool active;
        bool registered;
    }

    struct ScholarshipProgram {
        uint256 id;
        address donor;
        bool allCampusesAllowed;
        string metadataURI;
        uint256 targetAmount;
        uint256 totalFunded;
        uint256 totalCommitted;
        uint256 totalDisbursed;
        uint64 startTime;
        uint64 endTime;
        uint256 maxRecipients;
        ProgramStatus status;
        bool cancellationRequested;
    }

    struct Application {
        uint256 id;
        uint256 scholarshipId;
        address campus;
        address student;
        bytes32 applicationHash;
        bool campusValidated;
        bool campusRecommended;
        bool donorDecided;
        bool donorApproved;
        bool disbursed;
        uint256 amount;
    }

    // =============================================================
    //                           STORAGE
    // =============================================================
    uint256 public nextScholarshipId = 1;
    uint256 public nextApplicationId = 1;

    mapping(address => User) private _users;
    mapping(address => address) public studentCampus; // student => registering campus
    mapping(uint256 => ScholarshipProgram) public scholarships;
    mapping(uint256 => mapping(address => bool)) public programAllowedCampuses;
    mapping(uint256 => mapping(address => uint256)) public donorContributions;
    mapping(uint256 => mapping(address => uint256)) public donorRefunded;

    mapping(uint256 => Application) public applications;
    mapping(uint256 => mapping(address => bool)) public hasAppliedToProgram;
    mapping(uint256 => uint256) public approvedRecipientCount;

    // =============================================================
    //                            EVENTS
    // =============================================================
    event UserRegistered(address indexed user, bytes32 indexed role, address indexed registeredBy);
    event UserStatusChanged(address indexed user, bool active, address indexed updatedBy);

    event ScholarshipCreated(
        uint256 indexed scholarshipId,
        address indexed donor,
        string metadataURI,
        uint256 targetAmount
    );
    event ScholarshipVerified(uint256 indexed scholarshipId, address indexed admin);
    event ScholarshipRejected(uint256 indexed scholarshipId, address indexed admin, string reason);
    event ScholarshipStatusUpdated(uint256 indexed scholarshipId, ProgramStatus newStatus);
    event ScholarshipFunded(uint256 indexed scholarshipId, address indexed donor, uint256 amount);

    event CandidateSubmitted(
        uint256 indexed applicationId,
        uint256 indexed scholarshipId,
        address indexed campus,
        address student,
        bytes32 applicationHash
    );
    event CandidateValidated(uint256 indexed applicationId, address indexed campus, bool valid);
    event CandidateRecommended(
        uint256 indexed applicationId,
        address indexed campus,
        uint256 amount
    );
    event CandidateDecisionUpdated(
        uint256 indexed applicationId,
        address indexed donor,
        bool approved
    );
    event ScholarshipDisbursed(
        uint256 indexed applicationId,
        uint256 indexed scholarshipId,
        address indexed student,
        address campus,
        uint256 amount,
        uint256 timestamp
    );

    event CancellationRequested(uint256 indexed scholarshipId, address indexed donor);
    event ScholarshipCancelled(uint256 indexed scholarshipId, address indexed cancelledBy);
    event RefundProcessed(uint256 indexed scholarshipId, address indexed donor, uint256 amount);

    // =============================================================
    //                          MODIFIERS
    // =============================================================
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Hanya Admin yang diizinkan");
        require(_users[msg.sender].active, "Akun Admin nonaktif");
        _;
    }

    modifier onlyActiveDonor() {
        require(hasRole(DONOR_ROLE, msg.sender), "Hanya Donatur yang diizinkan");
        require(_users[msg.sender].active, "Akun Donatur nonaktif");
        _;
    }

    modifier onlyActiveCampus() {
        require(hasRole(CAMPUS_ROLE, msg.sender), "Hanya Kampus yang diizinkan");
        require(_users[msg.sender].active, "Akun Kampus nonaktif");
        _;
    }

    // =============================================================
    //                         CONSTRUCTOR
    // =============================================================
    /**
     * @param initialAdmin Alamat wallet Admin awal (mis. 0xCf7D59e962fD5F9C6DaD07bCf0571aa8779D6d7B).
     *                     Jika address(0), menggunakan msg.sender.
     */
    constructor(address initialAdmin) {
        address adminAddr = initialAdmin == address(0) ? msg.sender : initialAdmin;

        _grantRole(DEFAULT_ADMIN_ROLE, adminAddr);
        _grantRole(ADMIN_ROLE, adminAddr);

        _users[adminAddr] = User({
            wallet: adminAddr,
            role: ADMIN_ROLE,
            active: true,
            registered: true
        });

        emit UserRegistered(adminAddr, ADMIN_ROLE, msg.sender);
    }

    // =============================================================
    //                    A. ROLE MANAGEMENT
    // =============================================================
    function addCampus(address campus) external onlyAdmin {
        _registerUser(campus, CAMPUS_ROLE);
    }

    function addDonor(address donor) external onlyAdmin {
        _registerUser(donor, DONOR_ROLE);
    }

    function addStudent(address student) external onlyActiveCampus {
        _registerUser(student, STUDENT_ROLE);
        studentCampus[student] = msg.sender;
    }

    function setUserActive(address user, bool active) external onlyAdmin {
        require(user != address(0), "Alamat tidak valid");
        require(_users[user].registered, "Pengguna belum terdaftar");
        require(_users[user].role != ADMIN_ROLE || user != msg.sender, "Admin tidak dapat menonaktifkan diri sendiri");

        _users[user].active = active;
        emit UserStatusChanged(user, active, msg.sender);
    }

    function setStudentActive(address student, bool active) external onlyActiveCampus {
        require(student != address(0), "Alamat tidak valid");
        require(_users[student].registered && _users[student].role == STUDENT_ROLE, "Bukan mahasiswa terdaftar");
        require(studentCampus[student] == msg.sender, "Bukan mahasiswa kampus ini");

        _users[student].active = active;
        emit UserStatusChanged(student, active, msg.sender);
    }

    function getUser(address user) external view returns (User memory) {
        return _users[user];
    }

    function isUserActive(address user) external view returns (bool) {
        return _users[user].registered && _users[user].active;
    }

    function _registerUser(address account, bytes32 role) internal {
        require(account != address(0), "Zero address tidak diizinkan");
        require(!_users[account].registered, "Alamat sudah terdaftar");

        _grantRole(role, account);
        _users[account] = User({
            wallet: account,
            role: role,
            active: true,
            registered: true
        });

        emit UserRegistered(account, role, msg.sender);
    }

    // =============================================================
    //                 B. SCHOLARSHIP MANAGEMENT
    // =============================================================
    function createScholarship(
        string calldata metadataURI,
        uint256 targetAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 maxRecipients,
        bool allCampusesAllowed,
        address[] calldata allowedCampuses
    ) external onlyActiveDonor returns (uint256) {
        require(bytes(metadataURI).length > 0, "Metadata URI wajib diisi");
        require(targetAmount > 0, "Target dana harus lebih dari 0");
        require(endTime > startTime, "Jadwal akhir harus setelah jadwal mulai");

        uint256 scholarshipId = nextScholarshipId++;

        scholarships[scholarshipId] = ScholarshipProgram({
            id: scholarshipId,
            donor: msg.sender,
            allCampusesAllowed: allCampusesAllowed,
            metadataURI: metadataURI,
            targetAmount: targetAmount,
            totalFunded: 0,
            totalCommitted: 0,
            totalDisbursed: 0,
            startTime: startTime,
            endTime: endTime,
            maxRecipients: maxRecipients,
            status: ProgramStatus.Draft,
            cancellationRequested: false
        });

        if (!allCampusesAllowed) {
            require(allowedCampuses.length > 0, "Pilih minimal satu kampus sasaran");
            for (uint256 i = 0; i < allowedCampuses.length; i++) {
                address c = allowedCampuses[i];
                require(_users[c].registered && _users[c].role == CAMPUS_ROLE, "Kampus tidak valid");
                programAllowedCampuses[scholarshipId][c] = true;
            }
        }

        emit ScholarshipCreated(scholarshipId, msg.sender, metadataURI, targetAmount);
        return scholarshipId;
    }

    function updateScholarship(
        uint256 scholarshipId,
        string calldata metadataURI,
        uint256 targetAmount,
        uint64 startTime,
        uint64 endTime,
        uint256 maxRecipients
    ) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(prog.status == ProgramStatus.Draft, "Hanya dapat diubah saat Draft");
        require(endTime > startTime, "Jadwal tidak valid");

        prog.metadataURI = metadataURI;
        prog.targetAmount = targetAmount;
        prog.startTime = startTime;
        prog.endTime = endTime;
        prog.maxRecipients = maxRecipients;
    }

    function verifyScholarship(uint256 scholarshipId) external onlyAdmin {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.status == ProgramStatus.Draft, "Program harus berstatus Draft");

        prog.status = ProgramStatus.Verified;
        emit ScholarshipVerified(scholarshipId, msg.sender);
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Verified);
    }

    function rejectScholarship(uint256 scholarshipId, string calldata reason) external onlyAdmin {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.status == ProgramStatus.Draft, "Program harus berstatus Draft");

        prog.status = ProgramStatus.Rejected;
        emit ScholarshipRejected(scholarshipId, msg.sender, reason);
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Rejected);
    }

    function openFundraising(uint256 scholarshipId) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(prog.status == ProgramStatus.Verified, "Program belum diverifikasi Admin");

        prog.status = ProgramStatus.Fundraising;
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Fundraising);
    }

    function startSelection(uint256 scholarshipId) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(prog.status == ProgramStatus.Fundraising, "Status harus Fundraising");

        prog.status = ProgramStatus.Selection;
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Selection);
    }

    function startDisbursing(uint256 scholarshipId) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(prog.status == ProgramStatus.Selection, "Status harus Selection");

        prog.status = ProgramStatus.Disbursing;
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Disbursing);
    }

    function completeScholarship(uint256 scholarshipId) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(prog.status == ProgramStatus.Disbursing, "Status harus Disbursing");
        require(prog.totalCommitted == prog.totalDisbursed, "Masih ada kewajiban pencairan tersisa");

        prog.status = ProgramStatus.Completed;
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Completed);
    }

    // =============================================================
    //                         C. FUNDING
    // =============================================================
    function fundScholarship(uint256 scholarshipId) external payable {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.status == ProgramStatus.Fundraising, "Program tidak dalam tahap pendanaan");
        require(msg.value > 0, "Nominal dana harus lebih dari 0");

        prog.totalFunded += msg.value;
        donorContributions[scholarshipId][msg.sender] += msg.value;

        emit ScholarshipFunded(scholarshipId, msg.sender, msg.value);
    }

    function getScholarshipBalance(uint256 scholarshipId) external view returns (uint256) {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        return prog.totalFunded - prog.totalDisbursed;
    }

    // =============================================================
    //                  D. CANDIDATE SELECTION
    // =============================================================
    function submitCandidate(
        uint256 scholarshipId,
        address student,
        bytes32 applicationHash
    ) external onlyActiveCampus returns (uint256) {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(
            prog.status == ProgramStatus.Fundraising || prog.status == ProgramStatus.Selection,
            "Program tidak menerima kandidat"
        );
        require(
            prog.allCampusesAllowed || programAllowedCampuses[scholarshipId][msg.sender],
            "Kampus tidak diizinkan pada program ini"
        );
        require(_users[student].registered && _users[student].role == STUDENT_ROLE, "Mahasiswa belum terdaftar");
        require(_users[student].active, "Akun mahasiswa nonaktif");
        require(studentCampus[student] == msg.sender, "Mahasiswa bukan milik kampus ini");
        require(!hasAppliedToProgram[scholarshipId][student], "Mahasiswa sudah terdaftar di program ini");
        require(applicationHash != bytes32(0), "Hash aplikasi wajib diisi");

        hasAppliedToProgram[scholarshipId][student] = true;
        uint256 applicationId = nextApplicationId++;

        applications[applicationId] = Application({
            id: applicationId,
            scholarshipId: scholarshipId,
            campus: msg.sender,
            student: student,
            applicationHash: applicationHash,
            campusValidated: false,
            campusRecommended: false,
            donorDecided: false,
            donorApproved: false,
            disbursed: false,
            amount: 0
        });

        emit CandidateSubmitted(applicationId, scholarshipId, msg.sender, student, applicationHash);
        return applicationId;
    }

    function setCandidateValidation(uint256 applicationId, bool valid) external onlyActiveCampus {
        Application storage app = applications[applicationId];
        require(app.id != 0, "Aplikasi tidak ditemukan");
        require(app.campus == msg.sender, "Bukan kampus pengaju");
        require(!app.donorDecided, "Sudah diputuskan Donatur");

        app.campusValidated = valid;
        emit CandidateValidated(applicationId, msg.sender, valid);
    }

    function recommendCandidate(uint256 applicationId, uint256 amount) external onlyActiveCampus {
        Application storage app = applications[applicationId];
        require(app.id != 0, "Aplikasi tidak ditemukan");
        require(app.campus == msg.sender, "Bukan kampus pengaju");
        require(app.campusValidated, "Kandidat harus divalidasi kampus terlebih dahulu");
        require(!app.donorDecided, "Sudah diputuskan Donatur");
        require(amount > 0, "Nominal bantuan harus lebih dari 0");

        ScholarshipProgram storage prog = scholarships[app.scholarshipId];
        require(prog.totalFunded - prog.totalCommitted >= amount, "Dana tersedia program tidak mencukupi");

        app.campusRecommended = true;
        app.amount = amount;

        emit CandidateRecommended(applicationId, msg.sender, amount);
    }

    function donorDecision(uint256 applicationId, bool approved) external onlyActiveDonor {
        Application storage app = applications[applicationId];
        require(app.id != 0, "Aplikasi tidak ditemukan");
        ScholarshipProgram storage prog = scholarships[app.scholarshipId];
        require(prog.donor == msg.sender, "Bukan Donatur pemilik program");
        require(app.campusRecommended, "Kandidat belum direkomendasikan kampus");
        require(!app.donorDecided, "Keputusan Donatur sudah ditetapkan");

        app.donorDecided = true;
        app.donorApproved = approved;

        if (approved) {
            if (prog.maxRecipients > 0) {
                require(approvedRecipientCount[prog.id] < prog.maxRecipients, "Kuota penerima penuh");
            }
            require(prog.totalFunded - prog.totalCommitted >= app.amount, "Saldo program tidak mencukupi");

            prog.totalCommitted += app.amount;
            approvedRecipientCount[prog.id] += 1;
        }

        emit CandidateDecisionUpdated(applicationId, msg.sender, approved);
    }

    // =============================================================
    //                       E. DISBURSEMENT
    // =============================================================
    function disburse(uint256 applicationId) external onlyActiveCampus nonReentrant {
        Application storage app = applications[applicationId];
        require(app.id != 0, "Aplikasi tidak ditemukan");
        require(app.campus == msg.sender, "Bukan kampus penyalur yang berwenang");
        require(app.campusRecommended && app.donorApproved, "Kandidat belum disetujui penuh");
        require(!app.disbursed, "Dana sudah dicairkan sebelumnya");

        ScholarshipProgram storage prog = scholarships[app.scholarshipId];
        require(
            prog.status == ProgramStatus.Disbursing || prog.status == ProgramStatus.Selection,
            "Program tidak dalam tahap pencairan"
        );
        require(prog.totalFunded - prog.totalDisbursed >= app.amount, "Saldo program tidak mencukupi");

        // Checks-Effects-Interactions
        app.disbursed = true;
        prog.totalDisbursed += app.amount;

        (bool sent, ) = payable(app.student).call{value: app.amount}("");
        require(sent, "Transfer dana ke wallet mahasiswa gagal");

        emit ScholarshipDisbursed(
            applicationId,
            app.scholarshipId,
            app.student,
            msg.sender,
            app.amount,
            block.timestamp
        );
    }

    // =============================================================
    //                  F. CANCELLATION & REFUND
    // =============================================================
    function requestCancellation(uint256 scholarshipId) external onlyActiveDonor {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.donor == msg.sender, "Bukan pemilik program");
        require(
            prog.status != ProgramStatus.Completed && prog.status != ProgramStatus.Cancelled,
            "Program sudah selesai atau dibatalkan"
        );

        if (prog.status == ProgramStatus.Draft || prog.status == ProgramStatus.Verified) {
            prog.status = ProgramStatus.Cancelled;
            emit ScholarshipCancelled(scholarshipId, msg.sender);
            emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Cancelled);
        } else {
            // Memerlukan persetujuan Admin (admin_exception)
            prog.cancellationRequested = true;
            emit CancellationRequested(scholarshipId, msg.sender);
        }
    }

    function approveCancellation(uint256 scholarshipId) external onlyAdmin {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(prog.cancellationRequested, "Tidak ada permintaan pembatalan");
        require(prog.status != ProgramStatus.Cancelled, "Program sudah dibatalkan");

        prog.status = ProgramStatus.Cancelled;
        prog.cancellationRequested = false;

        emit ScholarshipCancelled(scholarshipId, msg.sender);
        emit ScholarshipStatusUpdated(scholarshipId, ProgramStatus.Cancelled);
    }

    /**
     * @notice Mengembalikan dana yang BELUM terikat kewajiban penerima (totalFunded - totalCommitted)
     *         ketika program dibatalkan atau telah selesai.
     * @dev Dana yang sudah menjadi hak penerima tidak dapat ditarik melalui fungsi ini.
     */
    function refundDonor(uint256 scholarshipId) external onlyActiveDonor nonReentrant {
        ScholarshipProgram storage prog = scholarships[scholarshipId];
        require(prog.id != 0, "Program tidak ditemukan");
        require(
            prog.status == ProgramStatus.Cancelled || prog.status == ProgramStatus.Completed,
            "Refund hanya tersedia saat program Cancelled atau Completed"
        );

        uint256 uncommitted = prog.totalFunded - prog.totalCommitted;
        require(uncommitted > 0, "Tidak ada sisa dana yang dapat di-refund");

        uint256 contributed = donorContributions[scholarshipId][msg.sender];
        uint256 alreadyRefunded = donorRefunded[scholarshipId][msg.sender];
        uint256 donorRemainingContribution = contributed > alreadyRefunded
            ? contributed - alreadyRefunded
            : 0;
        require(donorRemainingContribution > 0, "Tidak ada kontribusi yang dapat diklaim");

        uint256 refundAmount = donorRemainingContribution <= uncommitted
            ? donorRemainingContribution
            : uncommitted;

        // Checks-Effects-Interactions
        donorRefunded[scholarshipId][msg.sender] += refundAmount;
        prog.totalFunded -= refundAmount;

        (bool sent, ) = payable(msg.sender).call{value: refundAmount}("");
        require(sent, "Refund dana gagal");

        emit RefundProcessed(scholarshipId, msg.sender, refundAmount);
    }
}
