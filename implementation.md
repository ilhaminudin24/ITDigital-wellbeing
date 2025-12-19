Wellbeing Monitoring App - Frontend Implementation Plan
Aplikasi web mobile-friendly untuk monitoring aktivitas jalan kaki tim IT & Digital IKEA Indonesia dengan target 150km/tahun.

Tech Stack
Teknologi	Kegunaan
Next.js 14	React framework dengan App Router
TypeScript	Type safety
Tailwind CSS	Mobile-first styling
Google Maps API	Kalkulasi jarak titik A ke B
Recharts	Visualisasi data interaktif
PWA	Add to Home Screen capability
User Flow Diagram
No
Yes
Record Activity
View History
View Report
View Profile
Logout
🚀 Open App
Logged In?
📱 Login Page
Input Coworker ID/Email
Login
📊 Dashboard
User Action
📍 Record Page
Input Point A
Input Point B
Calculate Distance
Save Activity
📋 History Page
Browse Activities
📈 Report Page
View Charts
👤 Profile Page
Logout
Page Navigation Flow
📱 Bottom Navigation Bar
After Login
🏠 Home
➕ Record
📋 History
📈 Report
👤 Profile
Dashboard Page
Record Activity Page
History Page
Report Page
Profile Page
Login Page
ASCII Wireframes
1. Login Page
┌─────────────────────────────────┐
│         ═══════════════         │
│              IKEA               │
│         ═══════════════         │
│                                 │
│      🏃 Wellbeing Monitor       │
│         IT & Digital            │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📧 Coworker ID / Email  │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔑 Password             │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │        🔐 LOGIN         │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
2. Dashboard Page
┌─────────────────────────────────┐
│ 👋 Halo, Ilham!          ⚙️👤   │
├─────────────────────────────────┤
│                                 │
│     ╭─────────────────────╮     │
│     │    ╭───────────╮    │     │
│     │   ╱    45.2    ╲   │     │
│     │  │      KM      │  │     │
│     │   ╲   / 150    ╱   │     │
│     │    ╰───────────╯    │     │
│     │      30% Complete   │     │
│     ╰─────────────────────╯     │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📅 December 2024        │    │
│  │ ━━━━━━━━━━░░░░ 8.2/12.5km   │
│  │ 🔵 IN PROGRESS          │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │    ➕ Record Activity   │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  🏠    ➕    📋    📈    👤    │
└─────────────────────────────────┘
3. Record Activity Page (A to B)
┌─────────────────────────────────┐
│ ← Record Activity               │
├─────────────────────────────────┤
│                                 │
│  📍 Starting Point (A)          │
│  ┌─────────────────────────┐    │
│  │ IKEA Alam Sutera        │ 📍 │
│  └─────────────────────────┘    │
│              │                  │
│              ▼                  │
│  🏁 Destination (B)             │
│  ┌─────────────────────────┐    │
│  │ BSD Green Office Park   │ 📍 │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  ┌───────────────────┐  │    │
│  │  │    🗺️ MAP         │  │    │
│  │  │                   │  │    │
│  │  │    A ----→ B      │  │    │
│  │  │                   │  │    │
│  │  └───────────────────┘  │    │
│  └─────────────────────────┘    │
│                                 │
│       🚶 Distance: 2.4 km       │
│       ⏱️ Est. Time: 30 min      │
│                                 │
│  ┌─────────────────────────┐    │
│  │      💾 SAVE ACTIVITY   │    │
│  └─────────────────────────┘    │
├─────────────────────────────────┤
│  🏠    ➕    📋    📈    👤    │
└─────────────────────────────────┘
4. History Page
┌─────────────────────────────────┐
│ 📋 Activity History             │
├─────────────────────────────────┤
│  🔍 Filter: [December 2024 ▼]   │
│  Total: 8.2 km                  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📅 18 Dec 2024          │    │
│  │ IKEA → BSD Green Office │    │
│  │ 🚶 2.4 km               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📅 15 Dec 2024          │    │
│  │ Stasiun MRT → Kantor    │    │
│  │ 🚶 1.8 km               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📅 12 Dec 2024          │    │
│  │ Mall → Apartemen        │    │
│  │ 🚶 2.1 km               │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📅 08 Dec 2024          │    │
│  │ Taman Kota → Rumah      │    │
│  │ 🚶 1.9 km               │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  🏠    ➕    📋    📈    👤    │
└─────────────────────────────────┘
5. Report Page
┌─────────────────────────────────┐
│ 📈 Progress Report              │
├─────────────────────────────────┤
│  📅 Year: [2024 ▼]              │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📊 Monthly Distance (Bar)│    │
│  │                         │    │
│  │ 15├─────────────────────│    │
│  │   │      ╭──╮ TARGET LINE│   │
│  │ 12├══════╪══╪═══════════│    │
│  │   │╭──╮  │  │     ╭──╮  │    │
│  │  9├┤  ├──┤  ├──╮  │  │  │    │
│  │   ││  │  │  │  │  │  │  │    │
│  │  6├┤  │  │  │  │  │  │  │    │
│  │   ││  │  │  │  │  │  │  │    │
│  │  0└┴──┴──┴──┴──┴──┴──┴──│    │
│  │   Jan Feb Mar Apr .. Dec│    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📈 Cumulative (Line)    │    │
│  │                         │    │
│  │150├─────────────TARGET 🎯│    │
│  │   │              ╱──────│    │
│  │100├─────────────╱───────│    │
│  │   │         ╱──╱        │    │
│  │ 50├────────╱────────────│    │
│  │   │     ╱╱              │    │
│  │  0└────╱────────────────│    │
│  │   Jan Feb Mar Apr .. Dec│    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────┬───────────┐    │
│  │ Total       │ 45.2 km   │    │
│  │ Avg/Month   │ 11.3 km   │    │
│  │ Best Month  │ Feb (14km)│    │
│  │ Achieved    │ 3/12      │    │
│  └─────────────┴───────────┘    │
│                                 │
├─────────────────────────────────┤
│  🏠    ➕    📋    📈    👤    │
└─────────────────────────────────┘
6. Profile Page
┌─────────────────────────────────┐
│ 👤 User Profile                 │
├─────────────────────────────────┤
│                                 │
│      ╭───────────────╮          │
│      │    ( O )      │          │
│      │               │          │
│      │  Ahmad F.     │          │
│      │  IT Dept      │          │
│      ╰───────────────╯          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📊 My Statistics        │    │
│  │ Total: 45.2 km          │    │
│  │ Rank: #5 this month     │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ⚙️ Settings             │    │
│  ├─────────────────────────┤    │
│  │ 🔔 Notifications    [ON]│    │
│  ├─────────────────────────┤    │
│  │ ❓ Help & Support       │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │      🚪 LOGOUT          │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│  🏠    ➕    📋    📈    👤    │
└─────────────────────────────────┘
Component Architecture
Next.js App
Profile Components
Report Components
History Components
Record Components
Dashboard Components
Shared Components
Pages
ProfileHeader
RootLayout
Header
BottomNav
DashboardPage
ProgressRing
MonthlyStatus
RecordPage
LocationInput
RoutePreview
HistoryPage
ActivityCard
ReportPage
MonthlyBarChart
CumulativeLineChart
StatsCard
ProfilePage
SettingsList
LoginPage
User Review Required
IMPORTANT

Google Maps API Key diperlukan untuk fitur kalkulasi jarak. Apakah sudah ada API key yang siap digunakan?

IMPORTANT

Backend/Database: Plan ini fokus pada frontend saja. Untuk MVP, apakah akan menggunakan mock data terlebih dahulu atau sudah ada backend API yang siap?

Proposed Changes
Project Initialization
[NEW] 

package.json
Initialize Next.js 14 dengan TypeScript
Dependencies: tailwindcss, recharts, @react-google-maps/api
[NEW] 

tailwind.config.ts
Konfigurasi mobile-first breakpoints
Custom color palette (IKEA brand colors: blue #0058A3, yellow #FFDB00)
[NEW] 

next.config.js
PWA configuration dengan next-pwa
PWA Configuration
[NEW] 

public/manifest.json
App name, icons, theme color
Display: standalone untuk native app feel
[NEW] 

public/icons/
App icons (192x192, 512x512)
Core Layout Components
[NEW] 

src/components/layout/BottomNav.tsx
Fixed bottom navigation bar
Icons: Home, Add, History, Report, Profile
Active state indicator
[NEW] 

src/components/layout/Header.tsx
App header dengan logo
User profile avatar
[NEW] 

src/app/layout.tsx
Root layout dengan BottomNav
PWA meta tags
Page: Login & Authentication
[NEW] 

src/app/login/page.tsx
Form input: Coworker ID / Email IKEA
Password field
Login button dengan loading state
IKEA branding (khusus IT & Digital)
Page: Main Dashboard
[NEW] 

src/app/page.tsx
Greeting dengan nama user
Annual Progress Card
Monthly Status Card
Quick action buttons
[NEW] 

src/components/dashboard/ProgressRing.tsx
Circular progress indicator (0/150km)
Animated fill berdasarkan persentase
Kilometer counter di tengah
[NEW] 

src/components/dashboard/MonthlyStatus.tsx
Status badge: "Achieved" (green) / "In Progress" (blue)
Target vs actual km
Days remaining in month
Page: Input Aktivitas (A to B Recording)
[NEW] 

src/app/record/page.tsx
Form input lokasi A dan B
Map preview
Calculated distance display
Save button
[NEW] 

src/components/record/LocationInput.tsx
Google Places Autocomplete
Current location button (optional)
Clear input button
[NEW] 

src/components/record/RoutePreview.tsx
Google Maps embed dengan route polyline
Walking directions
[NEW] 

src/lib/maps.ts
Google Maps API integration
Distance Matrix API untuk kalkulasi jarak
Utility functions
Page: Review & History
[NEW] 

src/app/history/page.tsx
List aktivitas dengan infinite scroll
Filter by month/date range
Total km accumulated
[NEW] 

src/components/history/ActivityCard.tsx
Tanggal aktivitas
Route: "Titik A → Titik B"
Jarak dalam km
Edit/Delete actions (optional)
Page: Interactive Report
[NEW] 

src/app/report/page.tsx
Monthly bar chart + cumulative line chart
Year selector
Summary statistics
[NEW] 

src/components/report/MonthlyBarChart.tsx
Recharts BarChart untuk jarak per bulan
Target line (12.5km/bulan) overlay
Interactive tooltips
Responsive untuk mobile
[NEW] 

src/components/report/CumulativeLineChart.tsx
Recharts LineChart untuk progress kumulatif
Line: Total km vs target 150km
Area fill gradient
Interactive tooltips
[NEW] 

src/components/report/StatsCard.tsx
Total km walked
Months achieved target
Average km/month
Best month
Page: User Profile
[NEW] 

src/app/profile/page.tsx
User info display (Avatar, Name, Dept)
Statistics summary
Settings list
Logout action
[NEW] 

src/components/profile/ProfileHeader.tsx
Avatar branding
User details
[NEW] 

src/components/profile/SettingsList.tsx
Toggle toggle switches for preferences
Navigation links for support
State Management & Types
[NEW] 

src/types/index.ts
interface User {
  id: string;
  name: string;
  email: string;
  department: 'IT' | 'Digital';
}
interface Activity {
  id: string;
  userId: string;
  pointA: Location;
  pointB: Location;
  distanceKm: number;
  date: Date;
}
interface Location {
  address: string;
  lat: number;
  lng: number;
}
[NEW] 

src/lib/mockData.ts
Sample user data
Sample activities untuk development
KPI calculation helpers
Folder Structure
ITDigital-wellbeing/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── login/page.tsx
│   │   ├── record/page.tsx
│   │   ├── history/page.tsx
│   │   ├── report/page.tsx
│   │   └── profile/page.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── record/
│   │   ├── history/
│   │   ├── report/
│   │   └── profile/
│   ├── lib/
│   │   ├── maps.ts
│   │   └── mockData.ts
│   └── types/
│       └── index.ts
├── tailwind.config.ts
├── next.config.js
└── package.json
UI/UX Design Guidelines
Mobile-First Approach
Max-width: 100vw (full mobile)
Bottom navigation: 64px height
Touch targets: minimum 44x44px
Safe area padding untuk notch devices
Animations
Page transitions: slide horizontally
Progress bar: animated fill
Cards: subtle hover/tap effects
Verification Plan
Development Testing
# Run development server
npm run dev
# Access at http://localhost:3000
Manual Verification Checklist
Mobile Responsiveness

Buka di Chrome DevTools → Toggle Device Toolbar
Test pada viewport: iPhone SE, iPhone 14, Pixel 7
PWA Installation

Build production: npm run build
Serve: npm run start
Buka di mobile browser → "Add to Home Screen"
Verify icon muncul dan app opens standalone
Navigation Flow

Login → Dashboard → Record → History → Report
Bottom nav active state sesuai page
Google Maps Integration

Input 2 lokasi berbeda
Verify route ditampilkan
Verify jarak dihitung (km)