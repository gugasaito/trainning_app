export function validateResumptions(session){
 if(session.resumptions===undefined)return;
 if(!Array.isArray(session.resumptions)||session.resumptions.length>1000)throw Error('Histórico de retomadas inválido.');
 let previous=session.startedAt;
 for(const r of session.resumptions){if(!r||!Number.isFinite(r.finishedAt)||!Number.isFinite(r.resumedAt)||r.finishedAt<previous||r.resumedAt<r.finishedAt||(session.status==='finished'&&r.resumedAt>session.finishedAt))throw Error('Horários de retomada inválidos.');previous=r.resumedAt;}
}
export function reopenWorkout(data,sessionId,now=Date.now()){
 const next=structuredClone(data),s=next.sessions.find(s=>s.id===sessionId);
 if(!s||s.status!=='finished')throw Error('Selecione um treino finalizado no Histórico.');
 if(next.sessions.some(other=>other.status!=='finished'))throw Error('Finalize o treino ativo antes de retomar outro.');
 if(!Number.isFinite(now)||now<s.finishedAt||s.finishedAt<s.startedAt)throw Error('Confira o relógio do aparelho antes de retomar.');
 if((s.resumptions?.length??0)>=1000)throw Error('Limite de retomadas deste treino atingido.');
 s.resumptions=[...(s.resumptions??[]),{finishedAt:s.finishedAt,resumedAt:now}];
 s.status='running';s.since=now;delete s.finishedAt;
 // Keep the same identity, gym, series, completed exercises and Health summary.
 // Exercise intervals remain closed so the inactive gap is never a new interval.
 validateResumptions(s);return next;
}
export function resumeDialog(sessionId,hasHealth=false){const id=String(sessionId).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));return `<dialog id="resume-workout-dialog"><div class="dialog-heading"><h2>Continuar este treino?</h2><button data-close-dialog aria-label="Fechar">×</button></div><p>Suas séries, cargas e exercícios concluídos serão mantidos. O cronômetro continuará do tempo acumulado, sem somar o período em que o treino ficou finalizado.</p><p>Escolha o exercício que deseja continuar. Os concluídos só serão liberados com “Refazer exercício”.</p>${hasHealth?'<p>Os períodos do Saúde já associados serão preservados. Depois de finalizar a continuação, o Tracker poderá reunir o novo período ao anterior. Retomar aqui não reinicia o Apple Watch.</p>':''}<div class="actions"><button data-close-dialog>Cancelar</button><button class="primary" data-confirm-resume="${id}">Retomar treino</button></div></dialog>`;}
