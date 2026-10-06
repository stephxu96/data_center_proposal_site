import { env } from 'cloudflare:workers';
import { applyProposalSeed } from '../../../lib/db/seed';
export async function POST(request:Request){
 const configured=env.SEED_DEPLOY_TOKEN;
 if(!configured)return Response.json({error:'Seed deployment is disabled.'},{status:404});
 const supplied=request.headers.get('authorization')?.replace(/^Bearer /,'')??'';
 const encoder=new TextEncoder();
 const [actual,expected]=await Promise.all([crypto.subtle.digest('SHA-256',encoder.encode(supplied)),crypto.subtle.digest('SHA-256',encoder.encode(configured))]);
 const a=new Uint8Array(actual),b=new Uint8Array(expected);let mismatch=0;for(let i=0;i<a.length;i++)mismatch|=a[i]^b[i];
 if(mismatch)return Response.json({error:'Deployment authorization required.'},{status:403});
 try{return Response.json(await applyProposalSeed());}catch{return Response.json({error:'Seed transaction failed; no partial data was committed.'},{status:500});}
}
