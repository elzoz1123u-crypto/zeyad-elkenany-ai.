# Production security checklist

1. Copy `.env.example` to `.env` on the server only; never commit or ship the real `.env`.
2. Set `NODE_ENV=production` and a single trusted `ALLOWED_ORIGIN` such as `https://your-domain.example`.
3. Terminate TLS at a reverse proxy (recommended) and set `TRUST_PROXY=1` + `FORCE_HSTS=1`, or configure `HTTPS_KEY` and `HTTPS_CERT` for direct TLS.
4. Use a real TURN service for WebRTC. Put short-lived/rotated TURN credentials in the environment; never hard-code them in the client.
5. Run the app under a dedicated OS user. Keep `data/` and `backups/` outside the public directory and with restrictive permissions.
6. Schedule `npm run backup` and retain encrypted/off-host backups. Test restoration regularly.
7. Do not expose port 3000 directly to the Internet when using a TLS reverse proxy; firewall it to localhost/private network.
8. Run `npm audit` and `npm run security:smoke` after deployment.
9. Rotate owner/designer secrets if they were ever placed in a distributed archive or source repository.
10. Do not claim that client-side game scores are cryptographically provable; the server now caps each run's total score and coins, but full anti-cheat requires server-authoritative game simulation.


## AI integration
- `OPENAI_API_KEY` is server-side only; never put it in frontend code.
- AI requests are authenticated, rate-limited, size-limited, and logged without storing prompt text.
- The Responses API is called with `store:false` for these requests.
- Configure `OPENAI_MODEL` explicitly in production.

## Video calls
- WebRTC media uses browser-managed DTLS-SRTP encryption in transit; signaling is still handled by the application server.
- Use HTTPS in production and configure TURN credentials via environment variables for users behind restrictive NATs.
- Signaling payloads are size/type validated and rate limited.
