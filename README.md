# DengueGuard – Smart Dengue Prevention & Management System
### BSc in Computer Science & Engineering — Final Year Capstone Project

**DengueGuard** is a full-stack, enterprise-grade healthcare SaaS web application engineered to address epidemic dengue outbreaks through real-time surveillance, clinical symptom triage, verified hospital bed tracking, and privacy-preserving blood/platelet donor discovery.

---

## 🌟 Key Features

1. **Public Health Portal**:
   - **Interactive Symptom Evaluator**: Staged triage assessment based on illness day, warning signs (abdominal pain, mucosal bleeding, persistent vomiting), and CBC platelet levels.
   - **Hospital & Bed Locator**: Geo-enabled Leaflet map with real-time dengue general bed and ICU counts.
   - **Privacy-Preserving Blood Donor Network**: Connects verified donors without exposing telephone numbers to public scrapers.
   - **Epidemiological Surveillance**: Interactive Recharts tracking monthly caseloads, district comparisons, and clinical hemodynamic curves.
   - **Dengue Awareness & Myths vs Facts**: Educational modules in alignment with WHO and DGHS Bangladesh guidelines.

2. **Patient Dashboard (`/patient`)**:
   - Daily body temperature and symptom logger.
   - Platelet count & CBC laboratory tracking with interactive recovery charts.
   - Critical thrombocytopenia alerts (<50,000/μL).
   - Doctor consultation booking and follow-up notes inbox.

3. **Doctor Dashboard (`/doctor`)**:
   - Appointment request queue with Accept/Decline workflows.
   - Authorized patient health record inspection (longitudinal CBC reports).
   - Follow-up instructions and clinical guidance desk.

4. **Administrator Command Center (`/admin`)**:
   - Platform metrics overview (Patients, Doctors, Hospitals, Reports).
   - Doctor verification desk (BMDC registration checks).
   - Hospital and donor management.
   - Security and compliance audit log viewer.

---

## 🛠 Technology Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui primitives
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Database & ODM**: MongoDB + Mongoose (with cached singleton connection)
- **Authentication**: JWT Sessions + Salted Bcrypt Hashing + Role-Based Access Control (RBAC)
- **Data Visualization**: Recharts (Dynamic Responsive SVG)
- **Geospatial & Maps**: Leaflet + OpenStreetMap (SSR-safe dynamic loading)
- **Validation**: Zod schema validation

---

## 🚀 Quick Start Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/dengu.git
cd dengu
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Ensure your MongoDB connection string is set in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/dengueguard
JWT_SECRET=super-secret-dengueguard-jwt-token-key-change-in-production-2025
```

### 3. Initialize / Seed the Database
Run the development server:
```bash
npm run dev
```
Visit `http://localhost:3000/api/seed` in your browser (or click **"Initialize Seed DB"** on the admin console) to automatically populate initial verified doctors, patients, hospitals, donors, and surveillance data.

---

## 🔑 Demo Login Credentials (For Evaluation & Defense)

| Role | Email | Password | Dashboard Route |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@dengueguard.org` | `Admin@DengueGuard2025!` | `/admin` |
| **Doctor** | `doctor@dengueguard.org` | `Doctor@DengueGuard2025!` | `/doctor` |
| **Patient** | `patient@dengueguard.org` | `Patient@DengueGuard2025!` | `/patient` |

*(Note: The login page includes 1-click credential auto-fill buttons for rapid review).*

---

## 🧪 Security & Logic Test Suite

Run the built-in automated test suite:
- Endpoint: `http://localhost:3000/api/tests`
- Verifies: Password hashing, JWT claims, Zod validation, and clinical triage rules.

---

## 📂 Project Structure

```
dengu/
├── app/
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── (dashboard)/        # Role-based Dashboards (patient, doctor, admin)
│   ├── (public)/           # Public Pages (home, awareness, symptoms, prevention, hospitals, donors, stats)
│   └── api/                # RESTful API Route Handlers
├── components/
│   ├── common/             # Navbar, Footer, EmergencyBanner, MedicalDisclaimer
│   ├── dashboard/          # Dashboard Header, Sidebar, StatCards
│   ├── maps/               # Leaflet HospitalMap component
│   └── ui/                 # Reusable UI primitives (Button, Card, Badge, Input)
├── lib/
│   ├── auth/               # JWT token utilities & RBAC middleware
│   ├── constants/          # Bangladesh districts, hotlines, blood groups
│   ├── data/               # Seed & mock datasets
│   ├── db/                 # Mongoose connection & database seed script
│   └── test-suite.ts       # Security & logic verification test suite
├── models/                 # 11 Mongoose Data Models with indexes & validation
├── validations/            # Zod validation schemas
├── types/                  # TypeScript interface definitions
└── docs/                   # Thesis documentation & deployment guides
```

---

## ⚖️ Clinical Disclaimer

DengueGuard provides automated triage decision-support and surveillance intelligence for educational and assistive purposes only. It does NOT formulate definitive clinical diagnoses or prescribe medication. In the event of emergency warning signs (fever >103°F, persistent vomiting, severe abdominal pain, or mucosal bleeding), patients must immediately seek accredited hospital emergency care.
