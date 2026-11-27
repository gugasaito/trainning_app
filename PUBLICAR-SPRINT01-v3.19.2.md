# Sprint 01 — Histórico — PRODUÇÃO v3.19.2

Pacote local preparado em 27/11/2026. Nenhum push, PR, merge ou deploy foi executado.

## Entrega

Demandas FB-029, FB-030, FB-031, FB-033, FB-034 e FB-035.

Detalhes dos exercícios simples e recolhidos por padrão, iguais aos Intervalos; cabeçalho Treino / Data · Horário / Academia; frases decorativas do Saúde removidas no Histórico; quadro de bpm e botão + Atividade manual com texto branco em laranja vivo; cartão Semana X em laranja claro com título escuro; quadro de exercícios executados em laranja claro e colocado imediatamente abaixo de Finalizado · kg × reps.

Somente apresentação. O agrupamento de atividades avulsas na semana e as calorias semanais são Sprint 02; sincronização e cores das mensagens são Sprint 03. Não foram incluídos neste pacote.

## Validação e configuração

130 testes passaram na configuração de produção usando dados fictícios. A implementação inicial foi conferida em prévia mobile 320/390 px. A revisão v3.19.2 passou em análise de sintaxe e checagem da ordem dos blocos. Os arquivos funcionais da interface deste pacote correspondem ao beta v3.19.2, com diferenças apenas de ambiente. Falta conferir a instalação/publicação final em produção.

Destino: raiz de gugasaito/trainning_app, https://gugasaito.github.io/trainning_app/.
Firebase: full-body-tracker-b4a42. Prefixo: full-body-tracker:account-v3:.
Cache: full-body-prod-v3192-20261127-1, separado do beta.
Sem banner BETA, dados fictícios ou dependência dos arquivos de prévia. Não exige alteração Swift, Bundle ID, OAuth ou regras Firebase.

## Aplicação manual

1. Exporte um backup da conta e guarde uma cópia dos arquivos de produção atuais.
2. Extraia o ZIP na raiz da cópia local do repositório de PRODUÇÃO, preservando .git. O ZIP inclui index.html, app.mjs, style.css, sw.js, demais módulos, imagens, testes, .github/workflows/tests.yml e .nojekyll. Não use a pasta Sprint01-Validacao: ela contém somente relatórios.
3. Branch sugerida: feature/sprint-01-historico. Rode npm test e revise as alterações.
4. A PR de produção deve ter base main no repositório gugasaito/trainning_app. Após merge autorizado, aguarde o Pages concluir a publicação.
5. Sem treino em andamento, confirme v3.19.2 no site e no iPhone antes de revisar o Histórico. Não limpe os dados locais nem desinstale o aplicativo para atualizar.
6. Confira a ordem Finalizado → exercícios executados → Detalhe dos exercícios → Intervalos → Saúde, os cabeçalhos, as cores e as ações existentes.

Gerar este pacote não autoriza nem executa push, abertura de PR, merge ou deploy. Cada etapa exige autorização explícita por ação e ambiente.

## Retorno

Restaurar os arquivos Web de produção v3.18.0 preservados, usando novo identificador de cache para que o retorno seja recebido. O formato de dados da Sprint 01 é o mesmo da v3.18.0; não há migração a desfazer. Não restaurar backup antigo por cima de registros novos, apagar dados de conta ou desinstalar o app. Se a conta já possui vários períodos do Saúde, não voltar a um leitor anterior à v3.18.0.
