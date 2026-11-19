export const isNative=()=>globalThis.__FULLBODY_NATIVE__===1&&!!globalThis.webkit?.messageHandlers?.fullBodyNative;
const pending=new Map();
if(typeof window!=='undefined')window.addEventListener('fullbody:native-response',e=>{const item=pending.get(e.detail?.id);if(!item)return;clearTimeout(item.timer);pending.delete(e.detail.id);e.detail.ok?item.resolve(e.detail.result):item.reject(Error(e.detail.error||'A operação nativa falhou.'));});
export function nativeCall(action,args={}){
 if(!isNative())return Promise.reject(Error('Esta integração requer o aplicativo iOS.'));
 return new Promise((resolve,reject)=>{const id=crypto.randomUUID(),timer=setTimeout(()=>{pending.delete(id);reject(Error('Operação expirou. Tente novamente com o app aberto.'));},120000);pending.set(id,{resolve,reject,timer});try{webkit.messageHandlers.fullBodyNative.postMessage({id,action,...args});}catch(e){clearTimeout(timer);pending.delete(id);reject(e);}});
}
