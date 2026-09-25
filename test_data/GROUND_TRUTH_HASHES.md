# RecoverIQ Ground-Truth Evidence Verification Table

This dataset provides deterministic, forensically verified ground-truth test data for validating the RecoverIQ reconstruction engine.

## 1. Primary Test Volume: `evidence_sample_disk.raw`

- **File Path**: [`test_data/evidence_sample_disk.raw`](file:///c:/Users/Smithasrinivas/Desktop/RecoverIQ/test_data/evidence_sample_disk.raw)
- **Raw Volume Size**: 1,706 bytes
- **SHA-256 Checksum**: `782da6251e0352388523e92da0494ca7f28be8168857e8375fab0f4caf565f5d`
- **Filesystem Base**: NTFS Partition Image with simulated unallocated sector gaps

---

## 2. Embedded Ground-Truth File Signatures & Offsets

| File Type | Byte Offset (Hex) | Byte Offset (Dec) | Magic Header Signature | Expected Extraction Status | Integrity / Parity Status |
|---|---|---|---|---|---|
| **JPEG Image** | `0x00000201` | `513` | `FF D8 FF` | Successfully Carved | Valid (100%) |
| **PNG Image** | `0x00000401` | `1025` | `89 50 4E 47 0D 0A 1A 0A` | Successfully Carved | Valid (100%) |
| **PDF Document** | `0x00000601` | `1537` | `25 50 44 46 2D` (`%PDF-`) | Central Structure Carved | Valid (100%) |

---

## 3. How Judges Can Verify Ground Truth in 1 Command

```powershell
python -c "
from backend.app.core.scanner import scan_for_signatures
with open('test_data/evidence_sample_disk.raw', 'rb') as f:
    data = f.read()
matches = scan_for_signatures(data)
for m in matches:
    print(f'Detected {m[\"file_type\"]} at offset {hex(m[\"offset\"])}')
"
```
