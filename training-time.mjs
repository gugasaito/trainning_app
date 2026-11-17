import {elapsed} from './session.mjs';
export function trainingTime(session,now=Date.now()){
 if(!session||!Number.isFinite(session.startedAt))return null;
 const end=session.status==='finished'?session.finishedAt:now;
 if(!Number.isFinite(end))return null;
 return {total:Math.max(0,end-session.startedAt),active:elapsed(session,now)};
}
export function timeLabel(ms){const seconds=Math.floor(ms/1000);return [Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');}
