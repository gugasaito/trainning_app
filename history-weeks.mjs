import {progressivePeriods,monday} from './program-weeks.mjs';
import {localDate,isoWeek,DEFAULT_ZONE} from './calendar.mjs';
import {sessionHealthWorkouts,sessionPeriods} from './health-model.mjs';
const WEEK=7*86400000;
function entryMonday(entry){
 if(entry.session)return monday(localDate(entry.session.startedAt,entry.session.timeZone||DEFAULT_ZONE));
 const dates=entry.records.map(r=>r.date?monday(r.date):null);return dates.length&&dates.every(d=>d&&d===dates[0])?dates[0]:null;
}
function shifted(day,weeks){return new Date(Date.parse(day+'T12:00:00Z')+weeks*WEEK).toISOString().slice(0,10);}
export function historyWeeks(data,exercises){
 const periods=progressivePeriods(data,exercises).map(p=>({...p,key:'program:'+p.week,entries:p.entries.map(e=>({...e,kind:'workout',at:e.session?.startedAt??(e.records.find(r=>r.date)?.date?Date.parse(e.records.find(r=>r.date).date+'T12:00:00Z'):0)}))}));
 const byKey=new Map(periods.map(p=>[p.key,p])),byMonday=new Map();
 for(const p of periods)for(const e of p.entries){const day=entryMonday(e);if(day){if(!byMonday.has(day))byMonday.set(day,new Set());byMonday.get(day).add(p.week);p.sortDate=p.sortDate&&p.sortDate>day?p.sortDate:day;}}
 let anchor=data.programStartDate??null;
 if(!anchor){const dated=periods.flatMap(p=>p.entries.filter(e=>e.session).map(e=>({week:p.week,entry:e}))).sort((a,b)=>b.entry.at-a.entry.at)[0];if(dated)anchor=shifted(entryMonday(dated.entry),1-dated.week);}
 for(const activity of data.activities??[]){
  const day=monday(localDate(activity.startedAt,DEFAULT_ZONE)),matches=byMonday.get(day),number=anchor?Math.floor((Date.parse(day+'T12:00:00Z')-Date.parse(anchor+'T12:00:00Z'))/WEEK)+1:null;
  let week=matches?.size===1?[...matches][0]:matches?.has(number)?number:!matches&&number>=1&&number<=520?number:null;
  const calendar=isoWeek(localDate(activity.startedAt,DEFAULT_ZONE)),key=week===null?'calendar:'+calendar.key:'program:'+week;
  if(!byKey.has(key)){const p={key,week,label:week===null?`Semana ${calendar.week} de ${calendar.year}`:`Semana ${week}`,entries:[],sortDate:day};periods.push(p);byKey.set(key,p);}
  const p=byKey.get(key);p.entries.push({kind:'activity',id:activity.id,activity,records:[],at:activity.startedAt});p.sortDate=p.sortDate&&p.sortDate>day?p.sortDate:day;
 }
 for(const p of periods){if(!p.sortDate&&anchor&&p.week!==null)p.sortDate=shifted(anchor,p.week-1);p.entries.sort((a,b)=>b.at-a.at||a.kind.localeCompare(b.kind)||a.id.localeCompare(b.id));}
 return periods.sort((a,b)=>a.sortDate&&b.sortDate?b.sortDate.localeCompare(a.sortDate):a.sortDate?-1:b.sortDate?1:(b.week??0)-(a.week??0));
}
export function weeklyCalories(entries){
 const sources=new Map();let duplicates=0;
 const add=(key,value,at=0)=>{if(sources.has(key)){duplicates++;if(sources.get(key).at>at)return;}sources.set(key,{value:typeof value==='number'&&Number.isFinite(value)&&value>=0?value:null,at});};
 for(const e of entries){
  if(e.kind==='activity'){const a=e.activity;if(a.health)add('health:'+a.health.workoutId,a.health.activeCaloriesKcal,a.health.updatedAt);else add('manual:'+a.id,a.activeCaloriesKcal,a.updatedAt);}
  else {const parts=e.session?sessionHealthWorkouts(e.session):[],periods=e.session?sessionPeriods(e.session):[];if(parts.length){for(const h of parts)add('health:'+h.workoutId,h.activeCaloriesKcal,h.updatedAt);for(const [index,p] of periods.entries())if(!parts.some(h=>Math.min(p.finishedAt,h.endedAt)>Math.max(p.startedAt,h.startedAt)))add('unknown:'+e.id+':period:'+index,null);}else for(let index=0;index<Math.max(1,periods.length);index++)add('unknown:'+e.id+':'+e.day+':'+e.week+':'+index,null);if(e.session&&e.session.status!=='finished'&&parts.length)add('unknown:'+e.id+':active',null);}
 }
 const known=[...sources.values()].filter(s=>s.value!==null),missing=sources.size-known.length;
 return {total:known.length?known.reduce((n,s)=>n+s.value,0):null,known:known.length,missing,partial:missing>0,duplicates};
}
