# Atividades avulsas — v3.17.1 BETA

Preparado localmente em 25/11/2026. Nenhum push, PR, merge ou deploy foi realizado.

## Comportamento

- Na aba Histórico, em “Além do treino”, use “＋ Atividade manual”. Informe tipo, início/fim, calorias opcionais e observações. Não exige academia, plano ou sessão do Saúde. Calorias vazias são não informadas; zero explícito é preservado.
- No iOS, com a integração autorizada, use “Buscar no Saúde” e escolha a data. A consulta é limitada ao dia selecionado, respeitando o limite nativo de 48 horas.
- Atividades ainda não registradas oferecem “Manter como está” ou “Editar tipo e registrar”. A escolha grava nesta conta e sincroniza com o Firebase beta conforme o consentimento existente.
- Com “Atualizar automaticamente ao finalizar e ao voltar ao app” habilitado, voltar ao app busca sugestões do dia. São sugestões, nunca importações silenciosas. Não há consulta contínua com o app fechado; sessões disponibilizadas com atraso podem ser buscadas novamente.
- Correspondências reservadas para associação automática aos treinos existentes não são sugeridas como atividades avulsas.
- O Histórico mostra atividades avulsas em seção própria, por data. Não entram no volume de musculação nem inventam séries ou cargas.
- Editar uma atividade importada muda seu nome/observação apenas no Tracker. O resumo conserva tipo original, horários, calorias, fonte, frequência e gráfico quando disponíveis. Nenhuma escrita ou exclusão no Saúde.
- O mesmo identificador do Saúde não pode entrar em duas atividades, numa atividade e num treino, ou reaparecer a partir de um treino na lixeira.
- Atividades integram armazenamento local, sincronização e backup da conta. Troca de conta mantém isolamento. Integração desligada mantém os registros salvos e interrompe novas buscas.

## Evidência local

100 testes automatizados aprovados (84 regressões existentes, com isolamento adaptado ao beta, e 13 cenários novos). Cadastro manual, alteração de calorias e importação renomeando “Outros” para “Futevôlei” verificados em prévia mobile 390 × 844 com conta, nuvem e Saúde fictícios. Nenhuma conta ou telemetria real foi usada.

Ainda falta validar no iPhone beta com HealthKit real, após publicação explicitamente autorizada. Não houve alteração Swift: a busca usa a operação healthWorkouts existente. O app iOS precisa abrir /trainning_app_beta/ e usar os IDs OAuth beta.

## Destino proposto (aguarda autorização)

Repositório beta: gugasaito/trainning_app_beta. Site: https://gugasaito.github.io/trainning_app_beta/
Firebase: full-body-tracker-beta. Prefixo local fbt-beta:account-v3:. O worker limpa somente caches full-body-beta-; não remove caches de produção. Não migra armazenamento legado de produção.

Não publicar este pacote na raiz de produção: cloud.mjs exige o endereço beta. Os arquivos de simulação da prévia não fazem parte do pacote.

## Validação no beta publicado

1. Exporte um backup beta antes da atualização e confirme que está no beta.
2. Cadastre atividade fictícia com calorias; reabra e confira edição, backup e troca de conta.
3. No iPhone, autorize conscientemente o envio dos resumos ao Firebase beta. Busque a data de uma sessão real do Saúde sem associação existente.
4. Teste manter tipo original; em outra atividade, altere “Outros” para um tipo escolhido. Confira origem, horário e dados no Histórico.
5. Repita a busca: a sessão importada não deve reaparecer. Tente associar esse workout a um treino: deve recusar duplicação.
6. Desligue a integração: buscas devem parar e o Histórico permanecer. Reative e teste as sugestões ao voltar ao app, com automático habilitado.
7. Confira que o treino original no Saúde permanece intacto.

## Retorno

Antes de publicar, guardar cópia completa dos arquivos beta atualmente publicados e backup beta de cada conta de teste. Se houver problema após novos registros, exportar backup v3.17.1 e suspender a nova funcionalidade mantendo o leitor de activities. A versão anterior ignora o novo campo e pode apagar atividades avulsas ao salvar; não continuar gravando nela nem restaurar backup antigo por cima do novo histórico. Priorizar correção compatível. Produção permanece inalterada.
