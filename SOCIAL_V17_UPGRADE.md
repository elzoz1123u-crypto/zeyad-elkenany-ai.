# Zeyad Social v17
- WhatsApp-style 24-hour text statuses.
- Sticker picker with preset stickers.
- Moderator-only group with server-side authorization.
- Moderator access code is stored as a scrypt hash in `.env`, never plaintext in frontend.
- `npm run setup:owner -- "OWNER_CODE" owner@email` now derives both owner and moderator hashes from the supplied code.
