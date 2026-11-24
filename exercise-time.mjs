export function validateExerciseIntervals(session,exercises){
 if(session.completedExerciseIds!==undefined){
  if(!Array.isArray(session.completedExerciseIds)||session.completedExerciseIds.length>exercises.length||new Set(session.completedExerciseIds).size!==session.completedExerciseIds.length||session.completedExerciseIds.some(id=>!exercises.some(e=>e.id===id&&e.day===session.day)))throw Error('Exercícios executados inválidos nesta sessão.');
 }
 if(session.exerciseIntervals===undefined)return;
 if(!Array.isArray(session.exerciseIntervals)||session.exerciseIntervals.length>1000)throw Error('Intervalos de exercícios inválidos.');
 let previousEnd=session.startedAt;
 for(let i=0;i<session.exerciseIntervals.length;i++){
  const item=session.exerciseIntervals[i],exercise=exercises.find(e=>e.id===item?.exerciseId);
  if(!exercise||exercise.day!==session.day||!Number.isFinite(item.startedAt)||item.startedAt<previousEnd||item.startedAt<session.startedAt)throw Error('Intervalo não corresponde ao exercício ou à sessão.');
  if(item.endedAt===null){if(session.status!=='running'||i!==session.exerciseIntervals.length-1)throw Error('Exercício aberto fora de um treino em andamento.');previousEnd=Infinity;}
  else {if(!Number.isFinite(item.endedAt)||item.endedAt<item.startedAt||(session.status==='finished'&&item.endedAt>session.finishedAt))throw Error('Fim do exercício inválido.');previousEnd=item.endedAt;}
 }
}
export function closeExercise(session,now){
 const copy=structuredClone(session),last=copy.exerciseIntervals?.at(-1);
 if(last?.endedAt===null){if(!Number.isFinite(now)||now<last.startedAt)throw Error('O relógio do aparelho mudou. Confira o horário antes de encerrar.');last.endedAt=now;}
 return copy;
}
export function exerciseAction(data,sessionId,exerciseId,action,exercises,now=Date.now()){
 const next=structuredClone(data),session=next.sessions.find(s=>s.id===sessionId),exercise=exercises.find(e=>e.id===exerciseId);
 if(!session||session.status!=='running')throw Error('Inicie ou retome o treino antes de iniciar um exercício.');
 if(!exercise||exercise.day!==session.day)throw Error('Exercício não pertence a este treino.');
 if(session.completedExerciseIds?.includes(exerciseId))throw Error('Exercício finalizado. Clique em Refazer exercício para liberar.');
 if(!Number.isFinite(now)||now<session.startedAt||now<(session.exerciseIntervals?.at(-1)?.endedAt??session.exerciseIntervals?.at(-1)?.startedAt??session.startedAt))throw Error('Horário do exercício inválido.');
 const last=session.exerciseIntervals?.at(-1);
 if(action==='start'){
  if(last?.endedAt===null&&last.exerciseId!==exerciseId)throw Error('Finalize o exercício em andamento antes de iniciar outro.');
  if(last?.endedAt===null&&last.exerciseId===exerciseId)throw Error('Este exercício já está em andamento.');
  if((session.exerciseIntervals?.length??0)>=1000)throw Error('Limite de intervalos desta sessão atingido.');
  session.exerciseIntervals=closeExercise(session,now).exerciseIntervals??[];
  session.exerciseIntervals.push({exerciseId,startedAt:now,endedAt:null});
 }else if(action==='stop'){
  if(last?.endedAt!==null||last.exerciseId!==exerciseId)throw Error('Este exercício não está em andamento.');
  session.exerciseIntervals=closeExercise(session,now).exerciseIntervals;
 }else throw Error('Ação de exercício inválida.');
 validateExerciseIntervals(session,exercises);return next;
}
export function exerciseAt(intervals,at){return intervals.find(i=>at>=i.startedAt&&at<i.endedAt)??null;}
export function exerciseReadings(health,session,exerciseId){
 const intervals=(session?.exerciseIntervals??[]).filter(i=>i.exerciseId===exerciseId&&i.endedAt!==null);
 const points=(health.heartRateTimeline?.points??[]).filter(p=>exerciseAt(intervals,p.at));
 return {points,duration:intervals.reduce((n,i)=>n+i.endedAt-i.startedAt,0),mean:points.length?points.reduce((n,p)=>n+p.bpm,0)/points.length:null,min:points.length?Math.min(...points.map(p=>p.bpm)):null,max:points.length?Math.max(...points.map(p=>p.bpm)):null};
}

export function markExerciseDone(data,sessionId,exerciseId,done,exercises,now=Date.now()){
 const next=structuredClone(data),session=next.sessions.find(s=>s.id===sessionId);
 if(!session||typeof done!=='boolean'||!exercises.some(e=>e.id===exerciseId&&e.day===session.day))throw Error('Selecione uma sessão e um exercício válido.');
 if(session.status==='running'&&session.exerciseIntervals?.at(-1)?.endedAt===null&&session.exerciseIntervals.at(-1).exerciseId!==exerciseId)throw Error('Finalize o exercício em andamento antes de alterar outro exercício.');
 if(done&&session.exerciseIntervals?.at(-1)?.exerciseId===exerciseId&&session.exerciseIntervals.at(-1).endedAt===null)session.exerciseIntervals=closeExercise(session,now).exerciseIntervals;
 const ids=new Set(session.completedExerciseIds??[]);if(done)ids.add(exerciseId);else ids.delete(exerciseId);
 session.completedExerciseIds=[...ids];validateExerciseIntervals(session,exercises);return next;
}
