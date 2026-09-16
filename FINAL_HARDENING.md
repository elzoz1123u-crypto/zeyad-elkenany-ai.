# Zeyad Elkenany AI ARCADE — Final Hardening

## What changed
- Stronger password policy: minimum 10 chars with letters and numbers.
- Session cleanup and explicit logout-all endpoint.
- Secure password-change flow that revokes existing sessions and issues a fresh session.
- Global request-size guard and bounded message/AI payloads.
- Persistent SQLite rate limiting retained for restart-safe throttling.
- Strict authentication on protected API routes.
- Owner login remains server-side; owner code is never shipped to the browser.
- WebRTC signaling is restricted to the two call participants.
- Avatar uploads accept only PNG/JPEG/WebP data URLs and enforce size limits.
- Static-file path resolution hardened against traversal.
- Security headers strengthened, including DENY framing, no-sniff, no-store API responses, referrer and permissions policies.
- Graceful shutdown/checkpoint handling for SQLite.
- Existing Security Shield game kept server-verified and one-time per challenge.
- Account UI now exposes password change and "logout all devices" controls.

## Verification
- `node --check server.js` — PASS
- `npm audit --omit=dev --audit-level=high` — 0 vulnerabilities
- `node scripts/security-smoke.js` — PASS

## Production checklist
1. Use HTTPS.
2. Set `ALLOWED_ORIGIN` to the exact production origin.
3. Keep `OWNER_EMAIL` and owner code hashes only in server environment variables.
4. Set `FORCE_HSTS=1` only when HTTPS is correctly configured.
5. Configure a TURN service for reliable WebRTC behind restrictive NATs.
6. Put the app behind a reverse proxy/WAF with connection and request limits.
7. Back up `data/zeyad.sqlite` securely and restrict filesystem permissions.
8. Run a real external penetration test before handling sensitive production data.
