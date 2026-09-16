import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url))),dbPath=path.join(root,'data','zeyad.sqlite'),outDir=path.join(root,'backups');
fs.mkdirSync(outDir,{recursive:true,mode:0o700});
if(!fs.existsSync(dbPath)){console.log('Database not created yet. Start the app once first.');process.exit(0)}
const stamp=new Date().toISOString().replace(/[:.]/g,'-');
const out=path.join(outDir,`zeyad-${stamp}.sqlite`);const db=new DatabaseSync(dbPath);db.exec(`VACUUM INTO '${out.replace(/'/g,"''")}'`);db.close();
try{fs.chmodSync(out,0o600)}catch{}
// Keep the newest 14 backups only.
const backups=fs.readdirSync(outDir).filter(x=>x.startsWith('zeyad-')&&x.endsWith('.sqlite')).sort();
for(const old of backups.slice(0,-14)){try{fs.unlinkSync(path.join(outDir,old))}catch{}}
console.log(`Backup: ${out}`);
