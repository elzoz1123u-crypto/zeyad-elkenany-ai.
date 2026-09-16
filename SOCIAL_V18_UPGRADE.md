# V18 AI + Video Security Upgrade

- AI uses the Responses API with server-side API key, bounded history/input/output, timeout, and `store:false`.
- AI modes: chat, code, debug, explain.
- Quick emoji bar for social/AI messages.
- Removed duplicate unreachable legacy AI endpoint.
- WebRTC call signal validation tightened with identity/size/type/status checks and rate limits.
- Production deployment still requires HTTPS, a real TURN service, restricted origin, secrets outside the repo, and external penetration testing.
