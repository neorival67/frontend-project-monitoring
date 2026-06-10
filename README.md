# 📊 Frontend Monitoring Dashboard

Dashboard pemantauan proyek berbasis **Next.js 16** dengan arsitektur Clean Architecture. Sistem ini dirancang untuk memantau proyek secara real-time, mengelola tim, client/vendor, dan siklus hidup proyek dari inisiasi hingga penutupan.

---

## 🛠 Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack React Query v5 |
| HTTP Client | Axios |
| Charting | D3.js v7 |
| PDF Generation | jsPDF + jspdf-autotable |
| Icons | Lucide React |

---

## 🏛 Arsitektur

Proyek ini mengikuti pola **Clean Architecture** yang dibagi menjadi 4 layer:

```
src/
├── app/                        # Next.js App Router (routing & halaman)
│   ├── (auth)/                 # Route group: halaman autentikasi
│   │   ├── login/
│   │   ├── register/
│   │   ├── activate/
│   │   └── accept-invite/
│   └── (dashboard)/            # Route group: halaman dashboard (auth-protected)
│       ├── overview/
│       ├── proyek/
│       ├── master-tim/
│       ├── clients/
│       └── profile/
│
├── core/                       # Domain Layer: business entities & types
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Proyek.ts
│   │   ├── Client.ts
│   │   ├── Dashboard.ts
│   │   └── Risk.ts
│   └── utils/
│
├── infrastructure/             # Data Layer: API calls & providers
│   ├── api/
│   │   ├── apiClient.ts        # Axios instance + interceptors
│   │   ├── apiProyek.ts
│   │   ├── apiMasterTeam.ts
│   │   └── apiDashboard.ts
│   ├── repositories/           # Data access layer
│   │   ├── auth.repo.ts
│   │   ├── proyek.repo.ts
│   │   ├── user.repo.ts
│   │   ├── client.repo.ts
│   │   ├── risk.repo.ts
│   │   ├── approval.repo.ts
│   │   ├── closing.repo.ts
│   │   └── dashboard.repo.ts
│   └── providers/
│       ├── QueryProvider.tsx   # TanStack Query wrapper
│       └── NotificationProvider.tsx
│
├── use-cases/                  # Application Layer: business logic hooks
│   └── hooks/
│       ├── useAuth.ts
│       ├── useProyek.ts
│       ├── useUser.ts
│       ├── useMasterTeam.ts
│       ├── useClient.ts
│       ├── useDashboard.ts
│       └── useUser.ts
│
└── presentation/               # UI Layer: components & features
    ├── components/             # Reusable UI components
    ├── features/               # Smart feature components
    │   └── tabs/               # Tab components untuk detail proyek
    └── layouts/
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- npm atau yarn
- Backend API aktif (lihat `.env.local`)

### Instalasi

```bash
# Clone repository
git clone <repo-url>
cd frontend-monitoring

# Install dependencies
npm install
```

### Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# URL API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/
```

> Untuk production, ganti dengan IP/domain server backend yang sebenarnya.

### Menjalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Perintah Lain

```bash
npm run build     # Build untuk production
npm run start     # Jalankan production build
npm run lint      # Linting dengan ESLint
```

---

## 🔐 Autentikasi & Otorisasi

### Mekanisme Auth
- Autentikasi menggunakan **JWT Bearer Token** yang disimpan di `localStorage` (`accessToken`)
- Data user tersimpan di `localStorage` (`user`) sebagai JSON
- Axios interceptor otomatis menyertakan token pada setiap request
- Jika token expired (respons 401), user diarahkan ke `/login` secara otomatis

### Sistem Role

| Role | Akses |
|---|---|
| `ADMIN` | Akses penuh ke semua fitur |
| `PM` | Akses penuh, dapat membuat & mengelola proyek |
| `CLIENT` | Hanya melihat proyek yang terkait dengan perusahaannya |
| `VENDOR` | Hanya melihat proyek tempat mereka terlibat |
| `TIM` | Hanya melihat proyek tempat mereka ditugaskan |

---

## 📄 Halaman & Fitur

### Halaman Auth
| Route | Deskripsi |
|---|---|
| `/login` | Form login dengan email & password |
| `/register` | Pendaftaran akun baru (role: ADMIN atau PM) |
| `/activate?token=...` | Aktivasi akun via link email |
| `/accept-invite?token=...` | Penerimaan undangan sebagai anggota tim |

### Halaman Dashboard
| Route | Komponen | Deskripsi |
|---|---|---|
| `/overview` | `DashboardOverview` | Statistik real-time, chart keuangan, EVM, dan aktivitas terkini |
| `/proyek` | `ProjectManager` | Daftar proyek dengan filter status dan pencarian |
| `/proyek/[id]` | `ProjectDetailFeature` | Detail proyek dengan 6 tab: Overview, Monitoring, Planning (Gantt), Approval, Tim, Closing |
| `/master-tim` | `TeamManager` | Manajemen anggota tim internal |
| `/clients` | `ClientVendorManager` | Master data Client & Vendor |
| `/profile` | `ProfilePage` | Profil dan pengaturan akun pengguna |

---

## 🗂 Tab Detail Proyek

Halaman detail proyek (`/proyek/[id]`) memiliki 6 tab:

| Tab | File | Deskripsi |
|---|---|---|
| **Overview** | `TabOverview.tsx` | Informasi umum proyek, budget, timeline, team |
| **Monitoring** | `TabMonitoring.tsx` | Pantau aktivitas dan progress |
| **Planning** | `TabPlanningGantt.tsx` | Gantt chart interaktif untuk perencanaan |
| **Approval** | `TabApproval.tsx` | Pengajuan dan review deliverable |
| **Tim** | `TabTeamProject.tsx` | Manajemen anggota tim proyek |
| **Closing** | `TabClosingProyek.tsx` | Verifikasi aktivitas, upload BAST, tutup proyek & generate laporan PDF |

---

## 🧩 Komponen Utama

### Reusable Components (`src/presentation/components/`)

| Komponen | Deskripsi |
|---|---|
| `ProjectCard` | Kartu ringkasan proyek dengan status & progress |
| `TeamCard` | Kartu anggota tim dengan info kontak & skills |
| `TeamModal` | Modal form tambah/edit anggota tim |
| `CreateProjectModal` | Modal form membuat proyek baru |
| `CreateAktivitas` | Modal form membuat aktivitas |
| `CreateLogAktivitas` | Modal form input log aktivitas harian |
| `CreateRisk` | Modal form membuat risiko proyek |
| `GanttChart` | Visualisasi Gantt chart berbasis D3 |
| `AttachmentModal` | Modal lihat attachment file |
| `SubmitDeliverable` | Modal submit deliverable |
| `ReviewApproval` | Modal review dan approval deliverable |
| `NotificationPanel` | Panel notifikasi real-time |
| `StatCard` | Kartu statistik angka |
| `Modal` | Base modal wrapper |
| `Button` | Tombol dengan variasi style |
| `Input` | Input field dengan validasi |

---

## 🔌 API Integration

### Base Configuration
```typescript
// src/infrastructure/api/apiClient.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
```

### Endpoint Summary

#### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Register |
| POST | `/auth/activate` | Aktivasi akun |
| POST | `/auth/accept-invite` | Terima undangan |

#### Users / Tim
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/users/get-all` | Ambil semua user |
| GET | `/users/getby/:id` | Ambil user by ID |
| POST | `/users/post` | Buat user baru |
| PUT | `/users/put/:id` | Update user |
| DELETE | `/users/delete/:id` | Hapus user |

#### Proyek
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/proyek` | Semua proyek |
| GET | `/proyek/:id` | Detail proyek |
| POST | `/proyek` | Buat proyek |
| DELETE | `/proyek/:id` | Hapus proyek |
| POST | `/proyek/:id/aktivitas` | Buat aktivitas |
| PUT | `/proyek/aktivitas/:id` | Update aktivitas |

#### Dashboard
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/dashboard/stats` | Statistik overview |
| GET | `/dashboard/active-projects` | Proyek aktif |
| GET | `/dashboard/charts` | Data chart keuangan |
| GET | `/dashboard/predictions` | Analisis EVM |
| GET | `/dashboard/activities` | Aktivitas terkini |
| GET | `/dashboard/vendor-performance` | Performa vendor |

---

## ⚡ React Query Hooks

### Auth Hooks (`useAuth`)
```typescript
const { login, logout, register, isLoggingIn } = useAuth();
```

### Proyek Hooks
```typescript
const { data, isLoading } = useSemuaProyek();
const { data } = useDetailProyek(id);
```

### User / Tim Hooks
```typescript
const { data } = useSemuaUser();
useCreateUser()      // POST
useUpdateUser()      // PUT
useDeleteUser()      // DELETE
```

### Dashboard Hooks
```typescript
useDashboardStats()
useActiveProjects()
useDashboardCharts()
usePredictions()      // EVM Analytics
useDashboardActivities()
useVendorPerformance()
```

### Client/Vendor Hooks
```typescript
const { data } = useSemuaClient();
useCreateClient()
useUpdateClient()
useDeleteClient()
```

---

## 🎨 Styling

- **Global styles**: `src/app/globals.css`
- **Auth styles**: Bagian dari `globals.css` (class `.auth-*`)
- **Dashboard styles**: `src/app/pm.css`
- **Master Tim styles**: `src/app/team.css`
- **Tailwind CSS v4** digunakan untuk komponen inline utility

---

## 📦 Fitur Utama

### ✅ Dashboard Overview
- Statistik real-time (Total Proyek, Budget, Risiko, Deliverable)
- Chart perbandingan Budget vs Realisasi
- Chart Target vs Aktual Progress
- Analisis EVM (Earned Value Management) - CPI & SPI
- Prediksi Overbudget (EAC)
- Donut chart distribusi risiko
- Feed aktivitas terkini
- **RBAC**: VENDOR/TIM/STAFF tidak dapat mengakses, CLIENT hanya melihat proyeknya

### ✅ Manajemen Proyek
- Daftar proyek dengan filter status (All, Planning, On Going, Closing)
- Pencarian berdasarkan nama/kode proyek
- Buat proyek baru (ADMIN/PM)
- Hapus proyek (ADMIN/PM)

### ✅ Detail Proyek
- 6 tab fungsional untuk siklus proyek lengkap
- Gantt chart interaktif
- Sistem approval deliverable dengan review
- Penutupan proyek dengan verifikasi aktivitas
- Upload dokumen BAST (Berita Acara Serah Terima)
- Generate laporan PDF otomatis

### ✅ Master Tim
- Tampilan grid kartu anggota tim
- Filter department (Engineering, Design, Business, QA, PMO, Lainnya)
- Pencarian real-time
- Tambah / Edit / Hapus anggota tim

### ✅ Master Client/Vendor
- Tabel data client dan vendor
- Filter berdasarkan tipe dan status
- CRUD lengkap dengan modal form
- Detail view lengkap

### ✅ Sistem Undangan
- Admin/PM dapat mengundang user baru via link
- Alur aktivasi akun via token
- Penerimaan undangan dengan set password

---

## 🗄 Core Entities (TypeScript)

### User
```typescript
type UserRole = "ADMIN" | "PM" | "VENDOR" | "TIM" | "CLIENT";
type UserStatus = "ACTIVE" | "PENDING" | "INACTIVE";
type Departemen = "Engineering" | "Design" | "Business" | "QA" | "PMO" | "Lainnya";
```

### Proyek
```typescript
type StatusProyek = "inisiasi" | "perencanaan" | "pelaksanaan" | "penutupan" | string;
type StatusAktivitas = "Belum Mulai" | "berjalan" | "selesai" | "terlambat" | string;
type StatusDeliverable = "SUBMITTED" | "APPROVED" | "REJECTED" | string;
type StatusApproval = "APPROVED" | "REJECTED" | "PENDING";
```

---

## 🔧 Pengembangan

### Menambah Feature Baru

1. **Definisikan entity** di `src/core/entities/`
2. **Buat repository** di `src/infrastructure/repositories/`
3. **Buat React Query hooks** di `src/use-cases/hooks/`
4. **Buat UI components** di `src/presentation/components/`
5. **Buat feature component** di `src/presentation/features/`
6. **Tambah route** di `src/app/(dashboard)/`

### Konvensi Penamaan

- Komponen: `PascalCase` (contoh: `ProjectCard.tsx`)
- Hooks: `camelCase` dengan prefix `use` (contoh: `useProyek.ts`)
- Repository: `camelCase.repo.ts` (contoh: `proyek.repo.ts`)
- Halaman: `page.tsx` sesuai App Router Next.js

---

## 📝 Catatan Penting

> [!WARNING]
> Token JWT disimpan di `localStorage`. Pastikan aplikasi dijalankan di atas HTTPS di production untuk keamanan.

> [!NOTE]
> Data user (termasuk role) juga disimpan di `localStorage` sebagai cache lokal. Logout akan membersihkan semua data ini.

> [!TIP]
> Gunakan React Query DevTools di mode development untuk men-debug state data fetching. Sudah terkonfigurasi via `QueryProvider`.

---

**Versi**: 0.1.0  
**Framework**: Next.js 16.2.4  
**Status**: Active Development
