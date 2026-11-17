# Correção FB-016 — v3.12.1

Esta versão substitui a interpretação incorreta da v3.12.0. A numeração é progressiva: Semana 1, Semana 2, Semana 3… Cada semana começa na segunda-feira e termina no domingo. Não usa o número da semana do ano, e a contagem não reinicia no Ano Novo. O fuso permanece America/Sao_Paulo.

Na primeira abertura, confirme uma única vez a data da segunda-feira em que começou a Semana 1. Se houver uma sessão antiga com numeração manual, o app sugere uma referência compatível com a sessão mais recente. Confira a proposta antes de confirmar. Para os dados enviados, a sessão da Semana 5 em 17/11/2026 corresponde à proposta de início em 19/10/2026. Isso é uma proposta, não uma data histórica comprovada. Sem sessão antiga suficiente, a proposta é a segunda-feira atual.

Depois de confirmar, não há campo manual de Semana. Cada novo treino recebe a semana automaticamente pela data de início. Pausas e retomadas preservam a semana em que a sessão começou. A data inicial fica na conta, backup e sincronização.

Os registros antigos e suas semanas manuais são preservados, incluindo históricos sem data. Gráficos voltam a somar as semanas progressivas e incluem o histórico antigo. Se a versão incorreta v3.12.0 chegou a criar sessões com ano/semana de calendário, elas são exibidas na semana progressiva correspondente à referência confirmada, sem reescrever suas séries originais.

Antes de atualizar, exporte o backup completo. Substitua todos os arquivos do repositório por este ZIP, incluindo program-weeks.mjs, aguarde Actions e feche todas as janelas antigas do app. Reabra e confirme a data inicial do programa. Não edite o histórico com versões antigas em paralelo. Firebase e regras não mudam.

38 testes automatizados passaram: segunda/domingo, virada do ano, preservação de numeração antiga, backup da data inicial, rejeição de semanas incompatíveis e tratamento das sessões da versão incorreta. Sintaxe de todos os módulos e ZIP verificados. Esta correção ainda precisa ser validada no aparelho após publicação; não houve gravação em sua conta Firebase.
