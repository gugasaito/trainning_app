// Optional account-owned catalog. Seed exercises and historic identifiers never change.
export function catalogFor(data,base){return [...base,...(data?.catalog?.exercises??[]).filter(e=>!base.some(b=>b.id===e.id))];}
export function plansFor(data,base){return [{id:'default',teacher:'',name:'Programa Full Body',workouts:['A','B','C'].map(id=>({id,name:'Treino '+id,subtitle:'Full Body'}))},...(data?.catalog?.plans??[])];}
export function validateCatalog(data,base){
 const c=data.catalog;if(c===undefined)return;
 if(!c||!Array.isArray(c.exercises)||!Array.isArray(c.plans)||c.exercises.length>500||c.plans.length>30)throw Error('Catálogo de planos inválido.');
 const text=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
 const ids=new Set(base.filter(e=>!e.id.startsWith('e-')).map(e=>e.id));const days=new Set(['A','B','C']);
 for(const p of c.plans){if(!text(p.id,100)||p.id==='default'||c.plans.filter(x=>x.id===p.id).length!==1||typeof p.teacher!=='string'||p.teacher.length>150||!text(p.name,200)||!Array.isArray(p.workouts)||p.workouts.length<1||p.workouts.length>26)throw Error('Plano inválido.');for(const w of p.workouts){if(!text(w.id,100)||days.has(w.id)||!text(w.name,100)||typeof w.subtitle!=='string'||w.subtitle.length>200)throw Error('Treino do plano inválido.');days.add(w.id);}}
 for(const e of c.exercises){if(!text(e.id,100)||!e.id.startsWith('e-')||ids.has(e.id)||!days.has(e.day)||!text(e.name,150)||!['kg','seg'].includes(e.unit)||!Number.isInteger(e.sets)||e.sets<1||e.sets>20||!text(e.target,100)||!['strength','cardio'].includes(e.kind)||(e.kind==='cardio'&&(!Number.isInteger(e.durationMinutes)||e.durationMinutes<1||e.durationMinutes>1000||e.unit!=='seg'))||typeof e.instructions!=='string'||e.instructions.length>1000)throw Error('Exercício do plano inválido.');ids.add(e.id);}
 for(const p of c.plans)for(const w of p.workouts)if(!c.exercises.some(e=>e.day===w.id))throw Error('Adicione exercícios a cada treino.');
}
export function createPlan(data,draft,uuid=()=>crypto.randomUUID()){
 const next=structuredClone(data);next.catalog??={exercises:[],plans:[]};
 const plan={id:'p-'+uuid(),teacher:draft.teacher.trim(),name:draft.name.trim(),workouts:[]};
 for(const [i,w] of draft.workouts.entries()){
  const id='w-'+uuid();plan.workouts.push({id,name:w.name.trim()||'Treino '+String.fromCharCode(65+i),subtitle:w.subtitle.trim()});
  const lines=w.exercises.split('\n').map(s=>s.trim()).filter(Boolean);
  for(const line of lines){const cardio=/^cardio\s*:/i.test(line),parts=line.replace(/^cardio\s*:\s*/i,'').split('|').map(s=>s.trim()),minutes=Number(parts[1]||20);next.catalog.exercises.push({id:'e-'+uuid(),day:id,name:parts[0],sets:cardio?1:Number(parts[1]||3),target:cardio?String(minutes)+' min':(parts[2]||'8–12'),unit:cardio?'seg':(parts[3]||'kg'),kind:cardio?'cardio':'strength',...(cardio?{durationMinutes:minutes}:{}),instructions:(cardio?parts[2]:parts[4])||''});}
 }
 next.catalog.plans.push(plan);return {data:next,plan};
}
export function addCardio(data,day,name,minutes,uuid=()=>crypto.randomUUID()){
 if(!name.trim()||!Number.isInteger(minutes)||minutes<1||minutes>1000)throw Error('Informe atividade e duração de 1 a 1000 minutos.');
 const next=structuredClone(data);next.catalog??={exercises:[],plans:[]};next.catalog.exercises.push({id:'e-'+uuid(),day,name:name.trim(),sets:1,target:minutes+' min',unit:'seg',kind:'cardio',durationMinutes:minutes,instructions:''});return next;
}
