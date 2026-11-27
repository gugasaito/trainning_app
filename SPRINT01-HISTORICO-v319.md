# Histórico de implementação e revisão no beta

Este documento registra a revisão anterior. Para este pacote de PRODUÇÃO v3.19.2, siga PUBLICAR-SPRINT01-v3.19.2.md.

# Sprint 01 — Histórico em foco — v3.19.2 BETA

Entrega local preparada em 27/11/2026. Demandas FB-029, FB-030, FB-031, FB-033, FB-034 e FB-035 em revisão. Nada foi enviado ao GitHub nem publicado.

## Mudanças

- Detalhe dos exercícios fechado por padrão: nome, aparelho, séries, carga, repetições e observações preservados dentro da seção. O quadro de concluídos conserva a contagem; os nomes ficam nos detalhes. Intervalos dos exercícios continua separado e recolhido.
- Cabeçalho do treino com nome na primeira linha, data e hora na segunda e academia na terceira. Nomes longos quebram linha no mobile sem cortar o texto; dados legados sem sessão não recebem data ou academia inventadas.
- Somente no Histórico, os cartões do Saúde removem SEU CORPO EM MOVIMENTO, O ritmo da sua evolução, Frequência cardíaca · bpm e Durante o treino. A média, sua identificação, unidade, filtro por exercício, gráfico, mínimos/máximos e registros originais permanecem.
- Quadro da média e botão + Atividade manual em laranja vivo #ce4a00, com texto branco (contraste 4,56:1).
- Semana X com fundo laranja claro #fff0e2 e título laranja escuro #9c3b00.
- Quadro de exercícios executados com fundo #ffead5 e fonte #933800.

As atividades avulsas ainda permanecem em seção separada e o cabeçalho da semana ainda não soma calorias: são FB-028 e FB-032 da Sprint 02. Regras de sincronização e cores de mensagens são Sprint 03 e não foram alteradas.

## Verificação

130 testes de regressão passaram com dados fictícios. Verificação adicional confirmou payload do gráfico idêntico antes/depois da apresentação compacta e os módulos de dados, HealthKit/modelo Web, sessões, armazenamento e sincronização byte a byte iguais à base beta v3.18.0. Nenhum dado de conta é migrado por esta entrega.

Prévia local com Firebase e Saúde fictícios: Histórico em 390 e 320 px sem rolagem horizontal; academia com nome longo; Detalhe dos exercícios fechado inicialmente e valores 30 kg × 12 / 35 kg × 10 disponíveis após expansão; navegação para Evolução sem erros; resumo de 2 períodos e 500 kcal preservado. Na revisão v3.19.1, branco sobre laranja vivo tem contraste 4,56:1; os cartões de fundo claro mantêm o texto laranja escuro. Falta a validação do usuário no beta publicado.

## Destino e aplicação

Somente beta: gugasaito/trainning_app_beta, raiz, publicado em https://gugasaito.github.io/trainning_app_beta/.
Firebase full-body-tracker-beta; prefixo fbt-beta:account-v3:; cache full-body-beta-v3192-20261127-1.

1. Guarde a versão beta atual e exporte um backup de teste antes de aplicar.
2. Extraia o ZIP na raiz da cópia local do repositório beta, preservando .git e incluindo .github/workflows/tests.yml e .nojekyll.
3. Branch sugerida: feature/sprint-01-historico. A PR deve ter base main no repositório BETA. Push, abertura de PR, merge e deploy exigem autorização específica por ação e ambiente; este pacote não executa nenhuma delas.
4. Após publicação autorizada, confirme v3.19.1 no beta antes de validar. Não é necessário mudar Swift, Bundle ID, OAuth ou regras Firebase.
5. Confira os seis itens de design no Histórico, abertura/fechamento dos detalhes, gráficos e navegação. Use dados fictícios; esta sprint não exige novo acesso ao Saúde real.

## Retorno

Restaurar os arquivos Web beta v3.18.0 preservados, usando um novo identificador de cache para o retorno. A mudança é de apresentação, sem novo formato de dados; não restaure um backup antigo por cima de registros novos, não limpe dados de conta e não desinstale o app. A produção permanece intocada.


## Revisão visual v3.19.1

Solicitada pelo usuário: Detalhe dos exercícios passa a usar o mesmo estilo simples de Intervalos dos exercícios, sem caixa, fundo ou borda adicionais. A média de bpm e o botão + Atividade manual passam a ter fonte branca sobre laranja vivo #ce4a00. Os quadros laranja claro mantêm seus textos escuros. Nenhum comportamento, dado ou cálculo alterado nesta revisão.

A suíte de 130 testes e a prévia mobile pertencem à implementação base v3.19.0. Nesta revisão foi conferida a diferença de arquivos: somente CSS, versão, cache e documentação mudaram; os módulos funcionais permaneceram idênticos. A aparência revisada aguarda validação no beta. Este pacote substitui o ZIP beta v3.19.0 da Sprint 01 e continua não publicado.


## Revisão v3.19.2 — ordem dos blocos

Solicitação do usuário: o quadro X exercícios marcados como executados aparece imediatamente abaixo de Finalizado · kg × reps. A sequência agora é status/volume → exercícios executados → Detalhe dos exercícios → Intervalos dos exercícios → Apple Saúde. A fonte branca nos quadros de laranja vivo e os detalhes simples da v3.19.1 foram mantidos. Registros, cálculos e ações não mudaram.

130 testes passaram novamente nesta revisão. Código JavaScript conferido sintaticamente e sequência de apresentação verificada. O pacote v3.19.2 substitui o beta v3.19.1 da Sprint 01. Continua aguardando publicação autorizada e validação do usuário no beta.

Para retorno desta revisão visual, restaurar os arquivos Web beta anteriores, usando um novo identificador de cache. Não é necessário restaurar dados, alterar Swift ou desinstalar o app.
