# DengueGuard – Deployment & Infrastructure Guide
## BSc CSE 4th-Year Final Project

---

## 1. Hosting Architecture Overview

DengueGuard is optimized for production deployment on **Vercel** with a **MongoDB Atlas** managed cloud database.

```
       +-----------------------+
       |   Internet / Users    |
       +-----------+-----------+
                   │ HTTPS (TLS 1.3)
                   ▼
       +-----------------------+
       |   Vercel Edge Network | (Global CDN, Security Headers)
       +-----------+-----------+
                   │
                   ▼
       +-----------------------+
       | Next.js App Router    |
       | Serverless Execution  |
       +-----------+-----------+
                   │ Mongoose Connection Pool (TLS)
                   ▼
       +-----------------------+
       |   MongoDB Atlas       | (Primary + Secondary Replicas)
       +-----------------------+
```

---

## 2. Environment Variables Configuration

In Vercel Project Settings > **Environment Variables**, configure:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://<user>:<pwd>@cluster0.mongodb.net/dengueguard?retryWrites=true&w=majority` | MongoDB Atlas Connection String |
| `JWT_SECRET` | `openssl rand -base64 32` | 256-bit cryptographically secure key |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Session secret |
| `NEXT_PUBLIC_APP_URL` | `https://dengueguard.vercel.app` | Production URL |
| `ADMIN_DEFAULT_EMAIL` | `admin@dengueguard.org` | Initial Admin Account |
| `ADMIN_DEFAULT_PASSWORD`| `Admin@DengueGuard2025!` | Initial Admin Password |

---

## 3. Database Initialization (Seeding)

Once deployed, trigger the automatic database seed endpoint:
```bash
curl -X GET https://dengueguard.vercel.app/api/seed
```
This populates:
- Verified Administrative Account
- Verified Senior Consultant Physician Profile
- Sample Patient Profile with 3-day CBC / Platelet Curve
- 10 Verified Hospitals with GeoJSON Coordinates across Bangladesh
- 8 Verified Blood & Platelet Donors
- WHO & DGHS Awareness Bulletins

---

## 4. Production Checklist

- [x] Strict Content Security Policy & X-Frame-Options headers configured in `next.config.ts`.
- [x] Donor phone numbers strictly excluded from public queries (`select: false`).
- [x] Server-side role authorization guards enforcing patient data isolation.
- [x] Turbopack SSR optimized with dynamic Leaflet map loading.

