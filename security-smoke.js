import assert from 'node:assert/strict';
const base=process.env.SMOKE_URL||'http://127.0.0.1:3000';
async function req(path,opts={}){const r=await fetch(base+path,opts);let body={};try{body=await r.json()}catch{}return {r,body}}
const h=await req('/api/health');assert.equal(h.r.status,200);assert.equal(h.body.ok,true);
const unauth=await req('/api/me');assert.equal(unauth.r.status,401);
const m=await req('/api/health',{method:'PUT'});assert.equal(m.r.status,405);
const email=`smoke-${Date.now()}@example.com`;
const reg=await req('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Security Smoke',email,password:'StrongPass123!'})});assert.equal(reg.r.status,200);assert.ok(reg.body.token);
const token=reg.body.token;const ch=await req('/api/games/security/start',{method:'POST',headers:{Authorization:`Bearer ${token}`}});assert.equal(ch.r.status,200);assert.ok(ch.body.challengeId);
const bad=await req('/api/games/security/answer',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({challengeId:ch.body.challengeId,choice:99})});assert.equal(bad.r.status,400);
console.log('SECURITY SMOKE: PASS');
