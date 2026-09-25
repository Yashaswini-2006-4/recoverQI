export const initialScanResults = {
  scanId: "SCN-20260925-8842",
  timestamp: "2026-09-25T14:10:00Z",
  targetDrive: "/dev/nvme0n1p2 (Corrupted Volume - NTFS)",
  fileCountScanned: 148920,
  recoverableCount: 1240,
  corruptedCount: 42,
  totalSizeScanned: "482.5 GB",
  recoverableSize: "14.2 GB",
  healthScore: 94.8,
  scanDuration: "3m 42s",
  status: "Completed",
  categories: [
    { name: "Documents (.pdf, .docx, .xlsx)", count: 520, size: "3.4 GB", icon: "FileText", color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Images (.raw, .png, .jpg)", count: 430, size: "6.8 GB", icon: "Image", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { name: "Databases & Code (.sql, .db, .js)", count: 180, size: "2.1 GB", icon: "Database", color: "text-purple-400", bg: "bg-purple-500/10" },
    { name: "Archives & Backups (.zip, .tar.gz)", count: 110, size: "1.9 GB", icon: "Archive", color: "text-amber-400", bg: "bg-amber-500/10" },
  ],
  recoveredFiles: [
    {
      id: "f-101",
      name: "financial_report_q3_2026.xlsx",
      originalPath: "/Finance/Quarterly/financial_report_q3_2026.xlsx",
      size: "4.8 MB",
      type: "Spreadsheet",
      recoveryConfidence: 99.4,
      status: "Fully Recoverable",
      hash: "e3b0c44298fc1c149afbf4c8996fb924",
      lastModified: "2026-09-20 11:30"
    },
    {
      id: "f-102",
      name: "client_contracts_database.db",
      originalPath: "/Database/Backups/client_contracts_database.db",
      size: "820.4 MB",
      type: "Database",
      recoveryConfidence: 98.1,
      status: "Fully Recoverable",
      hash: "8f481a5a01ff6c92d53a232759905c14",
      lastModified: "2026-09-24 16:45"
    },
    {
      id: "f-103",
      name: "product_launch_deck_final.pdf",
      originalPath: "/Presentations/product_launch_deck_final.pdf",
      size: "24.6 MB",
      type: "PDF Document",
      recoveryConfidence: 100.0,
      status: "Fully Recoverable",
      hash: "4a8a08f09d37b73795649038408b5f33",
      lastModified: "2026-09-22 09:15"
    },
    {
      id: "f-104",
      name: "system_audit_logs_september.tar.gz",
      originalPath: "/Logs/system_audit_logs_september.tar.gz",
      size: "142.1 MB",
      type: "Archive",
      recoveryConfidence: 92.3,
      status: "Minor Sectors Reconstructed",
      hash: "2c6ee7ae60d2d3a1f7e034293f9c6d32",
      lastModified: "2026-09-25 04:00"
    },
    {
      id: "f-105",
      name: "hq_keynote_master_footage.raw",
      originalPath: "/Media/Video/hq_keynote_master_footage.raw",
      size: "4.2 GB",
      type: "Raw Media",
      recoveryConfidence: 89.7,
      status: "Partially Recoverable",
      hash: "d41d8cd98f00b204e9800998ecf8427e",
      lastModified: "2026-09-18 19:22"
    },
    {
      id: "f-106",
      name: "neural_weights_checkpoint_v2.bin",
      originalPath: "/ML/Models/neural_weights_checkpoint_v2.bin",
      size: "1.1 GB",
      type: "Binary Model",
      recoveryConfidence: 97.9,
      status: "Fully Recoverable",
      hash: "9b74c9897bac770ffc029102a300a582",
      lastModified: "2026-09-24 23:10"
    }
  ]
};

export const sampleRecentScans = [
  {
    id: "SCN-20260925-8842",
    name: "Deep Raw Sector Scan - NVMe Drive 1",
    date: "Today, 14:10",
    filesFound: 1240,
    size: "14.2 GB",
    status: "Success",
    health: "94.8%"
  },
  {
    id: "SCN-20260924-4119",
    name: "Quick NTFS Volume Recovery - External SSD",
    date: "Yesterday, 18:32",
    filesFound: 489,
    size: "5.6 GB",
    status: "Success",
    health: "99.1%"
  },
  {
    id: "SCN-20260922-1083",
    name: "Corrupted Partition Rebuild - SATA Disk 2",
    date: "Sep 22, 2026",
    filesFound: 3120,
    size: "88.4 GB",
    status: "Partial",
    health: "78.4%"
  }
];
