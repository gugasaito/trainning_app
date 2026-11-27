const limit=(v,min,max)=>v===null||typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export const MAX_HEART_POINTS=180;
export const MAX_HEALTH_WORKOUTS=20;
export function heartTimeline(value,start,end,maxPoints=MAX_HEART_POINTS){
 if(!value||!Array.isArray(value.points)||value.points.length>maxPoints||typeof value.reduced!=='boolean')throw Error('Timeline cardíaca inválida.');
 let previous=-Infinity;
 const points=value.points.map(p=>{if(!p||!Number.isSafeInteger(p.at)||p.at<start||p.at>end||p.at<=previous||!limit(p.bpm,1,400)||p.bpm===null)throw Error('Amostra cardíaca inválida.');previous=p.at;return {at:p.at,bpm:p.bpm};});
 return {points,reduced:value.reduced};
}
export function healthSummary(value){
 if(!value||value.provider!=='apple-health'||typeof value.workoutId!=='string'||!value.workoutId||value.workoutId.length>100||typeof value.activityType!=='string'||value.activityType.length>120||typeof value.source!=='string'||value.source.length>200||!Number.isFinite(value.startedAt)||!Number.isFinite(value.endedAt)||value.endedAt<=value.startedAt||!Number.isFinite(value.updatedAt)||!limit(value.activeCaloriesKcal,0,100000)||!limit(value.heartRateAverageBpm,1,400)||!limit(value.heartRateMinBpm,1,400)||!limit(value.heartRateMaxBpm,1,400))throw Error('Resumo do Saúde inválido.');
 const {provider,workoutId,activityType,source,startedAt,endedAt,updatedAt,activeCaloriesKcal,heartRateAverageBpm,heartRateMinBpm,heartRateMaxBpm}=value;
 if(heartRateMinBpm!==null&&heartRateMaxBpm!==null&&heartRateMinBpm>heartRateMaxBpm)throw Error('Frequências cardíacas inválidas.');
 return {provider,workoutId,activityType,source,startedAt,endedAt,updatedAt,activeCaloriesKcal,heartRateAverageBpm,heartRateMinBpm,heartRateMaxBpm,...(value.heartRateTimeline===undefined?{}:{heartRateTimeline:heartTimeline(value.heartRateTimeline,startedAt,endedAt)})};
}
export function sessionHealthWorkouts(session){
 if(session.healthWorkouts===undefined)return session.health?[healthSummary(session.health)]:[];
 if(!Array.isArray(session.healthWorkouts)||!session.healthWorkouts.length||session.healthWorkouts.length>MAX_HEALTH_WORKOUTS)throw Error('Períodos do Saúde inválidos.');
 const parts=session.healthWorkouts.map(healthSummary),ids=new Set();for(const h of parts){if(ids.has(h.workoutId))throw Error('Período do Saúde duplicado.');if(parts.some(other=>other.workoutId!==h.workoutId&&Math.min(other.endedAt,h.endedAt)>Math.max(other.startedAt,h.startedAt)))throw Error('Períodos do Saúde sobrepostos.');ids.add(h.workoutId);}
 if(!session.health||session.health.workoutId!==parts[0].workoutId)throw Error('Resumo principal não corresponde aos períodos do Saúde.');
 return parts.sort((a,b)=>a.startedAt-b.startedAt||a.workoutId.localeCompare(b.workoutId));
}
export function sessionPeriods(session){const end=session.status==='finished'?session.finishedAt:session.since;if(!Number.isFinite(end))return [];let start=session.startedAt;const periods=[];for(const r of session.resumptions??[]){if(r.finishedAt>start)periods.push({startedAt:start,finishedAt:r.finishedAt});start=r.resumedAt;}if(end>start)periods.push({startedAt:start,finishedAt:end});return periods;}
export function overlap(session,workout){return sessionPeriods(session).reduce((n,p)=>n+Math.max(0,Math.min(p.finishedAt,workout.endedAt)-Math.max(p.startedAt,workout.startedAt)),0);}
export function ownedWorkouts(data,exceptSessionId=null){return new Set([...(data.sessions??[]).filter(s=>s.id!==exceptSessionId).flatMap(s=>sessionHealthWorkouts(s).map(h=>h.workoutId)),...(data.activities??[]).map(a=>a.health?.workoutId),...(data.deletedWorkouts??[]).flatMap(t=>(t.sessions??[]).flatMap(s=>sessionHealthWorkouts(s).map(h=>h.workoutId)))].filter(Boolean));}
const intersects=(a,b)=>Math.min(a.endedAt,b.endedAt)>Math.max(a.startedAt,b.startedAt);
function matchesPeriod(p,h){return Math.max(0,Math.min(p.finishedAt,h.endedAt)-Math.max(p.startedAt,h.startedAt))/Math.max(p.finishedAt-p.startedAt,h.endedAt-h.startedAt)>=.8;}
export function automaticCandidates(data,session,workouts){
 if(session.healthOptOut||session.status!=='finished'||!Number.isFinite(session.finishedAt)||session.finishedAt<=session.startedAt)return [];
 const owned=ownedWorkouts(data,session.id),seen=new Set(),parts=sessionHealthWorkouts(session);
 const valid=workouts.map(healthSummary).filter(h=>{if(owned.has(h.workoutId)||overlap(session,h)<=0||seen.has(h.workoutId))return false;seen.add(h.workoutId);return true;});
 const result=valid.filter(h=>parts.some(p=>p.workoutId===h.workoutId));
 for(const p of sessionPeriods(session)){
  if(parts.some(h=>matchesPeriod(p,h)))continue;
  const matches=valid.filter(h=>matchesPeriod(p,h)&&!parts.some(old=>old.workoutId!==h.workoutId&&intersects(old,h)));
  if(matches.length!==1)continue;const h=matches[0];
  if((data.sessions??[]).some(other=>other.id!==session.id&&other.status==='finished'&&!other.healthOptOut&&sessionPeriods(other).some(op=>matchesPeriod(op,h))))continue;
  if(!result.some(x=>x.workoutId===h.workoutId)&&!result.some(x=>x.workoutId!==h.workoutId&&intersects(x,h)))result.push(h);
 }
 return result;
}
export function automaticCandidate(data,session,workouts){return automaticCandidates(data,session,workouts)[0]??null;}
export function attachHealth(data,sessionId,summary){
 const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId),h=healthSummary(summary);
 if(!s||s.status!=='finished'||overlap(s,h)<=0)throw Error('O treino do Saúde não coincide com um período desta sessão finalizada.');
 if(ownedWorkouts(next,sessionId).has(h.workoutId))throw Error('Este treino do Saúde já está associado a outra sessão.');
 const parts=sessionHealthWorkouts(s),index=parts.findIndex(p=>p.workoutId===h.workoutId),old=parts[index];
 if(h.heartRateTimeline===undefined&&old?.heartRateTimeline!==undefined)h.heartRateTimeline=structuredClone(old.heartRateTimeline);
 if(parts.some(p=>p.workoutId!==h.workoutId&&intersects(p,h)))throw Error('Os períodos do Saúde se sobrepõem. Desvincule o período incorreto antes de associar outro, para não duplicar calorias.');
 if(index>=0)parts[index]=h;else {if(parts.length>=MAX_HEALTH_WORKOUTS)throw Error('Limite de períodos do Saúde desta sessão atingido.');parts.push(h);}
 parts.sort((a,b)=>a.startedAt-b.startedAt||a.workoutId.localeCompare(b.workoutId));
 s.health=parts[0];if(parts.length>1||s.healthWorkouts!==undefined)s.healthWorkouts=parts;delete s.healthOptOut;return next;
}
export function removeHealthWorkout(data,sessionId,workoutId){const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId);if(!s)throw Error('Sessão não encontrada.');const parts=sessionHealthWorkouts(s).filter(h=>h.workoutId!==workoutId);if(parts.length){s.health=parts[0];s.healthWorkouts=parts;}else {delete s.health;delete s.healthWorkouts;}s.healthOptOut=true;return next;}
export function validateHealthOwnership(data){const seen=new Set();for(const h of [...(data.sessions??[]).flatMap(sessionHealthWorkouts),...(data.activities??[]).flatMap(a=>a.health?[healthSummary(a.health)]:[]),...(data.deletedWorkouts??[]).flatMap(t=>(t.sessions??[]).flatMap(sessionHealthWorkouts))]){if(seen.has(h.workoutId))throw Error('Este treino do Saúde já foi registrado em outra sessão ou atividade.');seen.add(h.workoutId);}}
export function healthQueryRanges(session){const ranges=[];for(const p of sessionPeriods(session)){let start=p.startedAt-1800000,end=p.finishedAt+1800000;while(start<end){const stop=Math.min(end,start+48*3600000);ranges.push({start,end:stop});if(ranges.length>100)throw Error('Muitos períodos para uma busca. Procure cada atividade pela data.');start=stop;}}return ranges;}
