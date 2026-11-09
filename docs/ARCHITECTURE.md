# DengueGuard – Smart Dengue Prevention & Management System
## System Architecture & Technical Specification
### BSc in Computer Science & Engineering — Final Year Capstone Project

---

## 1. Executive Summary & Objective

**DengueGuard** is an enterprise-grade healthcare SaaS platform architected to combat endemic dengue outbreaks in high-density regions (e.g., Bangladesh). The system combines clinical triage decision-support, daily patient vitals and platelet tracking, hospital bed/ICU availability discovery, privacy-preserving emergency blood/platelet donor matching, and district-level epidemiological surveillance.

---

## 2. Core Architectural Pillars

```
+-----------------------------------------------------------------------------------+
|                                 PRESENTATION LAYER                                |
|   Next.js App Router (React 19) + Tailwind CSS + Lucide Icons + Framer Motion    |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  |   Public Portal    |  |  Patient Dashboard   |  |     Doctor Dashboard      |  |
|  | - Hero & Triage    |  | - Daily Temp/Platelet|  | - Appointment Inbox       |  |
|  | - Hospital Finder  |  | - Health Record CBC  |  | - Authorized Record View  |  |
|  | - Blood Donor Hub  |  | - Doctor Appointments|  | - Consultation Notes      |  |
|  | - Live Statistics  |  | - Follow-up Notes    |  | - Triage Protocol Review  |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                        Administrator Command Center                         |  |
|  | - System Overview & Audit Logs       - Hospital & Doctor Verification       |  |
|  | - Dengue Case Verification           - Donor & Public Article Moderation    |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                             APPLICATION & API LAYER                               |
|   Route Handlers (/api/*) + Server Actions + Role-Based Access Control (RBAC)     |
|                                                                                   |
|  [ Auth & JWT Guard ]   [ Input Sanitization (Zod) ]   [ Rate Limiting & Audit ]  |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                              BUSINESS DOMAIN LAYER                                |
|  - Epidemiological Surveillance Service  - Patient Record Access Controller (HIPAA)|
|  - Blood Donor Proximity & Privacy Engine - Hospital Verification & Geospatial Qry |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                               PERSISTENCE LAYER                                   |
|   MongoDB Database Cluster with Mongoose ODM & Strict Schema Validation           |
|                                                                                   |
|  • Users (RBAC)            • PatientProfiles        • DoctorProfiles              |
|  • Hospitals (GeoJSON)     • BloodDonors            • HealthRecords (CBC/Platelet)|
|  • Appointments            • DengueReports          • AwarenessArticles           |
|  • AuditLogs (Compliance)  • RiskAssessments                                      |
+-----------------------------------------------------------------------------------+
```

---

## 3. Directory Structure

```
dengu/
├── app/
│   ├── (auth)/                # Auth layouts, login, registration, password recovery
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/           # Protected role-based dashboards
│   │   ├── patient/           # Patient vitals, CBC records, appointment requests
│   │   ├── doctor/            # Doctor clinical inbox, verified patient records
│   │   └── admin/             # System analytics, user/doctor verifications, audit logs
│   ├── (public)/              # Public-facing informative & service pages
│   │   ├── awareness/         # Dengue transmission, breeding, myth busting
│   │   ├── symptoms/          # Interactive clinical symptom guidance & triage flow
│   │   ├── prevention/        # Home, personal, and community vector control
│   │   ├── hospitals/         # Leaflet-powered hospital & ICU locator
│   │   ├── blood-donors/      # Privacy-first blood & platelet donor hub
│   │   └── statistics/        # Daily/weekly district epidemiological charts
│   ├── api/                   # RESTful Route Handlers with RBAC middleware
│   │   ├── auth/              # Registration, login, session, profile
│   │   ├── records/           # Vitals, CBC, platelet records
│   │   ├── appointments/      # Consultation bookings & approvals
│   │   ├── hospitals/         # Hospital directory & verification
│   │   ├── donors/            # Blood donor registry & contact requests
│   │   └── statistics/        # Aggregated surveillance statistics
│   ├── globals.css            # Medical design tokens, glassmorphism, responsive styles
│   ├── layout.tsx             # Root layout with font stack and metadata
│   └── page.tsx               # DengueGuard landing page
├── components/
│   ├── ui/                    # Base primitives: Button, Card, Badge, Input, Table, Modal
│   ├── common/                # Navbar, Footer, EmergencyBanner, DisclaimerNotice
│   ├── dashboard/             # Dashboard header, sidebar navigation, stat cards
│   ├── charts/                # Recharts platelet curve, district case comparison
│   └── maps/                  # Leaflet map container & medical location markers
├── lib/
│   ├── db/                    # MongoDB Mongoose cached singleton connection
│   ├── auth/                  # JWT token verification, password hashing, session guards
│   ├── constants/             # Bangladesh districts, hotlines, blood groups, triage rules
│   └── utils.ts               # Class merging (cn), date/number formatting helpers
├── models/                    # Mongoose schemas with indexes and validation
│   ├── User.ts
│   ├── PatientProfile.ts
│   ├── DoctorProfile.ts
│   ├── Hospital.ts
│   ├── Appointment.ts
│   ├── HealthRecord.ts
│   ├── BloodDonor.ts
│   ├── DengueReport.ts
│   ├── AwarenessArticle.ts
│   ├── RiskAssessment.ts
│   └── AuditLog.ts
├── services/                  # Encapsulated business logic and analytics
├── validations/               # Zod schemas for request validation
├── types/                     # TypeScript definitions for all domain entities
├── hooks/                     # Custom React hooks (useAuth, useTriage, useGeo)
├── docs/                      # Final year project reports & architecture documents
├── .env.example               # Environment variables template
├── .env.local                 # Local development configuration
└── package.json               # Project manifest and scripts
```

---

## 4. Security, Ethics & Clinical Boundaries

1. **Non-Diagnostic Disclaimer**: The symptom guidance module is explicitly bounded by international clinical guidelines (WHO / DGHS Bangladesh). It categorizes triage into *Self-Monitoring*, *Seek Clinical Evaluation*, and *Urgent Hospitalization Warning Signs* (persistent vomiting, severe abdominal pain, mucosal bleeding, lethargy, rapid platelet drop). It never diagnoses or prescribes prescription drugs.
2. **Patient Data Privacy**: Patient records (CBC reports, platelet counts, temperature) are protected by strict server-side authorization. A doctor can only access a patient's record if an active appointment or explicit patient consent exists.
3. **Donor Privacy Safeguard**: Blood donors' phone numbers are never exposed publicly. Prospective recipients must submit a verified request through the system.
4. **Credential Security**: Passwords are encrypted using salted bcrypt hashing (minimum 10 rounds). Raw credentials are never logged or stored.

