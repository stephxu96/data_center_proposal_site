// Credentials are accepted only through hidden stdin and never logged.
import { execFileSync } from 'node:child_process';
import readline from 'node:readline';
if(process.stdin.isTTY)execFileSync('stty',['-echo'],{stdio:['inherit','ignore','ignore']});
console.log('Ready for request JSON on hidden stdin.');
const rl=readline.createInterface({input:process.stdin,terminal:false});
rl.once('line',async line=>{try{const {url,token}=JSON.parse(line);const target=new URL(url);if(target.protocol!=='https:'||!target.hostname.endsWith('.chatgpt.site'))throw Error('Unsupported Site target');const r=await fetch(target,{method:'POST',headers:{authorization:`Bearer ${token}`},redirect:'error'});console.log(JSON.stringify({status:r.status,body:await r.json()}));}catch{console.log('Request failed without exposing request details.');process.exitCode=1;}finally{if(process.stdin.isTTY)execFileSync('stty',['echo'],{stdio:['inherit','ignore','ignore']});rl.close();process.stdin.unref();}});
