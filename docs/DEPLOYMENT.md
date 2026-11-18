# Deploy DengueGuard

Use a Node.js deployment with MongoDB. Build with `npm ci` and `npm run build`. For a self-hosted installation, run `npm start` behind HTTPS.

## Production configuration

- Set `MONGODB_URI` in the hosting environment to a dedicated production database. Use a database that has never been seeded with demo accounts or records.
- Generate a unique `JWT_SECRET` with `openssl rand -base64 32` and store it in the hosting environment. Rotating the secret invalidates existing sessions.
- Keep local and production environment files separate and outside version control.
- Use HTTPS so browsers can send the secure session cookie.

The production app uses email and password sign-in. Social sign-in, demo seeding, and the demo test endpoint are disabled. Email password recovery is unavailable.

## Create the first admin

From a trusted machine with Node.js 22.18 or later and network access to the production database, set `MONGODB_URI`, `ADMIN_DEFAULT_EMAIL`, and `ADMIN_DEFAULT_PASSWORD` in the process environment. Optionally set `ADMIN_DEFAULT_NAME`. Use a unique password with at least 16 characters and at most 72 bytes.

```sh
node scripts/create-admin.mjs
```

The command creates one verified admin and refuses to reuse an existing email. Keep the bootstrap password out of the application hosting configuration.

## Verify the hosted release

- Confirm the public pages load over HTTPS and that sign-in works.
- With test accounts, verify patient record access, doctor approval and confirmed-appointment permissions, and administrator access.
- Register a test donor, approve it in the admin dashboard, and confirm that the public listing excludes the phone number.
- Populate the hospital registry with verified records and check that listed contact and bed information is accurate.
- Keep real patient data out of the deployment until the clinical content, privacy controls, operational safeguards, and access policies have been reviewed for the intended use. The statistics page uses a sample dataset.
