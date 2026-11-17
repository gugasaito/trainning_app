# Versão 3.4 — excluir treinos do histórico

Exporte seu backup antes de atualizar. Envie todos os arquivos extraídos do ZIP para a raiz do repositório, aguarde Actions ficar verde, feche todas as janelas antigas do app e reabra. Confira “Versão 3.4 · Exclusão de treinos”. Firebase e regras permanecem iguais.

Na aba Histórico, cada treino tem o botão “Excluir treino”. Confirme para movê-lo para a Lixeira. Somente a sessão escolhida, com suas séries e duração, sai do histórico ativo. Outros treinos da mesma semana ficam preservados. Treinos em andamento ou pausados precisam ser finalizados antes de excluir.

O volume e as referências de carga são recalculados sem o treino excluído. A alteração é salva na conta atual e segue o fluxo normal de sincronização: aguarde “Sincronizado com a nuvem”. Se houver conflito com outro aparelho, a sincronização pausa como antes. A outra conta Google não é alterada.

Para desfazer, abra Histórico → Lixeira → Restaurar treino. A lixeira é persistida por conta, incluída no backup completo e sincronizada com a nuvem. Não há remoção permanente nesta versão. Se houver um registro correspondente já existente, a restauração é bloqueada para evitar duplicatas. O histórico semanal anterior também pode ser excluído por treino e semana, sem afetar os outros dias.

23 testes automatizados passaram, incluindo exclusão de uma sessão entre duas da mesma semana, volume e referências recalculados, restauração com academia e duração, backup da lixeira, bloqueio de treino ativo, exclusão semanal antiga e isolamento entre contas. Sintaxe dos módulos e integridade do ZIP verificadas. A interface no iPhone e a sincronização real devem ser conferidas com a conta de teste após publicar.
