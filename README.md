# Zeyad Elkenany AI — Arcade 17.1

منصة تفاعلية تجمع الذكاء الاصطناعي، الحسابات، الشات، مكالمات WebRTC، الألعاب، الموسيقى والأدوات.

## التشغيل

يتطلب Node.js 22.5+.

```bash
npm install
npm start
```

افتح `http://localhost:3000`.

## إعداد المالك

لا تضع كود المالك داخل الواجهة أو Git. أنشئ إعدادًا محليًا:

```bash
npm run setup:owner -- "YOUR_OWNER_CODE" owner@example.com
```

السكربت ينشئ `.env` ويخزن الـcode كـscrypt hash، ويقصر دخول المالك على البريد المحدد في `OWNER_EMAIL`.

## الذكاء الاصطناعي

للتشغيل الفعلي لخدمة AI، أضف `OPENAI_API_KEY` و`OPENAI_MODEL` إلى `.env`. بدون المفتاح، التطبيق لا يدّعي أن الذكاء الحقيقي يعمل؛ يعرض رسالة إعداد واضحة.

## المكالمات

المكالمات تستخدم WebRTC مع STUN. في النشر الحقيقي أضف TURN server موثوق عبر تعديل إعدادات `RTCPeerConnection` في `zeyad_chat_v16.js`، لأن بعض الشبكات لا تسمح باتصال P2P مباشر.

## ملاحظات أمان

- كلمات المرور تستخدم `scrypt` مع salt عشوائي.
- جلسات الدخول لها مدة محددة ويتم تنظيف المنتهية.
- Owner login مقيد بالبريد + hash للكود + rate limiting.
- الرسائل والمكالمات تتحقق من أطراف العملية.
- نتائج الألعاب لها حدود، وrate limit زمني لمنع الإرسال المتكرر. لا يعتبر هذا نظامًا مضادًا للغش بالكامل؛ التحقق التنافسي الكامل يحتاج إعادة احتساب النتيجة على الخادم.
- ملفات `.env` وقاعدة البيانات مستبعدة من Git.


## v18 Production hardening
- Keep `.env` private; never commit it.
- Set `ALLOWED_ORIGIN` when the frontend is served from another origin.
- Set `TRUST_PROXY=1` only when a trusted reverse proxy overwrites `X-Forwarded-For`.
- Configure `TURN_URLS`, `TURN_USERNAME`, and `TURN_CREDENTIAL` for reliable WebRTC across restrictive NATs.
- Game scores are server-recorded per authenticated run, capped per game/run, and rate-limited; client-side games cannot provide cryptographic proof of every frame, so competitive anti-cheat should use an authoritative game server if required.
- Reviews are queued as `pending` rather than being published immediately.
- Use HTTPS in production.


## Security hardening
- Session tokens are stored hashed (SHA-256) in SQLite; the raw bearer token is not persisted.
- Owner console requires a dedicated owner session in addition to the owner role.
- Passwords are scrypt-hashed and capped at 128 characters to limit abuse.
- Login/POST requests are rate-limited and request bodies are size-limited.
- Security headers include CSP, frame protections, Referrer-Policy, Permissions-Policy and optional HSTS.
- WebRTC signaling is restricted to call participants and signaling payloads are capped.
- The Security Shield game validates its answer server-side; the client cannot submit arbitrary points for it.
- Run `npm audit --omit=dev --audit-level=high` before deployment.
- Set `FORCE_HSTS=1`, a specific `ALLOWED_ORIGIN`, and real TURN credentials when deploying behind HTTPS.
