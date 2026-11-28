import {healthSummary,attachHealth,automaticCandidates,sessionHealthWorkouts,sessionPeriods,ownedWorkouts,overlap} from './health-model.mjs';
export const RETRY_DELAYS=[5000,15000,30000,60000,120000];
export function authorizedSettings(previous,now=Date.now()){return {enabled:true,autoSync:previous?.enabled===true&&previous.autoSync===true,timelineEnabled:true,consentAt:new Date(now).toISOString()};}
export function reconcileHealth(data,id,found){
 const session=data.sessions.find(s=>s.id===id);if(!session||session.status!=='finished'||session.healthOptOut)return {data,state:'cancelled'};
 const workouts=found.map(healthSummary),matches=automaticCandidates(data,session,workouts);let next=data;
 for(const match of matches)next=attachHealth(next,id,match);
 const current=next.sessions.find(s=>s.id===id),parts=sessionHealthWorkouts(current),periods=sessionPeriods(current);
 const covered=periods.length>0&&periods.every(p=>parts.reduce((n,h)=>n+Math.max(0,Math.min(p.finishedAt,h.endedAt)-Math.max(p.startedAt,h.startedAt)),0)/(p.finishedAt-p.startedAt)>=.8);
 if(covered)return {data:next,state:'associated',count:parts.length};
 const owned=ownedWorkouts(next,id),choices=workouts.filter(h=>!owned.has(h.workoutId)&&overlap(current,h)>0&&!parts.some(p=>p.workoutId===h.workoutId));
 return {data:next,state:choices.length?'choice':parts.length?'partial':'waiting',count:parts.length};
}
const signature=s=>JSON.stringify([s.status,s.finishedAt,s.resumptions?.length??0,s.healthOptOut]);
export class HealthSyncQueue {
 constructor({context,read,write,notify=()=>{},clock=()=>Date.now(),later=(fn,ms)=>setTimeout(fn,ms),clear=id=>clearTimeout(id)}){Object.assign(this,{context,read,write,notify,clock,later,clear});this.jobs=new Map();this.uid=null;this.running=false;this.epoch=0;this.timer=null;}
 eligible(c){return !!c.uid&&c.native&&c.visible&&!c.paused&&!!c.data?.healthSettings?.enabled&&!!c.data.healthSettings.autoSync;}
 cancel(){this.epoch++;if(this.timer!==null)this.clear(this.timer);this.timer=null;this.jobs.clear();}
 status(id){return this.jobs.get(id)?.status??null;}
 busy(){return this.running;}
 wake({force=false,onlyId=null}={}){
  const c=this.context();if(c.uid!==this.uid){this.cancel();this.uid=c.uid;}
  if(!this.eligible(c)){this.cancel();this.notify();return;}
  const sessions=c.data.sessions.filter(s=>s.status==='finished'&&!s.healthOptOut&&s.finishedAt>this.clock()-7*86400000).sort((a,b)=>b.finishedAt-a.finishedAt).slice(0,10),ids=new Set(sessions.map(s=>s.id));
  for(const [id] of this.jobs)if(!ids.has(id))this.jobs.delete(id);
  for(const s of sessions){const old=this.jobs.get(s.id),changed=old?.signature!==signature(s);if(old&&!changed&&old.status.state==='searching')continue;if(!old||changed||(force&&(!onlyId||onlyId===s.id))){this.jobs.set(s.id,{signature:signature(s),attempt:0,due:this.clock(),token:Symbol(),status:{state:'pending',message:'Aguardando consulta ao Saúde.'}});}}
  this.schedule();
 }
 schedule(){if(this.timer!==null)this.clear(this.timer);this.timer=null;if(this.running)return;const c=this.context();if(!this.eligible(c))return;const due=[...this.jobs.values()].filter(j=>j.due!==null).map(j=>j.due);if(due.length)this.timer=this.later(()=>{this.timer=null;this.run();},Math.max(0,Math.min(...due)-this.clock()));}
 async run(){
  if(this.running)return;const c=this.context();if(!this.eligible(c)){this.cancel();return;}
  const item=[...this.jobs].find(([,j])=>j.due!==null&&j.due<=this.clock());if(!item){this.schedule();return;}
  const [id,job]=item,session=c.data.sessions.find(s=>s.id===id),epoch=this.epoch,uid=c.uid;
  if(!session||signature(session)!==job.signature){this.wake();return;}
  const current=()=>{const n=this.context();return epoch===this.epoch&&uid===n.uid&&this.eligible(n)&&this.jobs.get(id)===job&&signature(n.data.sessions.find(s=>s.id===id)??{})===job.signature;};
  const set=(state,message)=>{job.status={state,message,attempt:job.attempt};this.notify();};
  this.running=true;job.attempt++;job.due=null;set('searching','Buscando um registro finalizado no Saúde…');
  try{
   const found=await this.read(session);if(!current())return;
   const latest=this.context().data,result=reconcileHealth(latest,id,found);if(!current()||result.state==='cancelled')return;
   if(JSON.stringify(result.data)!==JSON.stringify(latest))this.write(result.data);
   if(!current())return;
   if(result.state==='associated')set('associated',`Saúde associado · ${result.count} período(s). Confira a sincronização da conta no cabeçalho.`);
   else if(result.state==='choice')set('choice','Há registros que precisam da sua escolha. Abra Saúde e use Buscar treino correspondente.');
   else this.retry(job,set,result.state,result.count?'Parte do treino associada; aguardando os outros períodos.':'Aguardando um registro finalizado no Saúde. Confira se o treino terminou no Watch.');
  }catch(e){if(current())this.retry(job,set,'error',`Não foi possível consultar o Saúde: ${e.message}`);}
  finally{this.running=false;if(current())this.notify();this.schedule();}
 }
 retry(job,set,state,message){const delay=RETRY_DELAYS[job.attempt-1];if(delay!==undefined){job.due=this.clock()+delay;set(state,`${message} Nova tentativa em ${delay/1000}s, com o app aberto.`);}else {job.due=null;set(state==='error'?'error':'attention',`${message} As tentativas automáticas terminaram. Confira sincronização e permissões do Saúde e use Tentar novamente ou a busca manual. A ausência não confirma falta de treino nem de permissão.`);}}
}

export async function readHealthRanges(ranges,read,canRead){const found=new Map();for(const range of ranges){if(!canRead())throw Error('A conta, a autorização ou o estado do aplicativo mudou.');const result=await read(range);if(!canRead())throw Error('A conta, a autorização ou o estado do aplicativo mudou.');for(const h of result.map(healthSummary))found.set(h.workoutId,h);}return [...found.values()];}
