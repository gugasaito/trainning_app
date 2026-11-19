import {isNative,nativeCall} from './native-bridge.mjs';
import {programWeek} from './program-weeks.mjs';
import {calendarNow,DEFAULT_ZONE} from './calendar.mjs';
import {Accounts,blank,PREFIX,checked} from './accounts.mjs';
import {connect} from './cloud.mjs';
import {gymName} from './gyms.mjs';
import {elapsed,transition} from './session.mjs';
const seed=await fetch('./seed.json').then(r=>{if(!r.ok)throw Error('Não foi possível carregar os exercícios.');return r.json();});
export {seed};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const accountHeader=document.querySelector('#account-header');
let cloud,user=null,generation=0,refreshId=0,busy=false,ready=false,conflict=false,timer,status='Carregando acesso à conta…';
const listeners=new Set();
export const accounts=new Accounts(localStorage,seed.exercises,()=>{paint();for(const cb of listeners)cb();});
export const onChange=cb=>{listeners.add(cb);return ()=>listeners.delete(cb)};
export const getData=()=>accounts.data();
export function saveData(data){accounts.edit(data);status='Sincronização pendente';paint();clearTimeout(timer);timer=setTimeout(sync,2500);}
export function exportData(data=accounts.data(),name='full-body-backup'){
 if(!data)throw Error('Entre na sua conta.');if(isNative()){nativeCall('shareBackup',{json:JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)}).catch(e=>{status=e.message;paint();});return;}const url=URL.createObjectURL(new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name+'-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
function duration(ms){const n=Math.floor(ms/1000);return [Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(n=>String(n).padStart(2,'0')).join(':');}
export function trainingControls(){
 const data=accounts.data(),s=data?.sessions.find(s=>s.status!=='finished');
 if(!data)return '';
 if(!s)return '<div class="workout-controls"><button class="primary" data-action="start">INICIAR TREINO</button></div>';
 return `<div class="workout-controls"><span class="active-clock"><small>${s.status==='paused'?'Pausado':'Em andamento'}</small><strong id="clock">${duration(elapsed(s))}</strong></span><button data-action="${s.status==='paused'?'resume':'pause'}">${s.status==='paused'?'RETOMAR':'PAUSAR'}</button><button class="primary" data-action="finish">FINALIZAR TREINO</button></div>`;
}
function paint(){const version=document.querySelector('#app-version');version.hidden=user?.email?.trim().toLowerCase()!=='gs.saito@gmail.com';version.innerHTML='v3.13.0 - Integração iOS com Saúde <b class="beta-tag">beta</b>';const data=accounts.data();accountHeader.innerHTML=`<p>${user?'Atléta: '+esc(user.email||user.displayName||'Conta Google'):'Entre com Google para acessar seus treinos.'}</p><p role="status">${esc(status)}</p><div class="actions"><button id="account-login">${user?'Sair da conta':'Entrar com Google'}</button>${data?'<button id="account-sync">Sincronizar agora</button>':''}</div>${conflict?'<p>Há versões diferentes. Exporte o backup local antes de recuperar a nuvem.</p><div class="actions"><button id="account-export">Exportar backup local</button><button id="account-recover">Recuperar da nuvem</button></div>':''}`;}
setInterval(()=>{const c=document.querySelector('#clock');if(c)c.textContent=duration(elapsed(accounts.data()?.sessions.at(-1)));},1000);
async function refresh(){if(!cloud||!user||busy)return;const uid=user.uid,token=generation,request=++refreshId,serial=accounts.env?.serial;try{status='Conferindo histórico da conta…';paint();const remote=await cloud.read(uid);if(token!==generation||request!==refreshId||serial!==accounts.env?.serial)return;conflict=accounts.reconcile(remote)==='conflict';ready=true;status=conflict?'Sincronização pausada: versões diferentes':accounts.env.dirty?'Sincronização pendente':'Conta atualizada';paint();if(!conflict)sync();}catch(e){if(token!==generation||request!==refreshId)return;ready=false;status='Sincronização pendente · '+e.message;paint();}}
async function sync(){if(!cloud||!user||!accounts.uid||busy||conflict)return;if(!ready){await refresh();return;}if(!accounts.env.dirty)return;const uid=accounts.uid,token=generation,serial=accounts.env.serial,data=accounts.data(),base=accounts.env.base;busy=true;status='Sincronizando…';paint();try{if(new TextEncoder().encode(JSON.stringify(data)).length>800000)throw Error('Histórico maior que o limite desta versão. Exporte um backup.');const rev=await cloud.write(uid,{state:data,sessions:data.sessions,updatedAt:new Date().toISOString()},base);if(token!==generation)return;accounts.ack(uid,serial,rev);status=accounts.env.dirty?'Sincronização pendente':'Sincronizado com a nuvem';}catch(e){if(token!==generation)return;if(e.code==='tracker/conflict')conflict=true;status='Sincronização pendente · '+e.message;}finally{busy=false;paint();if(accounts.uid&&accounts.env.dirty&&!conflict&&ready) {clearTimeout(timer);timer=setTimeout(sync,15000);}}}
async function handleAccountClick(ev){const b=ev.target.closest('button');if(!b)return;try{
 if(b.id==='account-login'){if(!cloud)throw Error('Conecte-se à internet para carregar o login.');if(user){clearTimeout(timer);generation++;ready=false;accounts.lock();await cloud.logout();}else await cloud.login();return;}
 if(b.id==='account-export'){exportData();return;}
 if(b.id==='account-sync'){await refresh();return;}
 if(b.id==='account-recover'){const uid=accounts.uid,token=generation,serial=accounts.env.serial;const remote=await cloud.read(uid);if(token!==generation)return;if(accounts.env.serial!==serial)throw Error('Os registros mudaram. Tente novamente.');if(!remote)throw Error('Não há histórico na nuvem.');if(confirm('Substituir os dados locais desta conta pela nuvem? Uma cópia local de recuperação será preservada.')){accounts.accept(remote);conflict=false;ready=true;status='Histórico recuperado da nuvem';paint();}return;}
 if(b.id==='account-reset'){if(prompt('Digite o e-mail da conta atual para confirmar a limpeza somente desta conta:')!==user.email)return;accounts.archive();saveData(blank());sync();return;}
 if(b.dataset.action){const data=accounts.data();if(!data)throw Error('Entre na sua conta.');const day=document.querySelector('[data-day].active')?.dataset.day,now=Date.now();if(b.dataset.action==='start'&&!data.programStartDate)throw Error('Confirme a data de início da Semana 1 antes de iniciar.');const computedWeek=b.dataset.action==='start'?programWeek(data.programStartDate,now):data.sessions.at(-1)?.week;if(b.dataset.action==='start'&&!day)throw Error('Abra Treinar e selecione o treino.');const next=transition(data.sessions.at(-1),b.dataset.action,day,computedWeek,now);if(b.dataset.action==='start'){const gymId=document.querySelector('#gym-select')?.value;if(!data.gyms.some(g=>g.id===gymId))throw Error('Selecione ou cadastre a academia antes de iniciar.');next.gymId=gymId;next.programStartDate=data.programStartDate;next.timeZone=DEFAULT_ZONE;data.sessions.push(next);}else data.sessions[data.sessions.length-1]=next;saveData(data);sync();if(b.dataset.action==='finish')window.dispatchEvent(new Event('fullbody:session-finished'));}
 }catch(e){status=e.message;paint();}}
document.addEventListener('click',ev=>{if(ev.target.closest('button[data-action]'))handleAccountClick(ev);});
accountHeader.addEventListener('click',handleAccountClick);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refresh();});
window.addEventListener('online',()=>{if(!cloud)init();else refresh();});
window.addEventListener('storage',e=>{if(e.key===accounts.key()&&accounts.uid){try{const uid=accounts.uid;accounts.open(uid);ready=false;refresh();}catch{accounts.lock();status='Dados alterados em outra aba. Entre novamente.';paint();}}});
async function init(){try{cloud=await connect();cloud.watch(u=>{generation++;clearTimeout(timer);ready=false;conflict=false;accounts.lock();user=u;accounts.email=u?.email||null;if(!u){status='Entre para acessar seus treinos.';paint();return;}try{accounts.open(u.uid);status='Conta carregada neste aparelho';paint();refresh();}catch(e){status='Não foi possível abrir os dados locais: '+e.message;paint();}});}catch(e){status='Login indisponível. Reconecte à internet e reabra o app. '+e.message;paint();}}
paint();init();
