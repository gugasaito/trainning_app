import {heartTimeline} from './health-model.mjs';
const number=n=>n===null?'Não disponível':n.toLocaleString('pt-BR',{maximumFractionDigits:1});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const elapsedLabel=ms=>{const seconds=Math.floor(ms/1000);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;};
export function chartGeometry(points,start,end,width=320){
 const w=Math.max(160,width),left=34,right=w-10,top=16,bottom=164;
 const low=Math.max(0,Math.floor((Math.min(...points.map(p=>p.bpm))-10)/20)*20),high=Math.ceil((Math.max(...points.map(p=>p.bpm))+10)/20)*20;
 return {width:w,low,high,marks:points.map(p=>({x:left+(p.at-start)/(end-start)*(right-left),y:bottom-(p.bpm-low)/(high-low)*(bottom-top),at:p.at,bpm:p.bpm})),ticks:[low,(low+high)/2,high],left,right,top,bottom};
}
export function heartChart(h){
 if(h.heartRateTimeline===undefined)return '<div class="hr-empty">Gráfico ainda não coletado. No app iOS atualizado, reautorize o Saúde e busque este workout novamente para incluir as amostras disponíveis.</div>';
 const timeline=heartTimeline(h.heartRateTimeline,h.startedAt,h.endedAt);
 if(!timeline.points.length)return '<div class="hr-empty">Timeline não disponível para este workout. Não há amostras individuais acessíveis; os valores do resumo foram preservados.</div>';
 const payload={...timeline,start:h.startedAt,end:h.endedAt};
 return `<div class="hr-horizon" data-heart-chart="${escape(JSON.stringify(payload))}"><div class="hr-kicker">SEU CORPO EM MOVIMENTO</div><h4>O ritmo da sua evolução.</h4><div class="hr-hero"><div><strong>${number(h.heartRateAverageBpm)}</strong>${h.heartRateAverageBpm===null?'':'<span>bpm</span>'}</div><small>Média do workout · Apple Saúde</small></div><div class="hr-subhead"><span>Frequência cardíaca · bpm</span><span>Durante o treino</span></div><svg class="hr-plot" role="img" aria-label="Frequência cardíaca por tempo decorrido no workout; traços representam amostras observadas"></svg><div class="hr-inspect" aria-live="polite"><span data-heart-time></span><strong data-heart-value></strong></div><label class="hr-slider-label">Explorar amostras<input type="range" data-heart-slider min="0" max="${timeline.points.length-1}" step="1" value="0" aria-label="Explorar frequência cardíaca por amostra"></label><div class="hr-metrics"><div><small>MÍNIMA</small><strong>${number(h.heartRateMinBpm)}${h.heartRateMinBpm===null?'':' <em>bpm</em>'}</strong></div><div><small>MÁXIMA</small><strong>${number(h.heartRateMaxBpm)}${h.heartRateMaxBpm===null?'':' <em>bpm</em>'}</strong></div><div><small>WORKOUT</small><strong>${elapsedLabel(h.endedAt-h.startedAt)} <em>min:s</em></strong></div></div><div class="hr-foot">${timeline.points.length} amostra(s) exibida(s)${timeline.reduced?' · seleção reduzida de observações reais':''} · sem interpolação</div></div>`;
}
let observer;
export function enhanceHeartCharts(container){
 observer?.disconnect();
 if(typeof ResizeObserver!=='undefined')observer=new ResizeObserver(entries=>{for(const entry of entries)draw(entry.target)});
 function draw(card){
  const data=JSON.parse(card.dataset.heartChart),svg=card.querySelector('.hr-plot'),slider=card.querySelector('[data-heart-slider]');
  const g=chartGeometry(data.points,data.start,data.end,svg.clientWidth||320),duration=data.end-data.start;
  svg.setAttribute('viewBox',`0 0 ${g.width} 200`);
  const guides=g.ticks.map((v,i)=>{const y=g.bottom-i*(g.bottom-g.top)/2;return `<line x1="${g.left}" x2="${g.right}" y1="${y}" y2="${y}" class="hr-guide"/><text x="${g.left-8}" y="${y+4}" text-anchor="end">${number(v)}</text>`;}).join('');
  const ticks=[0,.5,1].map(f=>`<text x="${g.left+(g.right-g.left)*f}" y="190" text-anchor="${f===0?'start':f===1?'end':'middle'}">${elapsedLabel(duration*f)}</text>`).join('');
  svg.innerHTML=guides+g.marks.map(p=>`<line x1="${p.x}" x2="${p.x}" y1="${p.y-3}" y2="${p.y+3}" class="hr-sample"/>`).join('')+ticks+'<line data-heart-cursor class="hr-cursor"/><circle data-heart-dot r="4" class="hr-dot"/>';
  const move=()=>{const point=g.marks[Number(slider.value)],cursor=svg.querySelector('[data-heart-cursor]'),dot=svg.querySelector('[data-heart-dot]');cursor.setAttribute('x1',point.x);cursor.setAttribute('x2',point.x);cursor.setAttribute('y1',g.top);cursor.setAttribute('y2',g.bottom);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);card.querySelector('[data-heart-time]').textContent=elapsedLabel(point.at-data.start)+' de treino';card.querySelector('[data-heart-value]').textContent=number(point.bpm)+' bpm';slider.setAttribute('aria-valuetext',elapsedLabel(point.at-data.start)+', '+number(point.bpm)+' batimentos por minuto');};
  slider.oninput=move;
  svg.onpointerdown=event=>{const bounds=svg.getBoundingClientRect(),x=(event.clientX-bounds.left)*g.width/bounds.width;let closest=0;g.marks.forEach((p,i)=>{if(Math.abs(p.x-x)<Math.abs(g.marks[closest].x-x))closest=i});slider.value=closest;move();};
  move();
 }
 container.querySelectorAll('[data-heart-chart]').forEach(card=>{draw(card);observer?.observe(card)});
}
