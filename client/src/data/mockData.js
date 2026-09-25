// Sample inline SVG Data URLs for realistic image preview demos
const sampleImageThumb = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2338bdf8'/><stop offset='100%' stop-color='%236366f1'/></linearGradient></defs><rect width='120' height='80' rx='8' fill='%230f172a'/><path d='M10 60 L40 30 L65 50 L85 25 L110 60 Z' fill='url(%23g)' opacity='0.8'/><circle cx='85' cy='20' r='6' fill='%23f59e0b'/><text x='15' y='72' fill='%2394a3b8' font-size='8' font-family='sans-serif'>EVIDENCE IMG</text></svg>";

const samplePhotoThumb = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'><rect width='120' height='80' rx='8' fill='%231e1b4b'/><circle cx='60' cy='35' r='18' fill='%2334d399' opacity='0.7'/><path d='M20 70 C30 50, 90 50, 100 70 Z' fill='%23818cf8'/><text x='15' y='74' fill='%23cbd5e1' font-size='8' font-family='sans-serif'>SURVEILLANCE</text></svg>";

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
      integrity: "valid",
      priority: "High",
      confidence: 99.4,
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      recoveredAt: "2026-09-25 14:12"
    },
    {
      id: "art-102",
      name: "crime_scene_surveillance_01.jpg",
      path: "/Forensics/Images/crime_scene_surveillance_01.jpg",
      size: "3.2 MB",
      type: "Image",
      status: "Recovered",
      integrity: "valid",
      priority: "High",
      confidence: 98.7,
      previewUrl: samplePhotoThumb,
      checksum: "7a9128f1c849102c918349201938204928394820182948201928394819284920",
      recoveredAt: "2026-09-25 14:12"
    },
    {
      id: "art-103",
      name: "product_architecture_spec.pdf",
      path: "/Presentations/product_architecture_spec.pdf",
      size: "24.6 MB",
      type: "PDF Document",
      status: "Recovered",
      integrity: "valid",
      priority: "Medium",
      confidence: 100.0,
      checksum: "4a8a08f09d37b73795649038408b5f3333333333333333333333333333333333",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-104",
      name: "forensic_camera_dump_raw.png",
      path: "/Forensics/RawShots/forensic_camera_dump_raw.png",
      size: "12.4 MB",
      type: "Image",
      status: "Partial",
      integrity: "partial",
      priority: "Medium",
      confidence: 86.2,
      previewUrl: sampleImageThumb,
      checksum: "f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-105",
      name: "production_cluster_backup.db",
      path: "/Database/Backups/production_cluster_backup.db",
      size: "820.4 MB",
      type: "Database",
      status: "Recovered",
      integrity: "valid",
      priority: "High",
      confidence: 98.1,
      checksum: "8f481a5a01ff6c92d53a232759905c1410940342938492019382049283948201",
      recoveredAt: "2026-09-25 14:12"
    },
    {
      id: "art-106",
      name: "server_audit_syslog.tar.gz",
      path: "/Logs/server_audit_syslog.tar.gz",
      size: "142.1 MB",
      type: "Archive",
      status: "Partial",
      integrity: "partial",
      priority: "Low",
      confidence: 84.5,
      checksum: "2c6ee7ae60d2d3a1f7e034293f9c6d32aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      recoveredAt: "2026-09-25 14:13"
    },
    {
      id: "art-107",
      name: "unallocated_raw_block_0x8F0.raw",
      path: "/Raw/Carved/unallocated_raw_block_0x8F0.raw",
      size: "340.0 MB",
      type: "Raw Bitstream",
      status: "Failed",
      integrity: "failed",
      priority: "Low",
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
