export const KEY='full-body-tracker:v2';
export const emptySets=e=>Array.from({length:e.sets},()=>({value:null,reps:null}));
export function metrics(record,exercise){
 const sets=record?.sets||[], time=exercise.unit==='seg';
 const values=sets.filter(s=>s.value!==null).map(s=>s.value);
 const complete=sets.filter(s=>s.value!==null&&(time||s.reps!==null));
 return {total:complete.length?complete.reduce((n,s)=>n+s.value*(time?1:s.reps),0):null,mean:values.length?values.reduce((a,b)=>a+b,0)/values.length:null,incomplete:sets.filter(s=>!time&&(s.value===null)!==(s.reps===null)).length,complete:complete.length};
}
export function weekly(records,exercises,week){
 const all=records.filter(r=>r.week===week).map(r=>({e:exercises.find(e=>e.id===r.exercise),r}));
 const ms=all.filter(x=>x.e.unit!=='seg').map(x=>metrics(x.r,x.e));
 return {total:ms.some(m=>m.total!==null)?ms.reduce((n,m)=>n+(m.total??0),0):null,incomplete:ms.reduce((n,m)=>n+m.incomplete,0)};
}
export function validate(input,exercises){
 if(input?.app!=='full-body-tracker'||input.version!==2||!Array.isArray(input.records)||input.records.length>50000)throw Error('Formato de backup incompatível. Use um backup v2 deste aplicativo.');
 const keys=new Set();
 for(const r of input.records){
  const e=exercises.find(e=>e.id===r.exercise),key=r.exercise+':'+r.week;
  if(!e||!Number.isInteger(r.week)||r.week<1||r.week>520||keys.has(key)||!Array.isArray(r.sets)||r.sets.length<1||r.sets.length>20||typeof r.note!=='string'||r.note.length>5000||typeof r.date!=='string'||(r.date!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!Number.isFinite(Date.parse(r.date)))))throw Error('Backup contém registros inválidos ou duplicados.');
  keys.add(key);
  for(const s of r.sets)for(const k of ['value','reps'])if(s[k]!==null&&(typeof s[k]!=='number'||!Number.isFinite(s[k])||s[k]<0||s[k]>100000||(k==='reps'&&!Number.isInteger(s[k]))))throw Error('Backup contém valores inválidos.');
 }
 return {app:'full-body-tracker',version:2,records:input.records.map(r=>({exercise:r.exercise,week:r.week,sets:r.sets.map(s=>({value:s.value,reps:s.reps})),note:r.note,date:r.date,source:typeof r.source==='string'?r.source:'backup'}))};
}
