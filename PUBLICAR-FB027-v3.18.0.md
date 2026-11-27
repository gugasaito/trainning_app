# FB-027 — Pacote Web de produção v3.18.0

Criado localmente em 26/11/2026. Este pacote não foi enviado ao GitHub nem publicado.

## Resultado

- Histórico → Retomar este treino: mesma sessão, séries, cargas, notas e exercícios concluídos preservados; cronômetro continua sem somar a lacuna como tempo ativo.
- Vários períodos não sobrepostos do Apple Saúde associados à mesma sessão. Calorias conhecidas somadas, amostras reais em um gráfico com lacunas, registros originais consultáveis e desvinculação individual.
- Automático somente com correspondência inequívoca por período. Ambiguidades exigem escolha. Não escreve no Saúde nem inicia o Watch.
- Inclui as funcionalidades v3.17.1, inclusive atividades avulsas e correção de horários fracionários.

## Configuração e validação

Destino: raiz de gugasaito/trainning_app, publicada em https://gugasaito.github.io/trainning_app/.
Firebase: full-body-tracker-b4a42. Prefixo local: full-body-tracker:account-v3:.
Cache: full-body-prod-v3180-20261126-1. O worker remove somente caches full-body-prod-, preservando o beta.

130 testes passaram na configuração de produção, usando dados fictícios. No beta, o usuário confirmou no iPhone a associação automática e unificação dos dois períodos. Ainda falta a conferência da versão publicada e um teste de funcionamento em produção.

Nenhuma alteração Swift, de OAuth ou de regras Firebase é exigida por este pacote. Mantenha o projeto iOS de produção abrindo /trainning_app/ com seus IDs de produção.

## Aplicação manual

1. Exporte backup da conta de produção e guarde os arquivos atualmente publicados.
2. Extraia este pacote na raiz de uma cópia local do repositório de produção, preservando .git. Inclua .github/workflows/tests.yml, testes e .nojekyll (arquivos ocultos).
3. Branch sugerida: feature/FB-027-retomar-unificar-saude. Rode npm test e revise as diferenças.
4. Se publicar pelo GitHub, a PR deve ter base main e compare feature/FB-027-retomar-unificar-saude. Após o merge, aguarde GitHub Pages concluir. Não basta mesclar uma branch auxiliar na branch de funcionalidade.
5. Confira que o site e o iPhone mostram v3.18.0 antes de usar a unificação. Evite editar a mesma conta em aparelhos ou abas que ainda estejam na versão antiga.
6. Na aba Saúde, habilite Atualizar automaticamente ao finalizar e ao voltar ao app. A reautorização atualmente desmarca essa opção; confira-a depois de reautorizar.
7. Faça a conferência inicial com um treino fictício. Para usar dados reais do Saúde, confirme a conta de produção e o consentimento para enviá-los ao Firebase de produção.

Gerar este pacote não executa nem autoriza push, abertura de PR, merge ou deploy. Cada ação exige autorização explícita e correspondente ao ambiente.

## Retorno

Antes de publicar, guarde os arquivos de produção anteriores e um backup. Antes de novas retomadas ou associações múltiplas, é possível voltar aos arquivos anteriores, atualizando o identificador do cache para que os clientes recebam o retorno.

Depois de gravar retomadas e vários períodos, exporte também um backup atualizado. Não continue editando essa conta com um leitor antigo: versões anteriores podem substituir apenas o resumo principal e causar inconsistência. Nesse caso, suspenda gravações e priorize uma correção mantendo a leitura de healthWorkouts e resumptions. Não restaure backup antigo sobre histórico novo e não desinstale o app para atualizar.
