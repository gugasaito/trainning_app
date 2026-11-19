const limit=(v,min,max)=>v===null||typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
export function healthSummary(value){
 if(!value||value.provider!=='apple-health'||typeof value.workoutId!=='string'||!value.workoutId||value.workoutId.length>100||typeof value.activityType!=='string'||value.activityType.length>120||typeof value.source!=='string'||value.source.length>200||!Number.isFinite(value.startedAt)||!Number.isFinite(value.endedAt)||value.endedAt<=value.startedAt||!Number.isFinite(value.updatedAt)||!limit(value.activeCaloriesKcal,0,100000)||!limit(value.heartRateAverageBpm,1,400)||!limit(value.heartRateMinBpm,1,400)||!limit(value.heartRateMaxBpm,1,400))throw Error('Resumo do Saúde inválido.');
 const {provider,workoutId,activityType,source,startedAt,endedAt,updatedAt,activeCaloriesKcal,heartRateAverageBpm,heartRateMinBpm,heartRateMaxBpm}=value;
 if(heartRateMinBpm!==null&&heartRateMaxBpm!==null&&heartRateMinBpm>heartRateMaxBpm)throw Error('Frequências cardíacas inválidas.');
 return {provider,workoutId,activityType,source,startedAt,endedAt,updatedAt,activeCaloriesKcal,heartRateAverageBpm,heartRateMinBpm,heartRateMaxBpm};
}
export function overlap(session,workout){return Math.max(0,Math.min(session.finishedAt,workout.endedAt)-Math.max(session.startedAt,workout.startedAt));}
export function automaticCandidate(data,session,workouts){
 if(session.healthOptOut||session.status!=='finished'||!Number.isFinite(session.finishedAt)||session.finishedAt<=session.startedAt)return null;
 const owned=new Set(data.sessions.filter(s=>s.id!==session.id&&s.health).map(s=>s.health.workoutId));
 const valid=workouts.map(healthSummary).filter(h=>!owned.has(h.workoutId)&&overlap(session,h)>0);
 if(session.health)return valid.find(h=>h.workoutId===session.health.workoutId)??null;
 // Conservative association: exactly one workout, covering at least 80% of both intervals.
 const matches=valid.filter(h=>overlap(session,h)/Math.max(session.finishedAt-session.startedAt,h.endedAt-h.startedAt)>=.8);
 return matches.length===1?matches[0]:null;
}
export function attachHealth(data,sessionId,summary){
 const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId),h=healthSummary(summary);
 if(!s||s.status!=='finished'||overlap(s,h)<=0)throw Error('O treino do Saúde não coincide com esta sessão finalizada.');
 if(next.sessions.some(other=>other.id!==sessionId&&other.health?.workoutId===h.workoutId))throw Error('Este treino do Saúde já está associado a outra sessão.');
 s.health=h;delete s.healthOptOut;return next;
}
