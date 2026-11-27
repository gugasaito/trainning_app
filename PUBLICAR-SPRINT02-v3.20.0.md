# Sprint 02 — Histórico semanal completo — PRODUÇÃO v3.20.0

Pacote preparado localmente em 27/11/2026, conforme solicitação de implementar para produção. Nenhum push, PR, merge ou deploy executado. Demandas FB-028 e FB-032 em revisão.

## Entrega

Atividades manuais, importadas do Saúde e sessões do Tracker aparecem juntas nos cartões das semanas, da mais recente para a mais antiga. A seção separada Atividades avulsas foi removida. Origem, detalhes, edição e resumos do Saúde foram preservados.

Cada cabeçalho semanal mostra quantidade de treinos e atividades, volume de musculação quando houver treinos e Calorias da semana. Soma as calorias manuais informadas e as calorias ativas originais do Saúde. Todos os períodos unificados contam uma vez, sem somar novamente o resumo principal. UUIDs repetidos são deduplicados defensivamente.

Valor ausente não vira zero. Com parte dos registros/períodos sem calorias ou sem resumo associado, o total é parcial. Se nenhum valor estiver disponível, mostra Não disponível. Zero explicitamente registrado continua zero conhecido. Lixeira não entra no agrupamento nem nos totais. Registros sem HealthKit não recebem calorias estimadas.

## Regras de semana

- Semanas começam na segunda-feira. Atividades usam America/Sao_Paulo, a referência padrão do Tracker; sessões mantêm sua semana e fuso já registrados.
- Uma atividade da mesma semana de calendário de uma sessão conhecida entra na semana progressiva correspondente. Fora desses casos, usa o início do programa quando disponível ou uma referência inferida das sessões datadas e suas semanas já salvas.
- Conta somente com atividades, datas anteriores ao programa ou histórico sem referência segura usa o rótulo real de calendário Semana X de AAAA. Não cria uma data inicial de programa nem altera semanas antigas para forçar um encaixe. Se metadados antigos apontarem para semanas progressivas conflitantes, evita uma associação arbitrária.
- Registros semanais legados sem data confiável permanecem visíveis. Não inventa horário para eles.
- Cada sessão do Tracker, incluindo períodos do Saúde unificados, permanece inteira na semana do cartão original. Não divide calorias estimadas por dia em sessões que atravessam a virada semanal. Atividades avulsas usam sua data de início.

A organização é calculada na leitura: nenhum registro é movido no Firebase e não há migração do formato de backup. O total é recalculado após edições, restauração e sincronização dos dados existentes.

## Validação

150 testes passaram com dados fictícios (130 regressões e 20 cenários novos). Cobertura: mesmas semanas, ordem cronológica, semana só de atividades, segunda-feira, virada de ano, UTC/São Paulo, atividades antes do programa, legado com/sem datas, metadados conflitantes, calorias unificadas, parciais, zero, importadas, UUID duplicado, lixeira, período ausente após retomada, backup e isolamento de contas.

Prévia mobile em 390 e 320 px, sem rolagem horizontal: uma semana com treino + 3 atividades mostrou 1.100 kcal parciais; editar a atividade fictícia de 350 para 400 kcal atualizou o total para 1.150. Outra semana, somente com atividade sem calorias, mostrou Não disponível. Nenhum Firebase, conta ou Saúde real foi acessado. Falta validar a versão publicada no ambiente real após autorização de publicação.

## Destino e aplicação

Repositório gugasaito/trainning_app, raiz de main, site https://gugasaito.github.io/trainning_app/.
Firebase full-body-tracker-b4a42; prefixo full-body-tracker:account-v3:.
Cache full-body-prod-v3200-20261127-1; preserva caches beta.

1. Exporte backup da conta e guarde a cópia dos arquivos de produção v3.19.2.
2. Extraia o ZIP do aplicativo na raiz da cópia local de produção, preservando .git e incluindo arquivos ocultos .github e .nojekyll. A pasta Sprint02-Validacao contém apenas relatórios e não é o aplicativo.
3. Branch sugerida: feature/sprint-02-historico-semanal. Execute npm test e revise as alterações.
4. A PR deve ter base main no repositório de produção. Push, PR, merge e deploy exigem autorização específica; não foram executados por este trabalho.
5. Após publicação autorizada, aguarde Pages e confira v3.20.0 no site e no iPhone, sem treino ativo durante a atualização. Não exige trocar Swift, Bundle ID, OAuth ou regras Firebase.
6. Confira atividades na semana correta, edição, totais completos/parciais e Histórico anterior. Comece com dados fictícios.

## Retorno

Restaurar os arquivos Web de produção v3.19.2 preservados, com novo identificador de cache para o retorno. O formato dos registros não mudou, portanto não há migração a desfazer. Não restaure backup antigo por cima de dados novos e não limpe dados ou desinstale o aplicativo. Mantenha leitores v3.18.0 ou posteriores se a conta tiver vários períodos do Saúde.
