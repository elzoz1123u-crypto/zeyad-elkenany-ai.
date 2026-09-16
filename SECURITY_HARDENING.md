# Zeyad Elkenany AI — Security Hardening

This build prioritizes application security over game-score flexibility.

## Implemented
- Bearer session tokens are SHA-256 hashed before persistence in SQLite.
- Owner console requires both the owner role and a dedicated owner session.
- Session lifetime is bounded and old sessions are trimmed per account.
- Passwords remain scrypt-hashed and are capped at 128 characters.
- Request body and call-signaling payload sizes are bounded.
- HTTP method allow-list returns 405 for unsupported methods.
- Security headers: CSP, frame protections, Referrer-Policy, Permissions-Policy, nosniff, COOP/CORP; optional HSTS via `FORCE_HSTS=1`.
- CORS preflight only allows the exact `ALLOWED_ORIGIN` instead of `*`.
- WebRTC signaling checks call membership and target participant.
- AI calls have a timeout and existing AI rate limiting remains enabled.
- Security Shield game uses server-issued, expiring, one-time challenges. The client does not submit arbitrary score values for this game.
- Security smoke test added: `npm run security:smoke`.
- Dependency audit checked with `npm audit --omit=dev --audit-level=high` and reported 0 vulnerabilities in the packaged dependency tree.

## Deployment requirements
1. Run behind HTTPS.
2. Set `FORCE_HSTS=1` only when HTTPS is actually enforced.
3. Set `ALLOWED_ORIGIN` to the exact production origin.
4. Set `TRUST_PROXY=1` only when the reverse proxy is trusted and correctly configured.
5. Configure a real TURN server for reliable WebRTC traversal.
6. Keep `.env` outside source control and rotate any credentials that may have been exposed.
7. Run `npm run security:smoke` after deployment.

## Important limitation
No software can honestly be called absolutely attack-proof without a real production penetration test, infrastructure review, dependency monitoring, and ongoing patching. This build hardens the application layer substantially and adds a server-verified security game, but production security still depends on HTTPS, reverse-proxy configuration, secrets, hosting, database backups, and operational controls.
