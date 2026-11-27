import {transition} from './session.mjs';
import {exerciseAction} from './exercise-time.mjs';
import {programWeek,suggestedStart} from './program-weeks.mjs';
import {DEFAULT_ZONE} from './calendar.mjs';
export function beginWorkout(data,day,gymId,exercises,now=Date.now()){
 if(data.sessions.some(s=>s.status!=='finished'))throw Error('Finalize o treino atual primeiro.');
 if(!exercises.some(e=>e.day===day))throw Error('Treino não encontrado.');
 if(!data.gyms.some(g=>g.id===gymId))throw Error('Selecione ou cadastre a academia antes de iniciar.');
 const next=structuredClone(data);next.programStartDate??=suggestedStart(next,now);
 const s={...transition(null,'start',day,programWeek(next.programStartDate,now),now),gymId,programStartDate:next.programStartDate,timeZone:DEFAULT_ZONE};next.sessions.push(s);return next;
}
export function beginExercise(data,exerciseId,gymId,exercises,now=Date.now()){
 const e=exercises.find(e=>e.id===exerciseId);if(!e)throw Error('Exercício não encontrado.');
 let next=structuredClone(data),s=next.sessions.find(s=>s.status!=='finished');
 if(!s){next=beginWorkout(next,e.day,gymId,exercises,now);s=next.sessions.at(-1);}
 if(s.status==='paused')throw Error('Retome o treino antes de iniciar um exercício.');
 return exerciseAction(next,s.id,e.id,'start',exercises,now);
}
export function setDone(data,sessionId,exerciseId,index,exercises,now=Date.now()){
 const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId),r=next.records.find(r=>r.sessionId===sessionId&&r.exercise===exerciseId),e=exercises.find(e=>e.id===exerciseId),st=r?.sets[index];
 if(!s||!e||!st)throw Error('Preencha a série antes de marcar Feito.');
 if(s.completedExerciseIds?.includes(e.id))throw Error('Use Refazer exercício para alterar.');
 if(s.status!=='running'||s.exerciseIntervals?.at(-1)?.exerciseId!==exerciseId||s.exerciseIntervals.at(-1).endedAt!==null)throw Error('Inicie este exercício para marcar a série.');
 if(st.done){delete st.done;delete st.completedAt;return next;}
 if(st.value===null||(e.unit!=='seg'&&st.reps===null))throw Error('Preencha a carga e as repetições da série.');
 st.done=true;st.completedAt=now;return next;
}
export function exerciseDuration(session,id,now=Date.now()) {return (session?.exerciseIntervals??[]).filter(i=>i.exerciseId===id).reduce((n,i)=>n+Math.max(0,(i.endedAt??now)-i.startedAt),0);}

export function recordCardioDuration(data,sessionId,exercises,now=Date.now()){
 const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId);if(!s)return next;
 for(const e of exercises.filter(e=>e.day===s.day&&e.kind==='cardio')){const ms=exerciseDuration(s,e.id,now);if(!ms)continue;let r=next.records.find(r=>r.sessionId===s.id&&r.exercise===e.id);if(!r){r={exercise:e.id,week:s.week,sessionId:s.id,...(s.weekYear===undefined?{}:{weekYear:s.weekYear}),equipment:'',sets:[{value:null,reps:null}],note:'',date:'',source:'app'};next.records.push(r);}const lastFinish=s.resumptions?.at(-1)?.finishedAt;const previousMs=lastFinish===undefined?null:(s.exerciseIntervals??[]).filter(i=>i.exerciseId===e.id&&i.startedAt<lastFinish).reduce((n,i)=>n+Math.max(0,Math.min(i.endedAt??lastFinish,lastFinish)-i.startedAt),0);if(r.sets[0].value===null||(r.source==='app'&&previousMs!==null&&r.sets[0].value===Math.floor(previousMs/1000)))r.sets[0].value=Math.floor(ms/1000);}
 return next;
}
