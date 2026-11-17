# Versão atual: 3.2 — academias e cargas

Consulte ACADEMIAS-E-CARGAS.md para atualizar e usar a seleção de academia e referências por série.

# Full Body Tracker 3.0 — várias contas

Cada conta Google tem registros, histórico, gráficos e sessões próprios. Contas novas começam vazias; os 23 exercícios A/B/C são comuns. O pacote público não contém o histórico da planilha pessoal.

## Atualizar

1. Exporte o backup no app atual, na sua conta principal.
2. Extraia este ZIP e envie TODOS os arquivos diretamente para a raiz do repositório trainning_app. Substitua os arquivos existentes; não envie o ZIP ou uma pasta contendo os arquivos.
3. Espere a nova execução na aba Actions ficar verde. Feche todas as janelas antigas do app, abra o site e, se ainda vir a versão anterior, feche e reabra novamente. O rodapé do painel deve mostrar “Versão 3.0 · Contas separadas”. O novo cache só é ativado depois que todas as páginas antigas forem fechadas. Não apague dados do Safari para forçar a atualização.
4. Entre na conta principal. O app recupera a nuvem dessa conta. O histórico antigo local só é migrado automaticamente se a versão anterior tiver gravado essa mesma conta como dona dos dados. Dados antigos sem dono ficam preservados e não são atribuídos a qualquer pessoa.
5. Se precisar recuperar a planilha original, importe o arquivo privado backup-planilha-pessoal.json pela tela Backup, somente na conta principal. Esse arquivo é entregue separadamente; NÃO publique no GitHub. A importação substitui os registros da conta atual, após confirmação. Prefira o backup mais recente se já registrou novos treinos.

Não é preciso mudar de projeto Firebase. Login Google, domínio gugasaito.github.io e Firestore devem continuar habilitados. Confirme as regras de firestore.rules no console: somente o usuário autenticado pode acessar /users/SEU_UID/…. O código cliente não substitui as regras do servidor.

## Contas e sincronização

O painel identifica o e-mail atual. Ao sair, os dados são ocultados. Ao entrar com outra conta, o app abre apenas os dados daquele identificador. Não há mais armazenamento global compartilhado nem carregamento automático da planilha.

As edições são salvas no aparelho por conta e enviadas após 2,5 segundos sem edição. Iniciar, pausar, retomar e finalizar tentam sincronizar imediatamente. Falhas mantêm o estado pendente; o app tenta novamente com internet e enquanto aberto. Só o envio confirmado pelo Firebase é marcado como sincronizado. Para usar offline, entre com internet e reabra uma vez após a instalação do cache; mantenha a sessão autenticada. O primeiro login precisa de internet.

A sincronização confere revisões em uma transação para impedir que um aparelho substitua silenciosamente alterações recentes de outro. Se houver versões diferentes com edições pendentes, o envio pausa: exporte a cópia local e escolha Recuperar da nuvem. Não há mesclagem automática de séries editadas simultaneamente. O snapshot de cada conta tem limite conservador de 800 KB; se excedido, o app avisa e mantém os dados locais pendentes. Use o backup completo regularmente.

Os backups agora incluem registros E sessões/durações. Backups v2 antigos sem sessões continuam aceitos. O cronômetro usa os horários salvos, exclui as pausas e recompõe o tempo ao reabrir o app.

## Repetir o teste com segurança

Use uma conta Google separada. Se a versão antiga já enviou a planilha pessoal à conta de teste, ela continuará nessa conta até uma ação explícita: confirme o e-mail no painel, exporte um backup se necessário e abra “Conta, recuperação e testes” → “Limpar histórico desta conta”. Digite o e-mail de TESTE para confirmar. A conta principal não é alterada. Aguarde sincronizar a limpeza.

Depois registre 10 kg × 5 repetições na semana 100 e finalize uma sessão. Aguarde Sincronizado, feche todas as janelas privadas e abra uma nova. Entre na mesma conta de teste: só os registros desse teste devem aparecer. Em outra sessão com a conta principal, eles não devem existir. Ao sair, nenhum histórico fica visível.

## Verificação realizada

9 testes automatizados: fonte pública sem registros; isolamento entre contas e sessões; saída oculta dados; migração somente do dono registrado; recuperação da nuvem validada; conflitos preservam versões; resposta atrasada de uma conta não altera outra; edições durante envio continuam pendentes; backup completo e cronômetro; limpeza só da conta ativa. Sintaxe dos módulos conferida. A tela sem login foi verificada no navegador: nenhum histórico exposto.

Não houve login nas contas reais nem leitura/escrita de dados reais do Firebase nesta validação. As regras implantadas no projeto precisam ser conferidas e o teste ponta a ponta com a conta de teste deve ser repetido após publicar.

## Publicação e referências

GitHub Pages: branch main, pasta /(root). O arquivo .nojekyll acompanha o pacote. URL: https://gugasaito.github.io/trainning_app/

Firebase: https://firebase.google.com/docs/firestore/security/rules-conditions
Transações: https://firebase.google.com/docs/firestore/manage-data/transactions
Instalar no iPhone: Safari → Compartilhar → Adicionar à Tela de Início.
