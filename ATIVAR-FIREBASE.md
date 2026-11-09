# Ativar Firebase

Projeto: full-body-tracker-b4a42. O código já contém a configuração Web fornecida. Analytics não é necessário.

1. No console Firebase, abra Authentication → Get started → Sign-in method → Google. Habilite e selecione o e-mail de suporte.
2. Em Authentication → Settings → Authorized domains, adicione `gugasaito.github.io` (sem https ou caminho).
3. Abra Firestore Database → Create database. Escolha o plano gratuito/Standard e modo de produção, selecione a região e crie o banco padrão.
4. Na aba Rules, cole o conteúdo de firestore.rules deste pacote e clique Publish. As regras restringem os dados à conta autenticada.
5. Substitua os arquivos do repositório trainning_app pelos deste ZIP. Mantenha index.html na raiz. Aguarde o GitHub Pages publicar.
6. Feche todas as janelas do app e reabra. Entre com Google. No iPhone, se o login abrir uma janela bloqueada, permita pop-ups ou faça o login pelo Safari.

Endereço: https://gugasaito.github.io/trainning_app/

## Recuperação e sincronização

Antes de atualizar, exporte o JSON atual. No primeiro acesso de um novo aparelho, ao entrar na mesma conta, o app oferece recuperar o histórico da nuvem. Confirme somente depois de guardar qualquer histórico local que queira preservar.

Alterações locais geram sincronização pendente. O app tenta enviar após três segundos sem edição, ao finalizar e ao recuperar conexão com o app aberto. A confirmação de envio muda o estado para Sincronizado. Se o app estiver fechado, reabra para tentar novamente. A carga inicial das bibliotecas Firebase exige internet; sem elas, registro e cronômetro continuam locais.

Esta versão usa uma cópia completa por conta e é destinada ao uso de um aparelho por vez. Não mescla alterações simultâneas entre dispositivos. Exporte antes de trocar de aparelho e entre no novo para recuperar. Sessões e durações são incluídas na cópia da nuvem; o backup JSON legado exporta os registros de séries, mas ainda não as durações.

O cronômetro conta tempo ativo usando horários persistidos, exclui pausas e retoma a contagem ao reabrir. A tela bloqueada pode suspender a atualização visual, mas o cálculo continua pelo horário. Alterar o relógio do aparelho pode afetar a duração.

## Verificação

Testes locais passaram para iniciar, pausar, retomar, finalizar, excluir tempo pausado e conservar tempo por horários. Sintaxe dos módulos conferida. Não foi possível validar login, regras implantadas e gravação reais sem configurar os serviços no console. Após ativar, registre uma alteração, aguarde Sincronizado e teste recuperação em outro navegador com a mesma conta antes de confiar na recuperação em caso de perda.

Documentação: https://firebase.google.com/docs/web/setup e https://firebase.google.com/docs/auth/web/google-signin
