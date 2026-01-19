# 📊 ITDigital Wellbeing Monitor v2 - Core Process Documentation

> **Aplikasi Monitoring Aktivitas Jalan Kaki untuk Tim IT & Digital IKEA Indonesia**  
> Target: Kalori Personal (~100K-150K cal/tahun) berdasarkan BMR

---

## 📋 Executive Summary

**ITDigital Wellbeing Monitor v2** adalah aplikasi web mobile-friendly berbasis Next.js 16 yang dirancang untuk membantu tim IT & Digital IKEA Indonesia memantau aktivitas jalan kaki mereka berdasarkan **kalori terbakar**. Target tahunan dihitung secara personal berdasarkan profil fisik masing-masing coworker (weight/height/age/gender).

### Key Features
- 🔐 **Authentication** - Login dengan Coworker ID/Email + Profile Onboarding
- 📊 **Dashboard** - Progress ring kalori tahunan dan status bulanan
- 📝 **Record Activity** - Input lokasi A ke B, kalori manual, upload foto
- 📋 **History** - Riwayat aktivitas dengan filter bulan
- 📈 **Report** - Visualisasi bar chart kalori per bulan
- 👤 **Profile** - Edit profil fisik, recalculate target, statistik personal

---

## 🏗️ Architecture Overview

### Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.0.10 | React Framework dengan App Router |
| React | 19.2.1 | UI Library |
| TypeScript | ^5 | Type Safety |
| Tailwind CSS | ^4 | Mobile-first Styling |
| localStorage | - | Data Persistence |
| clsx | ^2.1.1 | Conditional CSS Classes |
| Material Symbols | - | Icon System |

### Project Structure

```
ITDigital-wellbeing/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with BottomNav
│   │   ├── page.tsx           # Entry point (redirects to Login)
│   │   ├── globals.css        # Global styles & theme
│   │   ├── login/page.tsx     # Authentication + Profile Onboarding
│   │   ├── dashboard/page.tsx # Main dashboard (calories progress)
│   │   ├── record/page.tsx    # Activity recording (manual calories)
│   │   ├── history/page.tsx   # Activity history (calories view)
│   │   ├── report/page.tsx    # Progress reports (calories charts)
│   │   └── profile/page.tsx   # User profile & body settings
│   ├── components/
│   │   ├── layout/
│   │   │   └── BottomNav.tsx  # Fixed bottom navigation
│   │   ├── dashboard/
│   │   │   ├── ProgressRing.tsx   # Circular calories progress
│   │   │   └── MonthlyStatus.tsx  # Monthly calories goal card
│   │   └── history/
│   │       ├── MonthSummary.tsx       # Month calories summary
│   │       ├── ActivityList.tsx       # Activity list with filter
│   │       ├── ActivityItem.tsx       # Single activity card (calories)
│   │       └── ActivityDetailModal.tsx # Activity detail modal
│   └── lib/
│       └── userData.ts        # Data service (BMR calc, localStorage)
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🔄 Core Process Flows

### 1. Onboarding Flow (New User)

```mermaid
flowchart TD
    subgraph Entry["🚀 App Entry"]
        A[Open App] --> B{Has Profile?}
        B -->|No| C[📱 Login Page]
        B -->|Yes| D[📊 Dashboard]
    end

    subgraph Auth["🔐 Authentication"]
        C --> E[Input Email/Password]
        E --> F[Click LOGIN]
        F --> G{Profile Complete?}
        G -->|No| H[📝 Profile Setup]
        G -->|Yes| D
    end

    subgraph Profile["👤 Profile Setup"]
        H --> I[Select Gender]
        I --> J[Input Weight/Height/Age]
        J --> K[View Target Preview with Tooltip]
        K --> L[START MY JOURNEY]
        L --> M[Save to localStorage]
        M --> D
    end

    style Entry fill:#e3f2fd
    style Auth fill:#fff3e0
    style Profile fill:#e8f5e9
```

### 2. Record Activity Flow

```mermaid
flowchart TD
    subgraph Input["📝 Input Phase"]
        A[🏠 Dashboard] -->|Click Record Activity| B[📍 Record Page]
        B --> C[📅 Select Date]
        C --> D[📍 Input Location From]
        D --> E[🏁 Input Location To]
    end

    subgraph Calories["🔥 Calories Input"]
        E --> F[Set Calories 10-1000]
        F --> G[Use +/- buttons or type]
    end

    subgraph Evidence["📸 Evidence Phase"]
        G --> H[📷 Upload Activity Photo]
        H --> I{Photo Uploaded?}
        I -->|No| J[❌ Show Error Message]
        J --> H
        I -->|Yes| K[✅ Enable Save Button]
    end

    subgraph Save["💾 Save Phase"]
        K --> L[Click SAVE ACTIVITY]
        L --> M[Add to localStorage]
        M --> N[Update totalCalories]
        N --> O[✅ Success Toast]
        O --> P[🏠 Redirect to Dashboard]
    end

    style Input fill:#e3f2fd
    style Calories fill:#fff3e0
    style Evidence fill:#fce4ec
    style Save fill:#e8f5e9
```

### 3. Data Flow Architecture

```mermaid
flowchart LR
    subgraph UI["🎨 UI Layer"]
        A[Pages]
        B[Components]
    end

    subgraph Service["⚙️ Service Layer"]
        C[userData.ts]
        D[BMR Calculation]
    end

    subgraph Storage["💾 Storage Layer"]
        E[localStorage: wellbeing-user]
        F[localStorage: wellbeing-activities]
    end

    A --> B
    B <--> C
    C --> D
    C <--> E
    C <--> F

    style UI fill:#e3f2fd
    style Service fill:#fff3e0
    style Storage fill:#e8f5e9
```

---

## 📱 Page-by-Page Analysis

### 1. Login Page (`/login`)

**Purpose:** Autentikasi dan onboarding profil user baru

**Features:**
- Input Coworker ID / Email
- Input Password dengan visibility toggle
- Multi-step form: Login → Profile Setup
- Profile fields: Gender, Weight, Height, Age
- Auto BMR calculation dengan target preview
- Tooltip menjelaskan formula perhitungan
- Social proof (jumlah coworkers yang sudah join)

```mermaid
flowchart TD
    A[Login Page] --> B[Header]
    A --> C[Visual Panel]
    A --> D[Form Panel]
    
    subgraph Login["Step 1: Login"]
        D --> D1[Email Input]
        D --> D2[Password Input]
        D --> D3[Login Button]
    end
    
    subgraph Profile["Step 2: Profile"]
        D --> D4[Gender Select]
        D --> D5[Weight/Height/Age]
        D --> D6[Target Preview + Tooltip]
        D --> D7[Start Journey Button]
    end

    style Login fill:#e3f2fd
    style Profile fill:#e8f5e9
```

---

### 2. Dashboard Page (`/dashboard`)

**Purpose:** Tampilan utama setelah login, menampilkan progress kalori

**Features:**
- Greeting personal dengan nama user
- Circular progress ring (currentCalories / targetCalories)
- Monthly status card dengan progress bar kalori
- Quick action button "Record Activity"
- Recent activities list dengan detail kalori

**Components Used:**
- `ProgressRing` - SVG circular progress (calories)
- `MonthlyStatus` - Monthly calorie goal card

```mermaid
flowchart TD
    A[Dashboard Page] --> B[Header]
    A --> C[ProgressRing]
    A --> D[MonthlyStatus]
    A --> E[Record Button]
    A --> F[Recent Activities]
    
    C --> C1[currentCalories / targetCalories]
    C --> C2[Percentage Badge]
    
    D --> D1[Monthly Calories]
    D --> D2[Monthly Target = yearly/12]
    
    F --> F1[Activity Cards with Calories]

    style A fill:#0058a3,color:#fff
    style C fill:#ffdb00
    style D fill:#e3f2fd
```

---

### 3. Record Activity Page (`/record`)

**Purpose:** Input aktivitas baru dengan kalori manual

**Features:**
- Date picker untuk tanggal aktivitas
- Location From (text input)
- Location To (text input)
- Calories input dengan +/- buttons (10-1000 range)
- Photo upload (mandatory) dengan preview
- Save ke localStorage

**State Management:**
- `date` - Selected date
- `locationFrom`, `locationTo` - Location texts
- `calories` - Manual calories input (number)
- `photo` - Uploaded photo (base64)
- `status` - 'idle' | 'saving' | 'success'

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> InputtingData: User fills form
    InputtingData --> CaloriesSet: Set calories
    CaloriesSet --> PhotoRequired: Calories OK
    PhotoRequired --> PhotoUploaded: Upload photo
    PhotoUploaded --> Saving: Click Save
    Saving --> Success: localStorage saved
    Success --> [*]: Redirect to Dashboard
    
    PhotoRequired --> Error: Save without photo
    Error --> PhotoRequired: Clear error
```

---

### 4. History Page (`/history`)

**Purpose:** Menampilkan riwayat semua aktivitas yang tercatat

**Features:**
- Month filter dropdown (2026)
- Total calories summary card
- Activity list dengan scroll
- Click activity untuk detail modal (calories view)
- Loading state saat switch bulan

**Components Used:**
- `MonthSummary` - Total calories summary
- `ActivityList` - List container dengan filter
- `ActivityDetailModal` - Slide-up modal (calories display)

**Data Structure:**
```typescript
interface Activity {
    date: { day: number; month: string };
    title: string;
    calories: number;
    photo?: string;
    startPoint: string;
    endPoint: string;
}
```

---

### 5. Report Page (`/report`)

**Purpose:** Visualisasi data progress kalori dalam bentuk chart

**Features:**
- Year selector dropdown (2026, 2025)
- Yearly goal progress bar dengan percentage
- Monthly calories bar chart (Jan-Dec)
- Statistics grid (Avg/Month, Best Month)
- Remaining calories to goal dengan CTA

**Chart Types:**
1. **Linear Progress Bar** - Yearly completion percentage
2. **Bar Chart** - Monthly calories (dynamic from localStorage)

```mermaid
xychart-beta
    title "Monthly Calories - 2026"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Calories" 0 --> 15000
    bar [8000, 7500, 11000, 9000, 7000, 9500, 0, 0, 0, 0, 0, 0]
    line [10600, 10600, 10600, 10600, 10600, 10600, 10600, 10600, 10600, 10600, 10600, 10600]
```

---

### 6. Profile Page (`/profile`)

**Purpose:** Informasi user, edit profil fisik, dan pengaturan

**Features:**
- Profile card dengan avatar, nama, dan badges
- Body Profile section (editable)
  - Gender, Weight, Height, Age
  - Save & Recalculate button
- Calorie Target display dengan tooltip formula
- Progress percentage
- Settings toggles (Notifications, Email Digest)
- Navigation links (Help & Support, Privacy & Data)
- Sign Out button (clears localStorage)

```mermaid
flowchart TD
    A[Profile Page] --> B[Header]
    A --> C[Profile Card]
    A --> D[Body Profile Section]
    A --> E[Calorie Target Card]
    A --> F[Settings Section]
    A --> G[Sign Out Button]
    
    D --> D1[Gender/Weight/Height/Age]
    D --> D2[Edit Button]
    D --> D3[Save & Recalculate]
    
    E --> E1[Target Calories]
    E --> E2[Progress %]
    E --> E3[Formula Tooltip]

    style A fill:#0058a3,color:#fff
    style D fill:#e8f5e9
    style E fill:#fff3e0
```

---

## 🧩 Component Architecture

### Component Hierarchy

```mermaid
flowchart TD
    subgraph Root["🏠 Root Layout"]
        A[RootLayout]
        A --> B[Children Pages]
        A --> C[BottomNav]
    end

    subgraph Pages["📱 Pages"]
        B --> D[LoginPage]
        B --> E[Dashboard]
        B --> F[RecordPage]
        B --> G[HistoryPage]
        B --> H[ReportPage]
        B --> I[ProfilePage]
    end

    subgraph Dashboard_Components["📊 Dashboard Components"]
        E --> J[ProgressRing - calories]
        E --> K[MonthlyStatus - calories]
    end

    subgraph History_Components["📋 History Components"]
        G --> L[MonthSummary - calories]
        G --> M[ActivityList]
        M --> N[ActivityItem - calories]
        G --> O[ActivityDetailModal - calories]
    end

    subgraph Services["⚙️ Services"]
        P[userData.ts]
        P --> Q[BMR Calculation]
        P --> R[localStorage CRUD]
    end

    style Root fill:#e3f2fd
    style Pages fill:#fff3e0
    style Dashboard_Components fill:#e8f5e9
    style History_Components fill:#fce4ec
    style Services fill:#f3e5f5
```

### Component Props Interface

```mermaid
classDiagram
    class ProgressRing {
        +number currentCalories
        +number targetCalories
        +render() JSX
    }
    
    class MonthlyStatus {
        +number currentCalories
        +number targetCalories
        +render() JSX
    }
    
    class MonthSummary {
        +number totalCalories
        +number monthlyTarget
        +string month
        +render() JSX
    }
    
    class ActivityItem {
        +object date
        +string title
        +number calories
        +string photo
        +boolean isLast
        +render() JSX
    }
```

---

## 📊 KPI & Metrics

### BMR Calculation (Mifflin-St Jeor)

| Gender | Formula | Example (70kg, 170cm, 30y) |
|--------|---------|---------------------------|
| **Male** | 10×weight + 6.25×height - 5×age + 5 | 1,717.5 cal/day |
| **Female** | 10×weight + 6.25×height - 5×age - 161 | 1,330.25 cal/day |

### Target Calculation

| Metric | Formula | Example |
|--------|---------|---------|
| **Yearly Target** | BMR × 1.55 × 0.2 × 250 | ~133,000 cal |
| **Monthly Target** | Yearly / 12 | ~11,000 cal |
| **Progress %** | (totalCalories / targetCalories) × 100 | 45% |
| **Remaining** | targetCalories - totalCalories | 70,000 cal |

### Formula Explanation (Tooltip)
```
Target kalori dihitung berdasarkan:
• BMR (Basal Metabolic Rate) - kalori dasar tubuh
• × 1.55 (Activity Factor untuk aktivitas sedang)
• × 0.2 (Porsi kalori dari walking activity)
• × 250 (Hari kerja per tahun)
```

---

## 💾 Data Structure

### User Object (localStorage: wellbeing-user)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  weight: number;      // kg
  height: number;      // cm
  age: number;
  gender: 'male' | 'female';
  targetCalories: number;
  totalCalories: number;
  profileCompleted: boolean;
}
```

### Activity Object (localStorage: wellbeing-activities)
```typescript
interface Activity {
  id: string;
  date: string;        // ISO date (YYYY-MM-DD)
  locationFrom: string;
  locationTo: string;
  calories: number;    // 10-1000 range
  photo: string;       // base64
  createdAt: string;   // ISO datetime
}
```

---

## 🎨 Design System

### Color Palette

| Variable | Hex Code | Usage |
|----------|----------|-------|
| `--color-primary` | #0058a3 | IKEA Blue - Primary actions, headers |
| `--color-accent` | #ffdb00 | IKEA Yellow - Highlights, badges |
| `--color-background-light` | #f5f5f5 | Page background |
| `--color-card-bg` | #ffffff | Card backgrounds |
| `--color-text-dark` | #111111 | Primary text |
| `--color-text-muted` | #666666 | Secondary text |
| `--color-border-light` | #e5e5e5 | Card borders |

### Typography

| Font | Variable | Usage |
|------|----------|-------|
| Spline Sans | `--font-display` | Headers, bold text |
| Noto Sans | `--font-body` | Body text |
| Material Symbols | - | Icons throughout app |

---

## 📝 Summary

**ITDigital Wellbeing Monitor v2** telah diupgrade dengan:

✅ **Personal Calorie Target** - BMR-based target untuk setiap coworker  
✅ **Onboarding Flow** - Profile setup dengan gender/weight/height/age  
✅ **Manual Calories Input** - 10-1000 cal per aktivitas  
✅ **localStorage Persistence** - Data tersimpan dengan baik  
✅ **Formula Tooltip** - Penjelasan cara perhitungan target  
✅ **Editable Profile** - Update profil dan recalculate target  
✅ **Year 2026** - Semua tanggal diupdate  

---

*Documentation generated on: January 19, 2026*
