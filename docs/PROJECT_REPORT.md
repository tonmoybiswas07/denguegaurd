# DENGUEGUARD: SMART DENGUE PREVENTION & MANAGEMENT SYSTEM
## Final Year Project Report — BSc in Computer Science & Engineering
**Academic Year:** 2024–2025  
**Discipline:** Computer Science & Engineering (CSE)  
**Specialization:** Full-Stack Web Development, Medical Informatics, Healthcare Systems

---

## Abstract

Dengue fever has emerged as one of the most pressing recurring public health emergencies in tropical developing nations, particularly in Bangladesh where urban density exacerbates vector transmission. During severe outbreaks, the healthcare system experiences critical bottlenecks: delayed clinical triage during the 24–48 hour "critical plasma leakage phase", acute shortages of ICU and hospital beds, panic-induced demands for platelet transfusions, and fragmentation of donor discovery networks. 

This project presents **DengueGuard**, a modern, full-stack, cloud-native healthcare software system architected to tackle these challenges. The system features:
1. An evidence-based **Clinical Symptom Guidance Engine** that stratifies patients into triage tiers without making unsupported medical claims.
2. A **Longitudinal Patient Health Tracker** allowing daily fever, hematocrit, and platelet curve monitoring.
3. A **Geo-enabled Hospital & Bed Locator** integrating OpenStreetMap/Leaflet to track dedicated dengue ward capacity.
4. A **Privacy-Preserving Blood & Platelet Donor Network** preventing unauthorized scraping of volunteer telephone numbers.
5. An **Epidemiological Surveillance Dashboard** visualizing district-wise caseloads and clinical correlation curves.

---

## 1. Introduction & Motivation

### 1.1 The Clinical Challenge
Dengue virus (DENV-1 through DENV-4) exhibits a biphasic clinical course:
- **Febrile Phase (Days 1–3):** High temperature, headache, retro-orbital eye pain, and body aches.
- **Critical Phase (Days 3–7):** Fever abruptly subsides, but capillary permeability leads to plasma leakage, hematocrit hemoconcentration, and sharp platelet depletion. Most fatal complications occur during this phase.
- **Recovery Phase (Days 7–10):** Resorption of fluids and platelet rebound.

Lack of patient education frequently causes individuals to seek clinical aid too late, while hospitals become overwhelmed with non-critical patients.

### 1.2 Engineering Objectives
- Build a responsive, accessible, high-performance web platform utilizing Next.js App Router (React 19) and Tailwind CSS.
- Implement strict multi-role Server-Side Authorization (RBAC) ensuring patients only access their own records, and doctors only inspect records of assigned patients.
- Architect a resilient MongoDB data model with Mongoose indexes and geospatial 2dsphere queries.
- Adhere strictly to medical software ethics: zero drug prescriptions, clear disclaimers, and donor privacy safeguards.

---

## 2. System Architecture & Tech Stack

```
+---------------------------------------------------------------+
|                       CLIENT LAYER                            |
| Next.js App Router, Tailwind CSS, Lucide Icons, Recharts,     |
| Leaflet (Dynamic Client SSR-safe), Framer Motion              |
+-------------------------------+-------------------------------+
                                │ HTTPS / REST / JSON
                                ▼
+---------------------------------------------------------------+
|                    SERVER / API LAYER                         |
| Next.js Route Handlers, JWT Verification, RBAC Middleware,   |
| Salted Bcrypt Password Hashing, Zod Validation Schemas        |
+-------------------------------+-------------------------------+
                                │ Mongoose Connection Pool
                                ▼
+---------------------------------------------------------------+
|                     DATABASE LAYER                            |
| MongoDB with Schemas: Users, PatientProfiles, DoctorProfiles,  |
| Hospitals, Appointments, HealthRecords, BloodDonors, AuditLogs|
+---------------------------------------------------------------+
```

---

## 3. Security, Ethical & Privacy Safeguards

1. **Patient Data Confidentiality:** All patient health records (temperature curves, platelet counts, CBC reports) are strictly protected by server-side authorization. Unauthorized access attempts trigger automated entries in `AuditLog`.
2. **Donor Privacy Shield:** Blood and platelet donors' phone numbers are filtered out of public queries (`select: false`). Direct contact requests are transmitted via encrypted relay.
3. **Medical Disclaimer Enforcement:** In accordance with WHO guidelines, DengueGuard provides automated triage guidance and does NOT formulate clinical diagnoses or prescribe medication.

---

## 4. Evaluation & Results

The system was evaluated against unit, integration, and security test suites (`/api/tests`):
- Password hashing & salt resistance: Verified (10-round bcrypt).
- JWT claims integrity: Verified.
- Input validation: Verified using Zod schemas.
- Build performance: Verified with Next.js Turbopack compiler (0 warnings, 0 errors).

