import {healthSummary,ownedWorkouts,sessionHealthWorkouts} from './health-model.mjs';
// HealthKit dates may contain fractional milliseconds. Preserve their precision.
const validTimestamp=v=>Number.isFinite(v)&&v>=0&&v<=8640000000000000;
const text=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
export function validateActivities(data){
 const rows=data.activities??[];if(!Array.isArray(rows)||rows.length>10000)throw Error('Lista de atividades inválida.');
 const ids=new Set(),workouts=new Set([...(data.sessions??[]).flatMap(s=>sessionHealthWorkouts(s).map(h=>h.workoutId)),...(data.deletedWorkouts??[]).flatMap(t=>(t.sessions??[]).flatMap(s=>sessionHealthWorkouts(s).map(h=>h.workoutId)))].filter(Boolean));
 return rows.map(a=>{if(!a||!text(a.id,150)||ids.has(a.id)||!text(a.activityType,120)||!['manual','apple-health'].includes(a.origin)||!validTimestamp(a.startedAt)||!validTimestamp(a.endedAt)||a.startedAt<0||a.endedAt<=a.startedAt||a.endedAt-a.startedAt>48*3600000||!Number.isSafeInteger(a.createdAt)||!Number.isSafeInteger(a.updatedAt)||typeof a.note!=='string'||a.note.length>2000||(a.activeCaloriesKcal!==null&&(!Number.isFinite(a.activeCaloriesKcal)||a.activeCaloriesKcal<0||a.activeCaloriesKcal>100000)))throw Error('Atividade inválida. Confira tipo, horário e calorias.');
 ids.add(a.id);const out={id:a.id,activityType:a.activityType.trim(),origin:a.origin,startedAt:a.startedAt,endedAt:a.endedAt,activeCaloriesKcal:a.activeCaloriesKcal,note:a.note,createdAt:a.createdAt,updatedAt:a.updatedAt};
 if(a.origin==='apple-health'){const h=healthSummary(a.health);if(workouts.has(h.workoutId))throw Error('Este treino do Saúde já foi registrado.');if(a.startedAt!==h.startedAt||a.endedAt!==h.endedAt||a.activeCaloriesKcal!==h.activeCaloriesKcal)throw Error('As medidas originais do Saúde devem ser preservadas.');workouts.add(h.workoutId);out.health=h;}else if(a.health!==undefined)throw Error('Atividade manual não pode conter dados do Saúde.');return out;});
}
export function saveActivity(data,draft,{id=null,health=null,now=Date.now(),makeId=()=>crypto.randomUUID()}={}){
 const next=structuredClone(data),old=id?(next.activities??[]).find(a=>a.id===id):null;if(id&&!old)throw Error('Atividade não encontrada.');
 const h=old?.health??(health?healthSummary(health):null);if(!old&&h&&ownedWorkouts(next).has(h.workoutId))throw Error('Este treino do Saúde já foi registrado.');
 const a={id:old?.id??makeId(),origin:h?'apple-health':'manual',activityType:draft.activityType,startedAt:h?.startedAt??draft.startedAt,endedAt:h?.endedAt??draft.endedAt,activeCaloriesKcal:h?h.activeCaloriesKcal:draft.activeCaloriesKcal,note:draft.note??'',createdAt:old?.createdAt??now,updatedAt:now,...(h?{health:h}:{})};
 next.activities=old?next.activities.map(x=>x.id===id?a:x):[...(next.activities??[]),a];next.activities=validateActivities(next);return next;
}
export function unregisteredWorkouts(data,found){const owned=ownedWorkouts(data),seen=new Set();return found.map(healthSummary).filter(h=>{if(owned.has(h.workoutId)||seen.has(h.workoutId))return false;seen.add(h.workoutId);return true;}).sort((a,b)=>b.startedAt-a.startedAt);}
export function discoveryRange(day){if(!/^\d{4}-\d{2}-\d{2}$/.test(day))throw Error('Selecione uma data válida.');const start=new Date(day+'T00:00:00').getTime(),end=new Date(day+'T00:00:00');end.setDate(end.getDate()+1);if(!Number.isFinite(start)||end.getTime()<=start||new Date(start).getFullYear()<2000||`${new Date(start).getFullYear()}-${String(new Date(start).getMonth()+1).padStart(2,'0')}-${String(new Date(start).getDate()).padStart(2,'0')}`!==day)throw Error('Selecione uma data válida.');return {start,end:end.getTime()};}
