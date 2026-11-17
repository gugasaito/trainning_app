import {checked} from './accounts.mjs';
export function deleteWorkout(data,target,exercises,now=Date.now()){
 const next=structuredClone(data);let sessions=[],records=[];
 if(target.id==='legacy'){
  if(!Number.isInteger(target.week)||!['A','B','C'].includes(target.day))throw Error('Treino inválido.');
  records=next.records.filter(r=>!r.sessionId&&r.week===target.week&&exercises.find(e=>e.id===r.exercise)?.day===target.day);
  if(!records.length)throw Error('Treino não encontrado.');
 }else{const s=next.sessions.find(s=>s.id===target.id);if(!s)throw Error('Sessão não encontrada.');if(s.status!=='finished')throw Error('Finalize o treino ativo antes de excluí-lo.');sessions=[s];records=next.records.filter(r=>r.sessionId===s.id);}
 const removed=new Set(records);next.records=next.records.filter(r=>!removed.has(r));next.sessions=next.sessions.filter(s=>!sessions.includes(s));
 next.deletedWorkouts=[...(next.deletedWorkouts||[]),{id:globalThis.crypto.randomUUID(),deletedAt:now,title:target.title||'Treino excluído',sessions,records}];
 return checked(next,exercises);
}
export function restoreWorkout(data,id,exercises){
 const next=structuredClone(data),item=next.deletedWorkouts?.find(x=>x.id===id);if(!item)throw Error('Treino não encontrado na lixeira.');
 next.records.push(...item.records);next.sessions.push(...item.sessions);next.sessions.sort((a,b)=>a.startedAt-b.startedAt);
 next.deletedWorkouts=next.deletedWorkouts.filter(x=>x.id!==id);
 try{return checked(next,exercises);}catch{throw Error('Não foi possível restaurar: já existe um registro correspondente no histórico. Exporte um backup antes de resolver a duplicidade.');}
}
