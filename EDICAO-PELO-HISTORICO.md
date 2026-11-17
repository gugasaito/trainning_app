# FB-015 — v3.11.0

O seletor Sessão foi removido de Vamos treinar. Essa área inicia um novo treino com campos vazios e retoma a sessão ativa quando houver uma. Depois de finalizar, os valores do treino anterior não ficam disponíveis para edição nessa área.

Para consultar ou corrigir: Histórico → localize a semana e o treino → Editar. Uma tela de edição identifica a semana, data e academia. As alterações são salvas automaticamente na conta e seguem a sincronização normal. Voltar ao Histórico mostra o resultado. A edição não reabre a sessão nem reinicia o cronômetro. Se houver um treino ativo, finalize antes de editar sessões anteriores. Registros semanais antigos também podem ser editados por esse caminho.

Exporte o backup antes de substituir todos os arquivos do repositório. Aguarde Actions concluir e feche todas as janelas antigas antes de reabrir. A conta autorizada verá v3.11.0 - Edição pelo Histórico beta. Firebase, regras e dados existentes não mudam.

Verificação: 25 testes automatizados passaram. Prévia no navegador com dados fictícios confirmou a ausência do seletor, acesso a Editar, correção de 10 kg × 5 para 15 kg × 5, volume atualizado de 50 para 75 e preservação da duração e do estado finalizado. A gravação real no Firebase ainda deve ser conferida após publicar.
