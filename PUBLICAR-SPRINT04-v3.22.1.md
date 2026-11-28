# Sprint 04 — produção v3.22.1

Destino: raiz de gugasaito/trainning_app, https://gugasaito.github.io/trainning_app/.

FB-036 a FB-041: Saúde integrado ao cartão branco do Histórico, textos em laranja escuro, remoção do tipo original redundante, calorias e média cardíaca lado a lado com chama e coração, botão Iniciar Treino laranja.

Pacote Web completo: substituir arquivos da raiz, incluindo módulos, estilo, sw.js, testes e arquivos ocultos. Não há mudanças Swift, OAuth, permissões, Firebase ou migração de dados. O app nativo deve apontar para a URL de produção já configurada.

Validação: 169 testes aprovados com dados fictícios. Prévia de sessão com dois períodos conferida em 320 e 390 px sem rolagem horizontal. Gráfico e controles preservados. Validar visualmente no iPhone após publicação; isso não foi executado neste trabalho.

Antes de publicar, preserve os arquivos atuais. Depois, confira v3.22.1, Histórico, indicadores e botão Iniciar Treino. O cache desta versão é full-body-prod-v3221-20261128-1.

Retorno: restaurar os arquivos Web da versão anterior e trocar o identificador do cache em sw.js para um novo valor. Não restaurar backup antigo sobre novos dados nem desinstalar o app.

Nenhum push, PR, merge ou deploy foi executado na geração do pacote.

Refinamento v3.22.1: calorias em laranja escuro, batimentos em laranja claro e ocultação da frase Média das amostras exibidas no Histórico. Cálculos preservados.
