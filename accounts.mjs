import {validate} from './core.mjs';
export const PREFIX='full-body-tracker:account-v3:';
export const blank=()=>({app:'full-body-tracker',version:2,records:[],sessions:[]});
export function checked(value,exercises){
 const state=validate(value,exercises);
 const sessions=value.sessions??[];
 if(!Array.isArray(sessions)||sessions.length>10000)throw Error('Sessões inválidas.');
 const ids=new Set();
 for(const s of sessions){if(!s||typeof s.id!=='string'||ids.has(s.id)||!['A','B','C'].includes(s.day)||!Number.isInteger(s.week)||s.week<1||s.week>520||!['running','paused','finished'].includes(s.status)||!Number.isFinite(s.elapsed)||s.elapsed<0||!Number.isFinite(s.startedAt)||(s.status==='running'&&!Number.isFinite(s.since))||(s.status==='finished'&&!Number.isFinite(s.finishedAt)))throw Error('Sessão inválida.');ids.add(s.id);}
 if(sessions.filter(s=>s.status!=='finished').length>1)throw Error('Há mais de um treino ativo.');
 return {...state,sessions:structuredClone(sessions)};
}
export const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function remoteEnvelope(remote,exercises){return {data:checked({...remote.state,sessions:remote.sessions??remote.state?.sessions??[]},exercises),revision:Number.isInteger(remote.revision)?remote.revision:0};}
export class Accounts{
 constructor(storage,exercises,onchange=()=>{}){this.storage=storage;this.exercises=exercises;this.onchange=onchange;this.uid=null;this.env=null;}
 key(uid=this.uid){return PREFIX+uid;}
 lock(){this.uid=null;this.env=null;this.onchange();}
 open(uid){this.lock();const raw=this.storage.getItem(this.key(uid));let env=raw?JSON.parse(raw):{data:blank(),dirty:false,base:null,serial:0};env.data=checked(env.data,this.exercises);
 // Migrate only the explicitly recorded legacy owner; never claim unowned data.
 if(!raw){const oldMeta=JSON.parse(this.storage.getItem('full-body-tracker:cloud-v1')||'{}'),old=this.storage.getItem('full-body-tracker:v2');if(old&&oldMeta.owner===uid){env={data:checked({...JSON.parse(old),sessions:JSON.parse(this.storage.getItem('full-body-tracker:sessions-v1')||'[]')},this.exercises),dirty:true,base:null,serial:0};this.storage.setItem(this.key(uid),JSON.stringify(env));}}
 this.uid=uid;this.env=env;this.onchange();return env;
 }
 require(){if(!this.uid||!this.env)throw Error('Entre na sua conta para acessar os treinos.');}
 data(){return this.env?structuredClone(this.env.data):null;}
 persist(env){this.require();this.storage.setItem(this.key(),JSON.stringify(env));this.env=env;this.onchange();}
 edit(data){this.require();this.persist({...this.env,data:checked(data,this.exercises),dirty:true,serial:this.env.serial+1});}
 accept(remote){this.require();const v=remoteEnvelope(remote,this.exercises);this.archive();this.persist({data:v.data,dirty:false,base:v.revision,serial:this.env.serial+1});}
 archive(){this.require();this.storage.setItem(this.key()+':recovery:'+Date.now(),JSON.stringify(this.env));}
 reconcile(remote){this.require();if(!remote){if(this.env.base!==null&&this.env.base!==0)return 'conflict';this.persist({...this.env,base:0});return 'ready';}const r=remoteEnvelope(remote,this.exercises);if(!this.env.dirty){if(!same(this.env.data,r.data)||this.env.base!==r.revision)this.accept(remote);return 'ready';}if(same(this.env.data,r.data)){this.persist({...this.env,base:r.revision,dirty:false});return 'ready';}if(this.env.base===r.revision)return 'ready';return 'conflict';}
 ack(uid,serial,revision){if(this.uid!==uid)return;this.persist({...this.env,base:revision,dirty:this.env.serial!==serial});}
}
