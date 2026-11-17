# FB-016 — v3.12.0: semanas do calendário

Novos treinos recebem automaticamente o ano e a semana ISO da data de início. A semana vai de segunda a domingo e segue a numeração ISO: na virada do ano, alguns dias podem pertencer ao ano ISO anterior ou seguinte. O app usa o fuso America/Sao_Paulo, e grava esse fuso em cada nova sessão. Em 17/11/2026, a identificação é Semana 47 de 2026.

O campo manual Semana foi removido. A tela mostra apenas a indicação automática. Pausar, retomar ou finalizar depois da virada da semana não muda a semana da sessão: vale o início. Sessões de anos diferentes não são misturadas, mesmo quando tenham o mesmo número de semana.

## Histórico existente

Nenhuma série, carga, academia, data, duração ou item da lixeira é removido ou sobrescrito. Sessões antigas que já têm horário de início passam a ser exibidas pela semana do calendário dessa data, mesmo que antes estivessem numeradas manualmente como semana 4 ou 5. A numeração manual original fica preservada nos dados para compatibilidade, mas deixa de definir o agrupamento das sessões com data.

Registros semanais anteriores que não têm sessão ficam no grupo Histórico anterior · Semana X se suas datas forem insuficientes para identificar uma semana de calendário. Quando todas as datas de um grupo são válidas e pertencem à mesma semana, ele pode ser agrupado nessa semana. Não são inventadas datas para redistribuir o histórico.

Os gráficos passam a ter seleção do ano. Somente registros com uma data conhecida entram nos gráficos do calendário; registros sem data continuam acessíveis no Histórico anterior. Por isso, o total anual dos gráficos pode ser menor que a soma de todo o histórico antigo. Os filtros de academia e aparelho continuam disponíveis.

## Atualização

Exporte o backup completo antes de atualizar. Extraia este ZIP e substitua TODOS os arquivos na raiz do repositório, incluindo calendar.mjs. Aguarde Actions ficar verde. Feche todas as abas e janelas antigas do app e reabra com internet. Não edite o mesmo histórico em versões antigas do aplicativo. A conta autorizada verá v3.12.0 - Semanas pelo calendário beta. Não exige alteração de Firebase ou regras.

## Verificação

33 testes automatizados passaram: segunda/domingo, virada do ano ISO, ano bissexto, meia-noite em São Paulo, sessões que atravessam semanas, backup com ano da semana, validação de vínculos, separação de anos e preservação dos 106 registros do backup consolidado. Nenhum registro pessoal foi incluído no ZIP.

Prévia em navegador com conta e nuvem fictícias: campo manual ausente, indicação Semana 47 de 2026, iniciar/finalizar automaticamente, agrupamento de sessão antiga pela data e seleção de ano nos gráficos. A sincronização com o Firebase real precisa ser validada após publicar.
