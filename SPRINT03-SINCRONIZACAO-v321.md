# Sprint 03 — Sincronização acompanhada — v3.21.0 PRODUÇÃO

Entrega local preparada em 28/11/2026. FB-018 e FB-023 em revisão. Nenhum envio ao GitHub, PR, merge ou deploy realizado. Inclui as entregas das Sprints 01 e 02.

## Comportamento

Com integração e atualização automática habilitadas, uma sessão finalizada entra em consulta. Se o workout ainda não estiver disponível no Saúde, permanece aguardando, com texto explícito e opção Tentar novamente. O app não deduz que faltam treinos ou permissões somente porque a lista está vazia.

Cada ciclo faz uma consulta inicial e até cinco novas tentativas, após 5, 15, 30, 60 e 120 segundos. São no máximo seis tentativas por ciclo. O ciclo limita-se às dez sessões finalizadas mais recentemente nos últimos sete dias. Sessões mais antigas continuam com busca manual. A fila não é enviada ao Firebase: é reconstruída a partir das sessões ao abrir/voltar ao app.

As consultas automáticas só continuam com o app visível. Ao ir para segundo plano, sair/trocar de conta, desligar automático ou integração, as tentativas agendadas são canceladas e respostas antigas não podem gravar dados. Uma consulta nativa já enviada pode terminar; seu resultado é descartado se o contexto tiver mudado. Consultas de períodos adicionais conferem novamente a autorização e o estado antes de prosseguir.

Ao esgotar o ciclo, aparece uma orientação para conferir Watch, disponibilidade no Saúde, permissões e usar Tentar novamente ou busca manual. Voltar ao app ou tocar em Tentar novamente inicia um novo ciclo controlado. Não há execução contínua com o app fechado nem nova capacidade nativa de background.

## Estados e mensagens

- Buscando: informativo, com texto e ícone.
- Aguardando registro / parcialmente associado: aviso vermelho, preservando o que já foi salvo.
- Precisa da sua escolha: aviso vermelho, sem escolher arbitrariamente ou repetir tentativas por ambiguidade.
- Associado: confirmação verde, com número de períodos e lembrete para conferir a sincronização da conta.
- Erro: vermelho, com causa disponível e tentativa controlada; dados salvos não são apagados.

O Histórico e a aba Saúde identificam o treino ao qual a pendência pertence. Cabeçalho da conta, avisos gerais e retornos de atividades recebem texto/ícone e cores de resultado. A confirmação da associação local não é apresentada como confirmação de gravação no Firebase: a nuvem mantém seu status próprio.

Reautorizar o Saúde preserva a opção automática se ela já estava habilitada. Na primeira autorização ou após desligar a integração, automático continua desmarcado até escolha explícita. Habilitar automático inicia a primeira consulta imediatamente, sem exigir sair e voltar.

## Regras preservadas

Nada inicia ou finaliza o Watch automaticamente. Se o Tracker ainda estiver em andamento, não o finaliza nem associa um registro como se tivesse acabado. As associações continuam conservadoras, com deduplicação por UUID, proteção contra sobreposição, conta e consentimento verificados. Se houver retomada, os períodos de manhã e tarde continuam na mesma sessão e a parte já associada não é substituída pela que chega depois. Séries e medidas existentes não são apagadas.

## Validação local

169 testes da suíte passaram com dados fictícios, incluindo 19 cenários da Sprint 03. Cobrem chegada tardia, Watch primeiro/Tracker primeiro, ausência com limite, ambiguidade, retomadas, background, troca de conta, desligamento durante consulta, sessão reaberta, reautorização, erro nativo, gravação local sem espaço, sinais de foreground duplicados e interrupção entre consultas de períodos. Feedback foi verificado para classificação, escape e semântica acessível.

Prévia mobile com nuvem e Saúde fictícios mostrou aviso vermelho aguardando registro; após disponibilizar os dois períodos e solicitar nova tentativa, mostrou confirmação verde, dois períodos unificados e 500 kcal. Console sem erros. Nenhum Firebase real, dado real ou Saúde real foi utilizado. Ainda falta validar no iPhone beta com HealthKit real.

## Pacote e destino

Pacote completo do aplicativo, não apenas relatório: index.html, módulos, estilo, imagens, testes e arquivos ocultos de configuração.
Destino de produção: raiz de gugasaito/trainning_app, em https://gugasaito.github.io/trainning_app/.
Configuração Firebase e prefixo de armazenamento de produção preservados; cache full-body-prod-v3210-20261128-1.
Branch sugerida: feature/sprint-03-sincronizacao, com PR de base main no repositório de produção.
Sem alteração Swift, Bundle ID, OAuth, regras de dados ou permissões adicionais. Pacote destinado à raiz de produção.

## Roteiro de validação

1. Guarde os arquivos de produção atuais e exporte backup de teste.
2. Publique somente após autorização da ação correspondente; confira v3.21.0 no iPhone.
3. Confirme a conta de produção e consinta conscientemente o envio de dados reais ao Firebase de produção antes de usar Saúde real.
4. Teste Tracker primeiro: finalize o Tracker, mantenha o treino do Watch ainda aberto e confira o aviso; depois finalize o Watch e aguarde a disponibilidade e as tentativas. Não se espera um registro que ainda não foi salvo no Saúde.
5. Teste Watch primeiro: finalize no Watch e depois no Tracker, com intervalos correspondentes.
6. Teste manhã e tarde na mesma sessão, conferindo preservação do primeiro período e união do segundo.
7. Teste automático desligado/reativado, reautorização sem perder a preferência, troca de conta e saída/retorno ao app. Em casos ambíguos, escolha manualmente.
8. Confirme os retornos verdes para sucesso e vermelhos para avisos/erros, além de texto e ícone.

## Retorno

Restaurar os arquivos Web de produção anteriores preservados, com novo identificador de cache. O formato de backup e os dados das sessões não mudaram; não há migração a desfazer. Não restaure backup antigo por cima de novos dados nem desinstale o app. Use leitores v3.18.0 ou posteriores caso a conta tenha vários períodos do Saúde. Um retorno para a versão anterior volta ao comportamento anterior de reautorização e ausência de novas tentativas controladas.
