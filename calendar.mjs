export const DEFAULT_ZONE='America/Sao_Paulo';
export function localDate(at=Date.now(),zone=DEFAULT_ZONE){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at));
 return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
}
export function isoWeek(date){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Data inválida.');
 const d=new Date(date+'T12:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==date)throw Error('Data inválida.');
 d.setUTCDate(d.getUTCDate()+4-(d.getUTCDay()||7));const year=d.getUTCFullYear(),first=new Date(Date.UTC(year,0,1,12));
 const week=Math.ceil((((d-first)/86400000)+1)/7);return {year,week,key:`${year}-W${String(week).padStart(2,'0')}`};
}
export const calendarNow=(at=Date.now(),zone=DEFAULT_ZONE)=>isoWeek(localDate(at,zone));
export const sessionCalendar=s=>calendarNow(s.startedAt,s.timeZone||DEFAULT_ZONE);
export const periodLabel=p=>`Semana ${p.week} de ${p.year}`;
export function calendarRows(data){
 const index=new Map(data.sessions.map(s=>[s.id,s]));
 return data.records.flatMap(r=>{const s=index.get(r.sessionId);let period;try{period=s?sessionCalendar(s):r.date?isoWeek(r.date):null;}catch{period=null;}return period?[{...r,week:period.week,calendarYear:period.year}]:[];});
}
export function historyPeriods(data,exercises){
 const entries=data.sessions.map(s=>({id:s.id,day:s.day,week:s.week,session:s,period:sessionCalendar(s),records:data.records.filter(r=>r.sessionId===s.id)}));
 for(const r of data.records.filter(r=>!r.sessionId)){
  const day=exercises.find(e=>e.id===r.exercise).day;let g=entries.find(g=>g.id==='legacy'&&g.week===r.week&&g.day===day);
  if(!g){g={id:'legacy',day,week:r.week,records:[],period:null};entries.push(g);}g.records.push(r);
 }
 for(const g of entries.filter(g=>g.id==='legacy')){const dates=g.records.map(r=>{try{return r.date?isoWeek(r.date):null}catch{return null}});if(dates.every(p=>p&&p.key===dates[0]?.key))g.period=dates[0];}
 const periods=new Map();for(const g of entries){const key=g.period?.key??`legacy:${g.week}`;if(!periods.has(key))periods.set(key,{key,period:g.period,legacyWeek:g.week,label:g.period?periodLabel(g.period):`Histórico anterior · Semana ${g.week}`,entries:[]});periods.get(key).entries.push(g);}
 const result=[...periods.values()].sort((a,b)=>a.period&&b.period?b.period.year-a.period.year||b.period.week-a.period.week:a.period?-1:b.period?1:b.legacyWeek-a.legacyWeek);
 for(const p of result)p.entries.sort((a,b)=>(b.session?.startedAt??0)-(a.session?.startedAt??0));return result;
}
