export const elapsed=(s,now=Date.now())=>s?(s.elapsed||0)+(s.status==='running'?Math.max(0,now-s.since):0):0;
export function transition(s,action,day,week,now=Date.now()){
 if(action==='start'){if(s&&s.status!=='finished')throw Error('Finalize o treino atual primeiro.');return {id:String(now),day,week,status:'running',elapsed:0,since:now,startedAt:now};}
 if(!s||s.status==='finished')throw Error('Inicie um treino primeiro.');
 if(action==='pause'&&s.status==='running')return {...s,elapsed:elapsed(s,now),status:'paused',since:null};
 if(action==='resume'&&s.status==='paused')return {...s,status:'running',since:now};
 if(action==='finish')return {...s,elapsed:elapsed(s,now),status:'finished',since:null,finishedAt:now};
 throw Error('Ação indisponível.');
}
