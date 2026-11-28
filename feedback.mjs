export const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function feedbackKind(text){
 if(/não foi possível|inválid|falh|erro|error|failed|invalid|denied|expired|exceeded|not allowed|indisponível|expir|diferentes|pausada|conflito|quota|limite|libere espaço/i.test(text))return 'error';
 if(/pendente|nenhum|nenhuma|aguard|confira|selecione|precisa|incomplet|desligad|tente novamente|autorize|entre na sua conta|antes de|não coincide|já está|já foi/i.test(text))return 'warning';
 if(/sucesso|concluí|concluíd|salv[ao]|atualizad|sincronizado|associad|desvinculad|restaurad|finalizado|retomado|adicionado|removido|liberado|preservad|solicitad/i.test(text))return 'success';
 return 'info';
}
export const feedbackIcon=kind=>({success:'✓',warning:'!',error:'×',info:'↻'}[kind]??'↻');
export function feedbackMarkup(text,kind=feedbackKind(text)){if(!text)return '';return `<p class="feedback feedback-${kind}" role="${kind==='error'?'alert':'status'}"><span aria-hidden="true">${feedbackIcon(kind)}</span><span>${escapeText(text)}</span></p>`;}
