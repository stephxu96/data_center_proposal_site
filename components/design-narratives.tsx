import { getNarratives,getNarrativeValues } from '../lib/db/content';
export async function DesignNarratives({keys}:{keys:string[]}){
 const [narratives,values]=await Promise.all([getNarratives(),getNarrativeValues()]);
 return <div className="grid-2">{narratives.filter(n=>keys.includes(n.key)).map(n=><article key={n.key} className="card" id={n.key}><span className="tag">Initial design</span><h3>{n.title}</h3><ol className="working-list">{n.steps.map((step,i)=><li key={i}>{step.split(/(\{claim:[^}]+\})/g).map((part,j)=>{const match=part.match(/^\{claim:([^}]+)\}$/);return match?<a key={j} className="text-link" href="/evidence#design-inputs">{values[match[1] as keyof typeof values]??'Not established'}</a>:part;})}</li>)}</ol></article>)}</div>;
}
