// References are observed loads, never automatic progression or conversions between machines.
export const normalized=value=>String(value??'').normalize('NFKC').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
export function addGym(data,name,id=globalThis.crypto.randomUUID()){
 name=String(name).trim().replace(/\s+/g,' ');
 if(!name||name.length>100)throw Error('Informe um nome de academia com até 100 caracteres.');
 if(data.gyms.some(g=>normalized(g.name)===normalized(name)))throw Error('Essa academia já está cadastrada.');
 if(data.gyms.length>=100)throw Error('Limite de 100 academias.');
 return {...data,gyms:[...data.gyms,{id,name}]};
}
export const gymName=(data,id)=>data.gyms?.find(g=>g.id===id)?.name||'Academia não informada';
export function references(data,exercise,session,equipment='',count=exercise.sets){
 if(!session?.gymId)return Array(count).fill(null);
 const prior=data.sessions.filter(s=>s.id!==session.id&&s.gymId===session.gymId&&s.status==='finished'&&s.startedAt<session.startedAt).sort((a,b)=>b.startedAt-a.startedAt);
 const rows=prior.map(s=>({session:s,record:data.records.find(r=>r.sessionId===s.id&&r.exercise===exercise.id&&normalized(r.equipment)===normalized(equipment))})).filter(x=>x.record);
 return Array.from({length:count},(_,i)=>{const hit=rows.find(x=>{const st=x.record.sets[i];return st&&st.value!==null&&(exercise.unit==='seg'||st.reps!==null)});return hit?{...hit.record.sets[i],startedAt:hit.session.startedAt,sessionId:hit.session.id}:null;});
}
export function preferredEquipment(data,exercise,session){
 if(!session?.gymId)return '';
 const sessions=data.sessions.filter(s=>s.id!==session.id&&s.gymId===session.gymId&&s.status==='finished'&&s.startedAt<session.startedAt).sort((a,b)=>b.startedAt-a.startedAt);
 for(const s of sessions){const r=data.records.find(r=>r.sessionId===s.id&&r.exercise===exercise.id);if(r)return r.equipment||'';}
 return '';
}
