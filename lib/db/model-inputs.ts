import { getPublicDesign } from './evidence';
import { economicsDefaults,proposalData,modelDefinitions } from './proposal';
export async function getModelInputs(){
 const design=await getPublicDesign();const values=new Map(design?.parameters.map(p=>[p.name,p.value])??[]);
 const defaults={...proposalData.illustrativeModel,...economicsDefaults,pue:values.get('pue')??proposalData.design.pue,itLoadMw:values.get('it_load_mw')??proposalData.design.itLoadMw,operatingHours:values.get('operating_hours')??proposalData.design.operatingHours};
 for(const [key] of modelDefinitions)if(key!=='pue'&&values.has(key))defaults[key]=values.get(key)!;
 return defaults;
}
