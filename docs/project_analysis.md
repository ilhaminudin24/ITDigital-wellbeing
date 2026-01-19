# 📊 ITDigital Wellbeing Monitor - Project Analysis & Documentation

> **Aplikasi Monitoring Aktivitas Jalan Kaki untuk Tim IT & Digital IKEA Indonesia**  
> Target: 150 km/tahun | Target Bulanan: 12.5 km/bulan

---

## 📋 Executive Summary

**ITDigital Wellbeing Monitor** adalah aplikasi web mobile-friendly berbasis Next.js 16 yang dirancang untuk membantu tim IT & Digital IKEA Indonesia memantau dan mencatat aktivitas jalan kaki mereka. Aplikasi ini memiliki target tahunan sebesar **150 km** yang dibagi menjadi target bulanan **12.5 km**.

### Key Features
- 🔐 **Authentication** - Login dengan Coworker ID/Email
- 📊 **Dashboard** - Progress ring tahunan dan status bulanan
- 📝 **Record Activity** - Input lokasi A ke B dengan upload foto
- 📋 **History** - Riwayat aktivitas dengan filter bulan
- 📈 **Report** - Visualisasi bar chart dan line chart
- 👤 **Profile** - Statistik personal dan pengaturan

---

## 🏗️ Architecture Overview

### Tech Stack

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Next.js | 16.0.10 | React Framework dengan App Router |
| React | 19.2.1 | UI Library |
| TypeScript | ^5 | Type Safety |
| Tailwind CSS | ^4 | Mobile-first Styling |
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
│   │   ├── login/page.tsx     # Authentication page
│   │   ├── dashboard/page.tsx # Main dashboard
│   │   ├── record/page.tsx    # Activity recording
│   │   ├── history/page.tsx   # Activity history
│   │   ├── report/page.tsx    # Progress reports
│   │   └── profile/page.tsx   # User profile & settings
│   └── components/
│       ├── layout/
│       │   └── BottomNav.tsx  # Fixed bottom navigation
│       ├── dashboard/
│       │   ├── ProgressRing.tsx   # Circular progress
│       │   └── MonthlyStatus.tsx  # Monthly goal card
│       └── history/
│           ├── MonthSummary.tsx       # Month distance summary
│           ├── ActivityList.tsx       # Activity list with filter
│           ├── ActivityItem.tsx       # Single activity card
│           └── ActivityDetailModal.tsx # Activity detail modal
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 🔄 Core Process Flows

### 1. Application Navigation Flow

```mermaid
flowchart TD
    subgraph Entry["🚀 App Entry"]
        A[Open App] --> B{Logged In?}
        B -->|No| C[📱 Login Page]
        B -->|Yes| D[📊 Dashboard]
    end

    subgraph Auth["🔐 Authentication"]
        C --> E[Input Coworker ID/Email]
        E --> F[Input Password]
        F --> G[Click LOGIN]
        G --> D
    end

    subgraph Main["📱 Main Navigation"]
        D --> H{User Action}
        H -->|Record| I[📍 Record Page]
        H -->|History| J[📋 History Page]
        H -->|Report| K[📈 Report Page]
        H -->|Profile| L[👤 Profile Page]
    end

    subgraph Actions["⚡ Quick Actions"]
        I --> M[Save Activity]
        M --> D
        J --> N[View Activity Detail]
        K --> O[View Charts]
        L --> P[Logout]
        P --> C
    end

    style Entry fill:#e3f2fd
    style Auth fill:#fff3e0
    style Main fill:#e8f5e9
    style Actions fill:#fce4ec
```

### 2. Activity Recording Process

```mermaid
flowchart TD
    subgraph Input["📝 Input Phase"]
        A[🏠 Dashboard] -->|Click Record Activity| B[📍 Record Page]
        B --> C[📅 Select Date]
        C --> D[📍 Input Starting Point A]
        D --> E[🏁 Input Destination B]
    end

    subgraph Calculate["🧮 Calculation Phase"]
        E --> F[🗺️ Route Preview on Map]
        F --> G[Calculate Distance]
        G --> H[Show Distance & Est. Time]
    end

    subgraph Evidence["📸 Evidence Phase"]
        H --> I[📷 Upload Activity Photo]
        I --> J{Photo Uploaded?}
        J -->|No| K[❌ Show Error Message]
        K --> I
        J -->|Yes| L[✅ Enable Save Button]
    end

    subgraph Save["💾 Save Phase"]
        L --> M[Click SAVE ACTIVITY]
        M --> N[🔄 Saving State]
        N --> O[✅ Success Toast]
        O --> P[🏠 Redirect to Dashboard]
    end

    style Input fill:#e3f2fd
    style Calculate fill:#fff3e0
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

    subgraph State["📦 State Management"]
        C[React useState]
        D[Props Drilling]
    end

    subgraph Data["💾 Data Layer"]
        E[Mock Data]
        F[Local State]
    end

    A --> B
    B --> C
    C --> D
    D --> F
    E --> F
    F --> B

    style UI fill:#e3f2fd
    style State fill:#fff3e0
    style Data fill:#e8f5e9
```

---

## 📱 Page-by-Page Analysis

### 1. Login Page (`/login`)

**Purpose:** Autentikasi pengguna dengan identitas IKEA

**Features:**
- Input Coworker ID / Email
- Input Password dengan visibility toggle
- "Forgot Password" link
- Terms of Service & Privacy Policy links
- Social proof (jumlah coworkers yang sudah join)

**UI Components:**
- Header dengan branding IKEA
- Split layout (Visual + Form) untuk desktop
- Responsive mobile-first design

```mermaid
flowchart TD
    A[Login Page] --> B[Header]
    A --> C[Visual Panel]
    A --> D[Form Panel]
    
    B --> B1[Logo]
    B --> B2[Help Button]
    
    C --> C1[Challenge Badge]
    C --> C2[Hero Text]
    C --> C3[Social Proof]
    
    D --> D1[Welcome Text]
    D --> D2[ID/Email Input]
    D --> D3[Password Input]
    D --> D4[Login Button]
    D --> D5[Terms & Privacy]

    style A fill:#0058a3,color:#fff
    style B fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#e8f5e9
```

---

### 2. Dashboard Page (`/dashboard`)

**Purpose:** Tampilan utama setelah login, menampilkan progress overview

**Features:**
- Greeting personal dengan nama user
- Circular progress ring (yearly: X/150km)
- Monthly status card dengan progress bar
- Quick action button "Record Activity"
- Recent walks list dengan detail singkat

**Components Used:**
- `ProgressRing` - SVG circular progress
- `MonthlyStatus` - Monthly goal card

```mermaid
flowchart TD
    A[Dashboard Page] --> B[Header]
    A --> C[Progress Ring]
    A --> D[Monthly Status]
    A --> E[Record Button]
    A --> F[Recent Walks]
    
    B --> B1[Greeting Text]
    B --> B2[Settings Icon]
    B --> B3[Profile Icon]
    
    C --> C1[SVG Circle 45.2/150km]
    C --> C2[Percentage Badge]
    
    D --> D1[Current Goal Label]
    D --> D2[Month Info]
    D --> D3[Progress Bar]
    D --> D4[Status Badge]
    
    F --> F1[Activity Cards]

    style A fill:#0058a3,color:#fff
    style C fill:#ffdb00
    style D fill:#e3f2fd
```

---

### 3. Record Activity Page (`/record`)

**Purpose:** Input aktivitas jalan kaki baru dengan lokasi A ke B

**Features:**
- Date picker untuk tanggal aktivitas
- Location input A (Starting Point)
- Location input B (Destination)
- Map preview dengan route visualization
- Distance & estimated time calculation
- Photo upload (mandatory) dengan preview
- Save button dengan loading & success states

**State Management:**
- `date` - Selected date
- `photo` - Uploaded photo (base64)
- `status` - 'idle' | 'saving' | 'success'
- `error` - Photo validation error
- `shake` - Animation state for error

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> InputtingLocations: User types
    InputtingLocations --> PhotoRequired: Locations filled
    PhotoRequired --> PhotoUploaded: Upload photo
    PhotoUploaded --> Saving: Click Save
    Saving --> Success: API Success
    Success --> [*]: Redirect to Dashboard
    
    PhotoRequired --> Error: Save without photo
    Error --> PhotoRequired: Clear error
```

---

### 4. History Page (`/history`)

**Purpose:** Menampilkan riwayat semua aktivitas yang tercatat

**Features:**
- Month filter dropdown
- Total distance summary card
- Activity list dengan scroll
- Click activity untuk detail modal
- Loading state saat switch bulan

**Components Used:**
- `MonthSummary` - Total km summary
- `ActivityList` - List container dengan filter
- `ActivityDetailModal` - Slide-up modal

**Data Structure:**
```typescript
interface Activity {
    date: { day: number; month: string };
    title: string;
    duration: string;
    distance: string;
    startPoint: string;
    endPoint: string;
}
```

```mermaid
flowchart TD
    A[History Page] --> B[Header]
    A --> C[MonthSummary]
    A --> D[ActivityList]
    A --> E[ActivityDetailModal]
    
    D --> D1[Month Filter]
    D --> D2[Activity Items]
    D2 --> D3[ActivityItem 1]
    D2 --> D4[ActivityItem 2]
    D2 --> D5[ActivityItem N]
    
    D3 -->|Click| E
    D4 -->|Click| E
    D5 -->|Click| E

    style A fill:#0058a3,color:#fff
    style C fill:#e3f2fd
    style D fill:#fff3e0
    style E fill:#fce4ec
```

---

### 5. Report Page (`/report`)

**Purpose:** Visualisasi data progress dalam bentuk chart

**Features:**
- Year selector dropdown (2024, 2023)
- Yearly goal progress bar dengan percentage
- Monthly distance bar chart (Jan-Dec)
- Cumulative line chart vs target pace
- Statistics grid (Avg/Month, Best Month)
- Remaining km to goal dengan CTA

**Chart Types:**
1. **Linear Progress Bar** - Yearly completion
2. **Bar Chart** - Monthly distance
3. **Line Chart** - Cumulative progress vs target

```mermaid
xychart-beta
    title "Monthly Walking Distance (km) - 2024"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Distance (km)" 0 --> 20
    bar [10, 11, 17, 12, 10, 14, 0, 0, 0, 0, 0, 0]
    line [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5]
```

```mermaid
xychart-beta
    title "Cumulative Progress vs Target - 2024"
    x-axis [Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec]
    y-axis "Total KM" 0 --> 160
    line [10, 21, 38, 50, 60, 85, 85, 85, 85, 85, 85, 85]
    line [12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100, 112.5, 125, 137.5, 150]
```

---

### 6. Profile Page (`/profile`)

**Purpose:** Informasi user, statistik personal, dan pengaturan

**Features:**
- Profile card dengan avatar, nama, dan badges
- Personal statistics (Total KM, Goal Progress, Global Rank)
- Settings toggles (Notifications, Email Digest)
- Navigation links (Help & Support, Privacy & Data)
- Sign Out button

**State Management:**
- `notificationsEnabled` - Notification toggle
- `emailDigestEnabled` - Email digest toggle

```mermaid
flowchart TD
    A[Profile Page] --> B[Header]
    A --> C[Profile Card]
    A --> D[Personal Statistics]
    A --> E[Settings Section]
    A --> F[Sign Out Button]
    
    C --> C1[Avatar Image]
    C --> C2[Name & Team]
    C --> C3[Badges]
    
    D --> D1[Total KM Progress]
    D --> D2[Global Rank]
    
    E --> E1[Notifications Toggle]
    E --> E2[Email Digest Toggle]
    E --> E3[Help & Support Link]
    E --> E4[Privacy & Data Link]
    
    F -->|Click| G[Redirect to Login]

    style A fill:#0058a3,color:#fff
    style C fill:#ffdb00
    style D fill:#e3f2fd
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
        E --> J[ProgressRing]
        E --> K[MonthlyStatus]
    end

    subgraph History_Components["📋 History Components"]
        G --> L[MonthSummary]
        G --> M[ActivityList]
        M --> N[ActivityItem]
        G --> O[ActivityDetailModal]
    end

    subgraph Layout_Components["🎨 Layout Components"]
        C --> P[NavItem x 5]
    end

    style Root fill:#e3f2fd
    style Pages fill:#fff3e0
    style Dashboard_Components fill:#e8f5e9
    style History_Components fill:#fce4ec
    style Layout_Components fill:#f3e5f5
```

### Component Props Interface

```mermaid
classDiagram
    class ProgressRing {
        +number current
        +number target
        +render() JSX
    }
    
    class MonthlyStatus {
        -number current = 8.2
        -number target = 12.5
        +render() JSX
    }
    
    class MonthSummary {
        +number totalDistance
        +number targetDistance
        +string month
        +render() JSX
    }
    
    class ActivityList {
        +Activity[] activities
        +string month
        +function onMonthChange
        +boolean isLoading
        +function onActivityClick
        +render() JSX
    }
    
    class ActivityDetailModal {
        +Activity activity
        +function onClose
        +render() JSX
    }
    
    class BottomNav {
        -NavItem[] navItems
        -string pathname
        +render() JSX
    }

    ActivityList --> ActivityDetailModal : opens
    ProgressRing <|-- MonthSummary : similar pattern
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

### Spacing & Layout

- **Max Width:** 512px (mobile container)
- **Bottom Nav Height:** 64px with padding
- **Page Padding:** 24px horizontal
- **Card Radius:** 24px (rounded-3xl)
- **Button Radius:** Full (rounded-full)

---

## 📊 KPI & Metrics

### Target Calculations

```mermaid
pie title "Progress Breakdown - Example User"
    "Achieved" : 45
    "Remaining" : 105
```

| Metric | Formula | Example |
|--------|---------|---------|
| **Yearly Target** | Fixed | 150 km |
| **Monthly Target** | 150 / 12 | 12.5 km |
| **Progress %** | (current / target) × 100 | (45.2 / 150) × 100 = 30% |
| **Remaining** | target - current | 150 - 45.2 = 104.8 km |

### User Engagement Metrics (Mockup)

| Metric | Value |
|--------|-------|
| Walker Level | Level 5 |
| Global Rank | #12 |
| Rank Change | ↑3 positions |
| Best Month | March 2024 |
| Avg/Month | 12.1 km |

---

## 🔐 Security Considerations

> [!WARNING]
> **Current State:** Aplikasi menggunakan mock data dan tidak memiliki backend/API

### Authentication Flow (Current - Mock)
- Login button langsung redirect ke dashboard
- Tidak ada validasi credentials
- Tidak ada session management

### Recommended Improvements
1. Implement proper authentication (OAuth/JWT)
2. Add protected routes middleware
3. Secure API endpoints
4. Implement rate limiting
5. Add CSRF protection

---

## 🚀 Future Enhancements

### Planned Features (from implementation.md)

1. **Google Maps Integration**
   - Places Autocomplete
   - Route calculation
   - Distance Matrix API

2. **PWA Capabilities**
   - Service Worker
   - Offline support
   - Add to Home Screen

3. **Backend Integration**
   - User database
   - Activity storage
   - Leaderboard API

4. **Advanced Analytics**
   - Weekly/Monthly trends
   - Team statistics
   - Challenge modes

---

## 📝 Summary

**ITDigital Wellbeing Monitor** adalah aplikasi yang well-structured dengan:

✅ **Clean Architecture** - Separation of concerns yang baik antara pages dan components  
✅ **Mobile-First Design** - Responsive dan optimized untuk mobile devices  
✅ **IKEA Branding** - Konsisten dengan design system IKEA (Blue #0058a3, Yellow #FFDB00)  
✅ **Interactive UI** - Animasi, transitions, dan feedback yang smooth  
✅ **Data Visualization** - Progress rings, bar charts, dan line charts  

⚠️ **Limitations** - Masih menggunakan mock data, belum ada backend integration  
⚠️ **No Authentication** - Login flow hanya placeholder  
⚠️ **No Persistence** - Data tidak disimpan antar sesi  

---

*Documentation generated on: January 19, 2026*
