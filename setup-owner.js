import crypto from 'node:crypto';
import fs from 'node:fs';
const code=process.argv[2], email=String(process.argv[3]||'').trim().toLowerCase(), designerCode=process.argv[4]||'Zezo7230722s';
if(!code||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){console.error('Usage: npm run setup:owner -- "YOUR_OWNER_CODE" owner@email.com');process.exit(1)}
const salt=crypto.randomBytes(16).toString('hex');
const hash=crypto.scryptSync(code,salt,64).toString('hex');
const moderatorSalt=crypto.randomBytes(16).toString('hex');
const moderatorHash=crypto.scryptSync(designerCode,moderatorSalt,64).toString('hex');
const env=`PORT=3000\nOWNER_EMAIL=${email}\nOWNER_CODE_SALT=${salt}\nOWNER_CODE_HASH=${hash}\nMODERATOR_CODE_SALT=${moderatorSalt}\nMODERATOR_CODE_HASH=${moderatorHash}
DESIGNER_CODE_SALT=${moderatorSalt}
DESIGNER_CODE_HASH=${moderatorHash}\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-4o-mini\nALLOWED_ORIGIN=\nTRUST_PROXY=0\nTURN_URLS=\nTURN_USERNAME=\nTURN_CREDENTIAL=\n`;
const example=`PORT=3000\nOWNER_EMAIL=owner@example.com\nOWNER_CODE_SALT=\nOWNER_CODE_HASH=\nMODERATOR_CODE_SALT=\nMODERATOR_CODE_HASH=\nDESIGNER_CODE_SALT=\nDESIGNER_CODE_HASH=\nOPENAI_API_KEY=\nOPENAI_MODEL=gpt-4o-mini\nALLOWED_ORIGIN=\nTRUST_PROXY=0\nTURN_URLS=\nTURN_USERNAME=\nTURN_CREDENTIAL=\n`;
fs.writeFileSync('.env.example',example);
fs.writeFileSync('.env',env);
console.log('Owner + moderator credentials saved to .env (never commit this file).');
