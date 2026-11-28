# Sprint 03 — produção v3.21.0

Destino: raiz do repositório gugasaito/trainning_app (https://gugasaito.github.io/trainning_app/).

FB-018: novas tentativas controladas e acompanhamento da associação do Saúde enquanto o app está aberto. FB-023: mensagens de sucesso verdes e erros/avisos vermelhos, com texto e ícone.

Pacote Web completo. Substituir os arquivos da raiz, incluindo módulos novos health-sync.mjs e feedback.mjs, testes e .github. Não substituir por arquivos beta. Não há alteração Swift, OAuth, Bundle ID, regras ou migração de dados.

Antes de publicar, preserve uma cópia dos arquivos de produção atuais. Após publicar, confirme v3.21.0 e a conta de produção. A validação local usa dados fictícios; teste real desta Sprint no iPhone ainda não foi confirmado.

Retorno: restaurar os arquivos Web anteriores preservados, atualizando o identificador do cache em sw.js para forçar renovação. Não restaurar dados antigos sobre registros novos nem desinstalar o aplicativo. Os dados mantêm o mesmo formato.

A geração deste pacote não executa push, PR, merge ou deploy.
