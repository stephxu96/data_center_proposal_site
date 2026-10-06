import { getPublicDesign } from './evidence';
import { proposalData } from './proposal';
export async function getPublishedDesignInputs(){
 const stored=await getPublicDesign();
 const values=new Map(stored?.parameters.map(p=>[p.name,p.value])??[]);
 return {...proposalData.design,itLoadMw:values.get('it_load_mw')??proposalData.design.itLoadMw,pue:values.get('pue')??proposalData.design.pue,operatingHours:values.get('operating_hours')??proposalData.design.operatingHours,latencyThresholdMs:values.get('latency_threshold_ms')??proposalData.design.latencyThresholdMs};
}
