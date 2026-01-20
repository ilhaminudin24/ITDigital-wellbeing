# ITDigital Wellbeing Monitor

A specialized wellbeing tracking application for the IT & Digital team at IKEA Indonesia, designed to monitor walking activities, track calories, and manage health targets.

## 🚀 Features

- **Authentication**: Secure login with NIK (Coworker ID) or Email.
- **Profile Management**: Calculate BMR and set personalized yearly calorie targets.
- **Activity Tracking**: Record walking activities with photos, location, and distance.
- **Dashboard**: Real-time progress tracking with visualized statistics.
- **History & Reports**: Detailed activity history and monthly/yearly progress reports.
- **Backend Integration**: Powered by Supabase for Auth, Database, and Storage.

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Deployment**: [Vercel](https://vercel.com/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project setup

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ITDigital-wellbeing
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and fill in your Supabase credentials.
   ```bash
   cp .env.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for server-side scripts)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## 👤 Admin User Provisioning

**Self-registration is disabled.** Users must be provisioned by an admin using the CLI script.

### Provisioning Users

1. Create a CSV file with user data:
   ```csv
   nik,email,name
   12345678,john.doe@ikea.com,John Doe
   87654321,jane.smith@ikea.com,Jane Smith
   ```

2. Set the `SUPABASE_SERVICE_ROLE_KEY` environment variable:
   ```bash
   # Get this from Supabase Dashboard > Settings > API > service_role key
   export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```

3. Run the provisioning script:
   ```bash
   npx ts-node scripts/provision-users.ts scripts/sample-users.csv
   ```

### First-Time Login Flow

1. User logs in with NIK and temporary password `P@ssw0rd`
2. User is prompted to set a new password
3. User completes profile onboarding (weight, height, age, gender)
4. User is redirected to dashboard


## 📦 Database Schema

The application uses the following main tables:
- `user_profiles`: Stores user demographic data and calculated targets.
- `activities`: Stores activity records with photo references.

## 🚢 Deployment

This project is configured for deployment on Vercel.

1. Push your code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the project into Vercel.
3. Configure the **Environment Variables** in Vercel settings with your Supabase keys.
4. Deploy!

## 📄 License

Internal use for IKEA Indonesia IT & Digital Team.
