# Atualização 3.1 — sessões independentes

Exporte o backup completo na conta principal antes de atualizar. Substitua todos os arquivos na raiz do repositório pelos deste ZIP. Aguarde Actions concluir com sucesso. Feche todas as abas e janelas antigas do app e reabra; confira “Versão 3.1 · Sessões independentes”. Não use versões antigas em paralelo para editar o histórico novo. Não é preciso mudar as regras ou o projeto Firebase.

## Como usar

Selecione treino e semana e toque INICIAR TREINO. Uma sessão nova é criada, com campos vazios, data/hora e cronômetro próprios. Finalize para encerrar. Para repetir o mesmo treino na mesma semana, toque INICIAR TREINO novamente. Não é necessário avançar a semana.

A lista “Sessão” permite selecionar sessões anteriores daquele treino e semana para revisar/editar. O Histórico mostra cada sessão separadamente, incluindo sessões sem séries preenchidas. Enquanto houver um treino ativo, finalize antes de trocar de treino, semana ou sessão. Pausar e retomar mantém a mesma sessão.

Os gráficos de volume semanal total e por exercício somam todas as sessões daquela semana e os registros semanais antigos. A carga média considera todas as cargas preenchidas, sem fazer média de médias. Pranchas continuam com tempo separado.

Os registros das versões anteriores ficam em “Histórico anterior · registro semanal”. Não foram distribuídos arbitrariamente entre cronômetros antigos, pois a versão anterior não identificava a sessão de cada série. O mesmo treino pode ter histórico semanal antigo e novas sessões, sem substituir registros.

O backup JSON completo inclui registros e identificadores de sessão. Importações antigas continuam aceitas. A sincronização por conta e a proteção contra conflitos permanecem.

## Teste recomendado na conta de teste

Na mesma semana, inicie um treino A, registre 10 kg × 5 em uma série e finalize. Inicie outro A: os campos devem estar vazios. Registre 20 kg × 5 e finalize. O Histórico deve mostrar duas sessões; o volume semanal desse exercício deve ser 150 kg × reps, se não houver outros registros na semana. Exporte o backup, reabra em outro navegador com a mesma conta e confira as duas sessões após sincronizar.

## Verificação

12 testes automatizados passaram: isolamento entre contas, migração, recuperação, conflitos, cronômetro, backup, duas sessões do mesmo treino na mesma semana, independência das séries, soma de volume, preservação do histórico semanal e rejeição de referências de sessão inválidas. Sintaxe de todos os módulos conferida. Não foi feita gravação em contas reais do Firebase nem teste completo de login nesta atualização; repita o teste acima após publicar.
