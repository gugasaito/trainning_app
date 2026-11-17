import {localDate,isoWeek,DEFAULT_ZONE} from './calendar.mjs';
const DAY=86400000;
export function monday(date){isoWeek(date);const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d.toISOString().slice(0,10);}
export function validStart(date){return typeof date==='string'&&monday(date)===date;}
export function programWeek(start,at=Date.now(),zone=DEFAULT_ZONE){if(!validStart(start))throw Error('A Semana 1 deve começar em uma segunda-feira.');const date=localDate(at,zone),days=(Date.parse(date+'T12:00:00Z')-Date.parse(start+'T12:00:00Z'))/DAY;const week=Math.floor(days/7)+1;if(week<1||week>520)throw Error('A data está fora das semanas 1 a 520 do programa.');return week;}
export function suggestedStart(data,at=Date.now()){
 const s=data.sessions.filter(s=>s.weekYear===undefined&&!s.programStartDate).sort((a,b)=>b.startedAt-a.startedAt)[0];
 if(!s)return monday(localDate(at));const d=new Date(monday(localDate(s.startedAt,s.timeZone||DEFAULT_ZONE))+'T12:00:00Z');d.setUTCDate(d.getUTCDate()-(s.week-1)*7);return d.toISOString().slice(0,10);
}
export function displayedWeek(s,data){if(s.weekYear!==undefined&&data.programStartDate)return programWeek(data.programStartDate,s.startedAt,s.timeZone||DEFAULT_ZONE);return s.week;}
export function progressiveRows(data){const sessions=new Map(data.sessions.map(s=>[s.id,s]));return data.records.map(r=>{const s=sessions.get(r.sessionId);return s?{...r,week:displayedWeek(s,data)}:r;});}
export function progressivePeriods(data,exercises){
 const groups=data.sessions.map(s=>({id:s.id,day:s.day,week:s.week,displayWeek:displayedWeek(s,data),session:s,records:data.records.filter(r=>r.sessionId===s.id)}));
 for(const r of data.records.filter(r=>!r.sessionId)){const day=exercises.find(e=>e.id===r.exercise).day;let g=groups.find(g=>g.id==='legacy'&&g.week===r.week&&g.day===day);if(!g){g={id:'legacy',day,week:r.week,displayWeek:r.week,records:[]};groups.push(g);}g.records.push(r);}
 const periods=new Map();for(const g of groups){if(!periods.has(g.displayWeek))periods.set(g.displayWeek,{week:g.displayWeek,label:`Semana ${g.displayWeek}`,entries:[]});periods.get(g.displayWeek).entries.push(g);}const result=[...periods.values()].sort((a,b)=>b.week-a.week);for(const p of result)p.entries.sort((a,b)=>(b.session?.startedAt??0)-(a.session?.startedAt??0));return result;
}
