import {combinedHealth} from './health-combined.mjs';
import {exerciseAt,exerciseReadings} from './exercise-time.mjs';
import {heartTimeline} from './health-model.mjs';
const number=n=>n===null?'Não disponível':n.toLocaleString('pt-BR',{maximumFractionDigits:1});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const elapsedLabel=ms=>{const seconds=Math.floor(ms/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
export function chartGeometry(points,start,end,width=320){
 const w=Math.max(160,width),left=34,right=w-10,top=16,bottom=164;
 const low=Math.max(0,Math.floor((Math.min(...points.map(p=>p.bpm))-10)/20)*20),high=Math.ceil((Math.max(...points.map(p=>p.bpm))+10)/20)*20;
 return {width:w,low,high,marks:points.map(p=>({x:left+(p.at-start)/(end-start)*(right-left),y:bottom-(p.bpm-low)/(high-low)*(bottom-top),at:p.at,bpm:p.bpm})),ticks:[low,(low+high)/2,high],left,right,top,bottom};
}
export function heartChart(h,session=null,exercises=[],presentation={}){
 if(h.parts)h=combinedHealth({health:h.parts[0],healthWorkouts:h.parts});
 if(h.heartRateTimeline===undefined)return '<div class="hr-empty">Gráfico ainda não coletado. No app iOS atualizado, reautorize o Saúde e busque este workout novamente para incluir as amostras disponíveis.</div>';
 const timeline=heartTimeline(h.heartRateTimeline,h.startedAt,h.endedAt,h.parts?180*h.parts.length:180);
 if(!timeline.points.length)return '<div class="hr-empty">Timeline não disponível para este workout. Não há amostras individuais acessíveis; os valores do resumo foram preservados.</div>';
 const intervals=(session?.exerciseIntervals??[]).filter(i=>i.endedAt!==null).map(i=>({...i,name:exercises.find(e=>e.id===i.exerciseId)?.name||i.exerciseId}));
 const payload={...timeline,workoutDuration:h.duration??h.endedAt-h.startedAt,meanLabel:h.parts?'Média das amostras exibidas · períodos combinados':'Média do workout · Apple Saúde',periods:(h.parts??[h]).map(p=>({startedAt:p.startedAt,endedAt:p.endedAt})),start:h.startedAt,end:h.endedAt,intervals,mean:h.heartRateAverageBpm,min:h.heartRateMinBpm,max:h.heartRateMaxBpm};
 const choices=[...new Map(intervals.map(i=>[i.exerciseId,i.name])).entries()];
 const picker=choices.length?`<label class="hr-exercise-label">Batimentos por exercício<select data-heart-exercise><option value="">Treino completo</option>${choices.map(([id,name])=>`<option value="${escape(id)}">${escape(name)}</option>`).join('')}</select></label>`:'<p class="hr-exercise-note">Sem intervalos de exercícios registrados nesta sessão. Use Iniciar exercício nos próximos treinos.</p>';
 return `<div class="hr-horizon${presentation.compact?' hr-horizon-compact':''}" data-heart-chart="${escape(JSON.stringify(payload))}">${presentation.compact?'':'<div class="hr-kicker">SEU CORPO EM MOVIMENTO</div><h4>O ritmo da sua evolução.</h4>'}<div class="hr-hero"><div><strong data-heart-mean>${number(h.heartRateAverageBpm)}</strong><span data-heart-unit ${h.heartRateAverageBpm===null?'hidden':''}>bpm</span></div><small data-heart-mean-label>${escape(payload.meanLabel)}</small></div>${presentation.compact?'':'<div class="hr-subhead"><span>Frequência cardíaca · bpm</span><span>Durante o treino</span></div>'}${picker}<svg class="hr-plot" role="img" aria-label="Frequência cardíaca por tempo decorrido no workout; traços representam amostras observadas"></svg><div class="hr-inspect" aria-live="polite"><span data-heart-time></span><strong data-heart-value></strong></div><p class="hr-exercise-point" data-heart-current></p><label class="hr-slider-label">Explorar amostras<input type="range" data-heart-slider min="0" max="${timeline.points.length-1}" step="1" value="0" aria-label="Explorar frequência cardíaca por amostra"></label><div class="hr-metrics"><div><small>MÍNIMA</small><strong data-heart-min>${number(h.heartRateMinBpm)}${h.heartRateMinBpm===null?'':' <em>bpm</em>'}</strong></div><div><small>MÁXIMA</small><strong data-heart-max>${number(h.heartRateMaxBpm)}${h.heartRateMaxBpm===null?'':' <em>bpm</em>'}</strong></div><div><small data-heart-duration-label>WORKOUT</small><strong data-heart-duration>${elapsedLabel(payload.workoutDuration)} <em>min:s</em></strong></div></div><div class="hr-foot" data-heart-foot>${timeline.points.length} amostra(s) exibida(s)${timeline.reduced?' · seleção reduzida de observações reais':''} · sem interpolação</div></div>`;
}
let observer;
export function enhanceHeartCharts(container){
 observer?.disconnect();
 if(typeof ResizeObserver!=='undefined')observer=new ResizeObserver(entries=>{for(const entry of entries)draw(entry.target)});
 function draw(card){
  const data=JSON.parse(card.dataset.heartChart),svg=card.querySelector('.hr-plot'),slider=card.querySelector('[data-heart-slider]'),select=card.querySelector('[data-heart-exercise]'),selected=select?.value||'';
  const readings=selected?exerciseReadings({heartRateTimeline:{points:data.points}},{exerciseIntervals:data.intervals},selected):null;
  const points=readings?.points??data.points;
  const g=chartGeometry(data.points,data.start,data.end,svg.clientWidth||320),duration=data.end-data.start;
  // All views share the full workout axes, so gaps and exercise boundaries keep their real timestamps.
  const selectedMarks=g.marks.filter(p=>!selected||exerciseAt(data.intervals.filter(i=>i.exerciseId===selected),p.at));
  svg.setAttribute('viewBox',`0 0 ${g.width} 200`);
  const guides=g.ticks.map((v,i)=>{const y=g.bottom-i*(g.bottom-g.top)/2;return `<line x1="${g.left}" x2="${g.right}" y1="${y}" y2="${y}" class="hr-guide"/><text x="${g.left-8}" y="${y+4}" text-anchor="end">${number(v)}</text>`;}).join('');
  const ticks=[0,.5,1].map(f=>`<text x="${g.left+(g.right-g.left)*f}" y="190" text-anchor="${f===0?'start':f===1?'end':'middle'}">${elapsedLabel(duration*f)}</text>`).join('');
  const x=t=>g.left+(t-data.start)/duration*(g.right-g.left);
  const bands=(data.intervals??[]).filter(i=>!selected||i.exerciseId===selected).map(i=>{const start=Math.max(data.start,i.startedAt),end=Math.min(data.end,i.endedAt);return end>start?`<rect x="${x(start)}" y="${g.top}" width="${x(end)-x(start)}" height="${g.bottom-g.top}" class="hr-exercise-band"/><line x1="${x(start)}" x2="${x(start)}" y1="${g.top}" y2="${g.bottom}" class="hr-exercise-boundary"/>`:'';}).join('');
  const gaps=(data.periods??[]).slice(1).map((p,i)=>{const previous=data.periods[i];return p.startedAt>previous.endedAt?`<rect x="${x(previous.endedAt)}" y="${g.top}" width="${x(p.startedAt)-x(previous.endedAt)}" height="${g.bottom-g.top}" class="hr-session-gap"><title>Interrupção entre períodos · sem amostras</title></rect>`:'';}).join('');
  svg.innerHTML=gaps+bands+guides+g.marks.map(p=>{const included=!selected||exerciseAt(data.intervals.filter(i=>i.exerciseId===selected),p.at);return `<line x1="${p.x}" x2="${p.x}" y1="${p.y-3}" y2="${p.y+3}" class="hr-sample" opacity="${included?1:.16}"/>`;}).join('')+ticks+'<line data-heart-cursor class="hr-cursor"/><circle data-heart-dot r="4" class="hr-dot"/>';
  const mean=card.querySelector('[data-heart-mean]');mean.textContent=number(readings?readings.mean:data.mean);
  const unit=card.querySelector('[data-heart-unit]');if(unit)unit.hidden=(readings?readings.mean:data.mean)===null;
  card.querySelector('[data-heart-mean-label]').textContent=selected?'Média das amostras exibidas · '+(data.intervals.find(i=>i.exerciseId===selected)?.name||selected):data.meanLabel;
  card.querySelector('[data-heart-min]').textContent=number(readings?readings.min:data.min)+((readings?readings.min:data.min)===null?'':' bpm');
  card.querySelector('[data-heart-max]').textContent=number(readings?readings.max:data.max)+((readings?readings.max:data.max)===null?'':' bpm');
  card.querySelector('[data-heart-duration]').textContent=elapsedLabel(readings?readings.duration:data.workoutDuration)+' min:s';
  card.querySelector('[data-heart-duration-label]').textContent=selected?'EXERCÍCIO':'WORKOUT';
  card.querySelector('[data-heart-foot]').textContent=points.length+' amostra(s) exibida(s)'+(data.reduced?' · seleção reduzida de observações reais':'')+' · sem interpolação'+(selected?' · médias calculadas apenas com estas amostras':'');
  slider.max=Math.max(0,selectedMarks.length-1);slider.value=Math.min(Number(slider.value),Math.max(0,selectedMarks.length-1));slider.disabled=!selectedMarks.length;
  const move=()=>{
   const point=selectedMarks[Number(slider.value)],cursor=svg.querySelector('[data-heart-cursor]'),dot=svg.querySelector('[data-heart-dot]');
   if(!point){cursor.style.display='none';dot.style.display='none';card.querySelector('[data-heart-time]').textContent='Sem amostras neste exercício';card.querySelector('[data-heart-value]').textContent='Não disponível';card.querySelector('[data-heart-current]').textContent='O intervalo foi registrado, mas nenhuma amostra acessível coincide com ele.';return;}
   cursor.setAttribute('x1',point.x);cursor.setAttribute('x2',point.x);cursor.setAttribute('y1',g.top);cursor.setAttribute('y2',g.bottom);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);
   card.querySelector('[data-heart-time]').textContent=elapsedLabel(point.at-data.start)+' de treino';card.querySelector('[data-heart-value]').textContent=number(point.bpm)+' bpm';
   const interval=exerciseAt(data.intervals??[],point.at);card.querySelector('[data-heart-current]').textContent=interval?'Exercício: '+interval.name:'Intervalo sem exercício marcado';
   slider.setAttribute('aria-valuetext',elapsedLabel(point.at-data.start)+', '+number(point.bpm)+' batimentos por minuto'+(interval?', '+interval.name:''));
  };
  slider.oninput=move;if(select)select.onchange=()=>{slider.value=0;draw(card)};
  svg.onpointerdown=event=>{if(!selectedMarks.length)return;const bounds=svg.getBoundingClientRect(),x=(event.clientX-bounds.left)*g.width/bounds.width;let closest=0;selectedMarks.forEach((p,i)=>{if(Math.abs(p.x-x)<Math.abs(selectedMarks[closest].x-x))closest=i});slider.value=closest;move();};
  move();
 }
 container.querySelectorAll('[data-heart-chart]').forEach(card=>{draw(card);observer?.observe(card)});
}
