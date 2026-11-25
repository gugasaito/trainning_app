import {emptySets} from './core.mjs';
import {references,preferredEquipment,gymName} from './gyms.mjs';
import {plansFor} from './plans.mjs';
import {elapsed} from './session.mjs';
import {exerciseDuration} from './workout-actions.mjs';
export const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=escape,fmt=n=>n===null||n===undefined?'—':n.toLocaleString('pt-BR',{maximumFractionDigits:2});
export const duration=ms=>{const n=Math.floor(ms/1000);return [Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(n=>String(n).padStart(2,'0')).join(':');};
const date=n=>new Date(n).toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});
export function numericPicker(value,id,index,field,label,disabled=false){
 // Keep out-of-range and fractional historic values selectable without rounding them.
 const unusual=value!==null&&value!==undefined&&(!Number.isInteger(value)||value>1000);
 return `<label>${label}<select aria-label="${esc(label)} série ${index+1}" data-set="${index}" data-field="${field}" ${disabled?'disabled':''}><option value="">—</option>${unusual?`<option selected value="${value}">${fmt(value)} (registrado)</option>`:''}${Array.from({length:1001},(_,n)=>`<option value="${n}" ${value===n?'selected':''}>${n}</option>`).join('')}</select></label>`;
}
export function exerciseMarkup(e,index,c){
 const {data,session,open=false,editing=false}=c,r=data.records.find(r=>r.exercise===e.id&&(session?r.sessionId===session.id:editing?!r.sessionId:false)&&r.week===c.week),sets=r?.sets??emptySets(e),time=e.unit==='seg',cardio=e.kind==='cardio';
 const referenceSession=session??{id:'preview',gymId:c.gymId,startedAt:Date.now()},equipment=r?.equipment??preferredEquipment(data,e,referenceSession),hints=references(data,e,referenceSession,equipment,sets.length);
 const done=session?.completedExerciseIds?.includes(e.id),last=session?.exerciseIntervals?.at(-1),running=session?.status==='running'&&last?.endedAt===null&&last.exerciseId===e.id,blocked=session?.status==='running'&&last?.endedAt===null&&!running,expanded=running||open,editable=!!session&&!done&&(!blocked)&&(editing||session.status==='running');
 const variants=[...new Set(data.records.filter(r=>r.exercise===e.id&&r.equipment).map(r=>r.equipment))],next=sets.findIndex(s=>!s.done),prescription=cardio?e.target:e.sets+' séries · '+e.target+(time?'':' reps');
 const start=editing?'':`<button class="exercise-start" data-exercise-action="start" data-exercise-id="${esc(e.id)}" ${blocked||session?.status==='paused'||done?'disabled':''}>Iniciar exercício</button>`;
 const refs=hints.map((h,j)=>h?`S${j+1}: ${fmt(h.value)} ${time?'s':'kg'}${time?'':' × '+fmt(h.reps)+' reps'} · ${date(h.startedAt)}`:`S${j+1}: Sem histórico`).join('<br>');
 return `<article class="focus-exercise ${running?'is-running':''} ${blocked?'is-blocked':''} ${done?'is-complete':''}" data-ex="${esc(e.id)}" ${blocked?'inert aria-disabled="true"':''}>
 <div class="exercise-row"><span class="exercise-number">${String(index+1).padStart(2,'0')}</span><button class="exercise-expand" data-expand="${esc(e.id)}" aria-expanded="${expanded}" aria-controls="body-${esc(e.id)}"><strong>${esc(e.name)}</strong>${expanded?`<small>${esc(prescription)}</small>`:''}<span aria-hidden="true">${expanded?'⌃':'⌄'}</span></button>${running?`<div class="running-info"><small>EM ANDAMENTO</small><strong data-exercise-clock="${esc(e.id)}">${duration(exerciseDuration(session,e.id))}</strong></div>`:done?'<span class="completed-label">✓ Concluído</span>':!expanded?start:''}</div>
 ${expanded?`<div class="exercise-expanded" id="body-${esc(e.id)}">
 ${done?`<div class="completion-banner">✓ Exercício finalizado. Mandou bem! <button data-redo-exercise="${esc(e.id)}">Refazer exercício</button></div>`:''}
 <fieldset ${editable?'':'disabled'} class="exercise-content">
 <label>Exercício/aparelho utilizado<input data-equipment="${esc(e.id)}" list="equipment-${esc(e.id)}" maxlength="150" value="${esc(equipment)}" placeholder="Padrão ou informe a variação/aparelho"></label><datalist id="equipment-${esc(e.id)}">${variants.map(v=>`<option value="${esc(v)}"></option>`).join('')}</datalist>
 ${!cardio&&e.instructions?`<p class="teacher-guidance">${esc(e.instructions)}</p>`:''}<section class="reference-box"><strong>Último treino nesta academia</strong><small>${esc(gymName(data,referenceSession.gymId))} · ${esc(equipment||'Padrão')}</small><p>${refs}</p></section>
 ${cardio?`<div class="cardio-prescription"><span>Meta: ${e.durationMinutes} min</span>${e.instructions?`<small>${esc(e.instructions)}</small>`:''}${running?`<strong data-cardio-clock="${esc(e.id)}">${duration(exerciseDuration(session,e.id))}</strong><progress data-cardio-progress="${esc(e.id)}" max="${e.durationMinutes*60000}" value="${exerciseDuration(session,e.id)}"></progress>`:''}</div>`:''}
 <div class="series-list">${sets.map((s,j)=>`<div class="series-entry ${s.done?'set-complete':next===j&&running?'your-turn':''}"><div class="series-heading"><strong>${cardio?'Duração registrada':'Série '+(j+1)}${next===j&&running&&!cardio?' <em>· Sua vez</em>':''}</strong><small>${hints[j]?'Última: '+fmt(hints[j].value)+' '+(time?'s':'kg')+(time?'':' × '+fmt(hints[j].reps)+' reps'):'Sem histórico correspondente'}</small></div><div class="series-fields">${numericPicker(s.value,e.id,j,'value',time?'Segundos':'Carga (kg)',s.done===true&&!editing)}${time?'':numericPicker(s.reps,e.id,j,'reps','Reps',s.done===true&&!editing)}<button class="set-done ${s.done?'marked':''}" data-set-done="${esc(e.id)}" data-index="${j}" aria-pressed="${s.done===true}" ${running?'':'disabled'}>${s.done?'✓ Feito':'Feito'}</button></div></div>`).join('')}</div>
 ${cardio?'':`<button class="add-set" data-add="${esc(e.id)}">+ Série</button>`}
 <label class="exercise-notes">Observações<textarea data-note="${esc(e.id)}" maxlength="5000" placeholder="Adicionar observação…">${esc(r?.note||'')}</textarea></label>
 ${editing?`<label>Data (opcional)<input type="date" data-date="${esc(e.id)}" value="${esc(r?.date||'')}"></label>`:''}
 <div class="summary" id="stat-${esc(e.id)}"></div></fieldset>
 ${done?'':running?`<button class="finish-exercise" data-complete-exercise="${esc(e.id)}">FINALIZAR EXERCÍCIO</button>`:start}
 </div>`:''}</article>`;
}
export function workoutMarkup(c){
 const {data,exercises,session,day,planId,gymId,openExercises}=c,plans=plansFor(data,exercises),plan=plans.find(p=>p.id===planId)??plans[0],workouts=plan.workouts,items=exercises.filter(e=>e.day===day),last=session?.exerciseIntervals?.at(-1),activeId=session?.status==='running'&&last?.endedAt===null?last.exerciseId:null,done=session?.completedExerciseIds??[];
 const title=plans.flatMap(p=>p.workouts).find(w=>w.id===day)?.name??'Treino '+day;
 const cards=list=>list.map(e=>exerciseMarkup(e,items.indexOf(e),{...c,open:openExercises.has(e.id)})).join('');
 const groups=items.filter(e=>!activeId||e.id===activeId),strength=groups.filter(e=>e.kind!=='cardio'),cardio=groups.filter(e=>e.kind==='cardio');
 return `<div class="training-page ${session?'session-active':'session-selection'}">${session?`
 <section class="session-sticky" aria-label="Controles do treino ativo"><div class="session-top"><div><h1>${esc(title)}</h1><small>${esc(gymName(data,session.gymId))}</small></div><strong class="session-timer" data-session-clock>${duration(elapsed(session))}</strong></div><div class="session-buttons"><button data-workout-action="${session.status==='paused'?'resume':'pause'}">${session.status==='paused'?'▶ Retomar treino':'Ⅱ Pausar treino'}</button><button class="finish-session" data-workout-action="finish">□ Finalizar treino</button></div></section>
 <section class="session-progress"><strong>${done.length} de ${items.length} atividades concluídas${session.status==='paused'?' · Pausado':''}</strong><progress max="${items.length||1}" value="${done.length}"></progress></section>`:`
 <p class="eyebrow">SEU RITMO. SUA EVOLUÇÃO.</p><button class="plan-selector" id="choose-plan" aria-haspopup="dialog"><span>${plan.teacher?`<strong>${esc(plan.teacher)}</strong>`:''}<span>${esc(plan.name)}</span></span><b aria-hidden="true">⌄</b></button>
 <div class="workout-carousel"><div class="workout-tabs" role="group" aria-label="Selecionar treino">${workouts.map(w=>`<button data-day="${esc(w.id)}" class="${day===w.id?'active':''}" aria-pressed="${day===w.id}"><strong>${esc(w.name)}</strong><small>${esc(w.subtitle)}</small></button>`).join('')}</div><button class="carousel-next" id="more-workouts" aria-label="Mais treinos">›</button></div>
 <div class="gym-row"><select id="gym-select" aria-label="Academia"><option value="">Selecione a academia</option>${data.gyms.map(g=>`<option value="${esc(g.id)}" ${g.id===gymId?'selected':''}>${esc(g.name)}</option>`).join('')}</select><button id="add-gym">+ Academia</button></div>
 <button class="start-workout" data-workout-action="start">INICIAR TREINO</button>`}
 ${strength.length?`<h2 class="activity-heading">Musculação · ${items.filter(e=>e.kind!=='cardio').length} exercícios</h2><div class="exercise-list">${cards(strength)}</div>`:''}
 ${cardio.length?`<h2 class="activity-heading">Cardio · ${items.filter(e=>e.kind==='cardio').length} atividade(s)</h2><div class="exercise-list">${cards(cardio)}</div>`:''}
 ${!session?'<button class="quiet-action" id="add-cardio">+ Adicionar cardio a este treino</button>':''}
 </div>`;
}
export function planDialog(data,base){return `<dialog id="plan-dialog"><div class="dialog-heading"><h2>Seus planos</h2><button data-close-dialog aria-label="Fechar">×</button></div><div class="plan-options">${plansFor(data,base).map(p=>`<button data-plan="${esc(p.id)}"><strong>${esc(p.teacher||p.name)}</strong>${p.teacher?`<span>${esc(p.name)}</span>`:''}<small>${p.workouts.length} treinos</small></button>`).join('')}</div><details><summary>Adicionar plano</summary><form id="new-plan"><label>Professor<input name="teacher" maxlength="150" placeholder="Nome do professor"></label><label>Nome do plano<input name="name" required maxlength="200"></label><div id="draft-workouts">${draftWorkout(0)}</div><button type="button" id="add-draft-workout">+ Treino</button><button type="submit" class="finish-exercise">Salvar plano</button></form></details></dialog>`;}
export function draftWorkout(index){return `<fieldset class="draft-workout"><legend>Treino ${String.fromCharCode(65+index)}</legend><label>Nome<input data-draft-name maxlength="100" value="Treino ${String.fromCharCode(65+index)}" required></label><label>Descrição curta<input data-draft-subtitle maxlength="200" placeholder="Ex.: Inferiores + cardio"></label><label>Exercícios (um por linha)<textarea data-draft-exercises required placeholder="Agachamento\nLeg press\nCardio: Esteira | 20 | Leve"></textarea></label><small>Musculação: nome | séries | alvo | kg ou seg | orientação. Apenas nome usa 3 séries e 8–12 reps. Cardio: nome | minutos | orientação, começando por “Cardio:”. Use a prescrição do seu professor.</small></fieldset>`;}
