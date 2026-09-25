export const mockScanData = {
  scanId: "SCN-20260925-8842",
  timestamp: "2026-09-25T14:10:00Z",
  targetDrive: "/dev/nvme0n1p2 (Corrupted Volume - NTFS)",
  summary: {
    filesDetected: 14892,
    filesRecovered: 12408,
    partialFiles: 2140,
    failedFiles: 344,
    totalSize: "482.5 GB",
    recoveredSize: "142.8 GB",
    healthScore: 94.8,
    scanDuration: "3m 42s",
  },
  artifacts: [
    {
      id: "art-101",
      name: "financial_ledger_q3_2026.xlsx",
      path: "/Finance/Quarterly/financial_ledger_q3_2026.xlsx",
      size: "4.8 MB",
      type: "Spreadsheet",
      status: "Recovered",
      confidence: 99.4,
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      recoveredAt: "2026-09-25 14:12"
    },
    {
      id: "art-102",
      name: "production_cluster_backup.db",
      path: "/Database/Backups/production_cluster_backup.db",
      size: "820.4 MB",
      type: "Database",
      status: "Recovered",
      confidence: 98.1,
      checksum: "8f481a5a01ff6c92d53a232759905c1410940342938492019382049283948201",
      recoveredAt: "2026-09-25 14:12"
    },
    {
      id: "art-103",
      name: "product_architecture_spec.pdf",
      path: "/Presentations/product_architecture_spec.pdf",
      size: "24.6 MB",
      type: "PDF Document",
      status: "Recovered",
      confidence: 100.0,
      checksum: "4a8a08f09d37b73795649038408b5f3333333333333333333333333333333333",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-104",
      name: "server_audit_syslog.tar.gz",
      path: "/Logs/server_audit_syslog.tar.gz",
      size: "142.1 MB",
      type: "Archive",
      status: "Partial",
      confidence: 84.5,
      checksum: "2c6ee7ae60d2d3a1f7e034293f9c6d32aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-105",
      name: "ml_model_weights_fp16.bin",
      path: "/ML/Models/ml_model_weights_fp16.bin",
      size: "1.1 GB",
      type: "Binary Model",
      status: "Recovered",
      confidence: 97.9,
      checksum: "9b74c9897bac770ffc029102a300a582bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-106",
      name: "unallocated_raw_block_0x8F0.raw",
      path: "/Raw/Carved/unallocated_raw_block_0x8F0.raw",
      size: "340.0 MB",
      type: "Raw Bitstream",
      status: "Failed",
      confidence: 32.0,
      checksum: "d41d8cd98f00b204e9800998ecf8427e00000000000000000000000000000000",
      recoveredAt: "2026-09-25 14:13"
    }
  ]
};

export const sampleRecentScans = [
  {
    id: "SCN-20260925-8842",
    name: "Deep Raw Sector Scan - NVMe Drive 1",
    date: "Today, 14:10",
    filesFound: 14892,
    size: "142.8 GB",
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
