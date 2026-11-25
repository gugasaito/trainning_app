# FB-019 — Correção v3.17.1

Correção local da importação de atividades com horários do HealthKit contendo frações de milissegundo. Mantém a precisão original, o nome original, as medidas e as validações de limites, duração e duplicação. Não altera dados existentes.

100 testes passaram neste ambiente com dados fictícios, incluindo reprodução do erro antes da correção, importação mantendo o tipo, edição do tipo e preservação em backup. O teste com HealthKit real no iPhone permanece pendente.

Alterados: activities.mjs (validação), tests/activities.test.mjs (regressões), tracker.mjs (versão) e sw.js (cache). Sem alteração Swift ou Firebase.

Publicação manual: aplicar o pacote na raiz do repositório do ambiente correspondente. Caso use uma branch FB-019, a PR de publicação deve ter base main. Push, PR, merge e deploy não foram executados e exigem autorização específica.

Após a publicação: sem treino ativo, feche o app e reabra com internet; confira v3.17.1, refaça a busca e registre a atividade. Não é necessário apagar dados nem reinstalar o app.

Retorno: exportar backup antes de publicar; para reverter apenas esta correção, restaurar os quatro arquivos equivalentes de v3.17.0 com um novo identificador de cache. Atividades já importadas com datas fracionárias não podem ser gravadas pela validação antiga; manter o leitor corrigido ou suspender novas gravações até a correção. Não restaurar backup antigo por cima do histórico atual.
