const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>n===null?'—':n.toLocaleString('pt-BR',{maximumFractionDigits:1});
export function historyHeader({name,session,gym}){
 const date=session?new Date(session.startedAt):null,options={timeZone:session?.timeZone||'America/Sao_Paulo'};
 const day=date?date.toLocaleDateString('pt-BR',options):'Registro semanal anterior',time=date?date.toLocaleTimeString('pt-BR',{...options,hour:'2-digit',minute:'2-digit'}):'Horário não registrado';
 return `<div class="history-card-heading"><h2>${esc(name)}</h2><p class="history-card-when"><span>${esc(day)}</span><span aria-hidden="true">·</span><span>${esc(time)}</span></p><p class="history-card-gym">${esc(gym||'Academia não informada')}</p></div>`;
}
export function historyDetails(records,exercises,session){
 const items=records.map(r=>{const e=exercises.find(e=>e.id===r.exercise);return `<div class="history-exercise-detail"><strong>${esc(e?.name||r.exercise)}</strong>${r.equipment?`<span class="history-equipment">${esc(r.equipment)}</span>`:''}<p>${r.sets.map((s,i)=>`S${i+1}: ${fmt(s.value)} ${esc(e?.unit||'')}${e?.unit==='seg'?'':' × '+fmt(s.reps)+' reps'}`).join(' · ')}</p>${r.note?`<p class="muted">${esc(r.note)}</p>`:''}</div>`;}).join('');
 const unfilled=(session?.completedExerciseIds??[]).filter(id=>!records.some(r=>r.exercise===id)).map(id=>`<p><strong>${esc(exercises.find(e=>e.id===id)?.name||id)}</strong><br><small>Concluído · sem séries registradas</small></p>`).join('');
 return `<details class="exercise-history exercise-details"><summary>Detalhe dos exercícios</summary><div class="history-exercise-list">${items+unfilled||'<p>Sem séries registradas nesta sessão.</p>'}</div></details>`;
}
