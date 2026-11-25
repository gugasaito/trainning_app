# v3.17.0 — Atividades avulsas — PRODUÇÃO

Pacote preparado localmente em 25/11/2026. Não publicado.

## Alterações

- Cadastro manual de atividade: tipo, início/fim, calorias opcionais e observações, sem exigir sessão do Saúde ou academia.
- Busca por data no iOS: sessões do Saúde ainda não registradas podem ser mantidas como estão ou receber um nome no Tracker, como Outros → Futevôlei.
- Sugestões ao voltar ao app, com a integração e atualização automática habilitadas. Nenhuma importação silenciosa; busca do dia, sem execução contínua com o app fechado.
- Histórico com seção de atividades avulsas. Tipo original, horários, calorias, fonte e telemetria do Saúde preservados; nenhuma escrita no Saúde.
- Deduplicação entre atividades, treinos e lixeira. Backup, sincronização e isolamento entre contas incluem as atividades. Não entram no volume de musculação.

## Validação

97 testes automatizados passaram na configuração de produção, usando somente dados fictícios. Os fluxos de cadastro, edição e importação foram verificados visualmente na prévia beta com nuvem e Saúde simulados. O funcionamento com HealthKit real desta funcionalidade ainda precisa de validação no iPhone; os testes locais não substituem essa etapa.

## Configuração e destino

Destino previsto: raiz do repositório gugasaito/trainning_app, site https://gugasaito.github.io/trainning_app/.
Firebase: full-body-tracker-b4a42. Armazenamento local: full-body-tracker:account-v3:.
Cache: full-body-prod-v3170-20261125-1; remove somente caches full-body-prod-, preservando os do beta.
Sem banner BETA e sem configurações simuladas. As regras Firebase e os IDs nativos não foram alterados.
Não exige substituição de arquivos Swift: usa a operação healthWorkouts existente. O app iOS de produção deve abrir o endereço de produção e manter os IDs OAuth de produção.

## Aplicação manual

1. Exporte backup da conta de produção e guarde uma cópia dos arquivos Web publicados antes de aplicar qualquer alteração.
2. Extraia o ZIP na raiz da cópia local do repositório de produção, preservando a pasta .git. O ZIP inclui .github/workflows/tests.yml com os testes; habilite a exibição de arquivos ocultos para copiar essa pasta e .nojekyll.
3. Revise as alterações e execute npm test. Este pacote não concede nem executa autorização de push, PR, merge ou deploy; cada ação exige autorização específica.
4. Após uma publicação autorizada, encerre os treinos ativos, feche todas as abas/janelas do app e reabra para ativar o novo cache. Não limpe os dados locais para atualizar.
5. Confira v3.17.0, ambiente de produção e conta correta. Valide primeiro com uma atividade fictícia. A consulta real do Saúde exige consentimento consciente para salvar os dados no Firebase de produção.

## Retorno

Antes de publicar, guarde a versão anterior e backup dos dados. Se houver problema antes de novas gravações, restaure os arquivos anteriores. Depois de criar atividades avulsas, exporte também um backup v3.17.0 e suspenda o recurso mantendo um leitor compatível com activities. Versões antigas ignoram esse campo e podem removê-lo ao salvar; não continue gravando nelas nem substitua o histórico atual por backup antigo. Priorize correção compatível.
