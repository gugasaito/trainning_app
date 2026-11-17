# Versão 3.2 — academias e referências de carga

Antes de atualizar, exporte o backup completo na conta principal. Extraia o ZIP e substitua TODOS os arquivos na raiz do repositório. Aguarde Actions ficar verde, feche todas as janelas antigas do app e reabra. Confira “Versão 3.2 · Academias e cargas”. Não é necessário mudar Firebase ou regras. Não use versões antigas em paralelo para registrar treinos.

## Primeiro treino em cada academia

Na tela Treinar, toque “+ Academia” para cadastrar o local. Selecione academia, treino e semana e toque INICIAR TREINO. A academia fica vinculada à sessão e não pode ser trocada depois que ela começa.

Em cada exercício, o campo “Exercício/aparelho utilizado” identifica a variação: por exemplo “Supino máquina articulada”, “Hack máquina X” ou “Supino livre”. Mantenha o mesmo nome quando usar o mesmo aparelho. Deixe vazio para “Padrão”. Ao alterar o campo, saia dele para salvar e atualizar as referências. Os nomes anteriores aparecem como sugestões do campo. O programa A/B/C permanece preservado; a variação identifica a execução realizada naquele espaço do programa.

Quando houver histórico na academia, a última variação conhecida do exercício naquele local é sugerida. Confira o aparelho antes de registrar. As cargas de hoje permanecem vazias para você registrar somente as séries realmente executadas.

## Como são calculadas as referências

Para cada série, o app procura o registro completo mais recente de uma sessão FINALIZADA ANTERIOR, na MESMA academia, exercício do programa e variação/aparelho. Mostra a carga, repetições e data de origem. Variações são comparadas sem diferenciar maiúsculas/minúsculas ou espaços excedentes.

Não há conversão entre máquinas ou aumento automático de carga. Os valores são referências do seu próprio histórico, não uma garantia de que determinada carga é adequada hoje. Sem registro correspondente, a tela mostra “Sem histórico correspondente para esta série”. Uma série extra sem histórico também fica sem referência. Pranchas usam segundos.

## Histórico antigo

Nada é atribuído automaticamente a uma academia. Sessões anteriores ficam como “Academia não informada”. Para aproveitar uma sessão antiga, selecione-a na lista Sessão, escolha a academia correta e toque “Associar academia à sessão”. Confirme; as séries existentes são mantidas. Faça isso apenas quando souber em qual local ocorreu o treino.

Registros semanais antigos que não tinham sessão continuam separados e não são usados como referência de academia. As novas sessões construirão o histórico correto. Sessões antigas sem identificação de aparelho usam “Padrão”; preencher uma variação diferente cria uma referência separada.

## Gráficos e backup

Evolução agora permite filtrar a academia. Para o exercício escolhido, também é possível filtrar o aparelho/variação. “Todas as academias” e “Todos os aparelhos” continuam disponíveis para visão geral; filtre antes de comparar cargas de máquinas diferentes. O volume total por academia inclui todos os aparelhos daquele local.

Academias, sessões, aparelhos e séries estão no backup JSON e na sincronização da conta Google. Cada conta mantém sua própria lista de academias. Backups anteriores sem academias continuam aceitos.

## Teste seguro

Na conta de teste, cadastre Centro e Bairro. Finalize uma sessão de A na Centro, com “Máquina X” e 10 kg × 5 na primeira série de um exercício. Finalize outro A na Bairro com “Máquina X” e 20 kg × 5. Inicie A na Centro: a referência deve ser 10 kg, e as cargas executadas devem continuar vazias. Na Bairro, a referência deve ser 20 kg. Mude o aparelho para “Máquina Y”: não deve aparecer uma carga anterior de X. Confira também os filtros de Evolução e o backup completo.

## Verificação

18 testes automatizados passaram: isolamento de usuários; sessões repetidas; backup antigo e completo; migração; cronômetro; referências por academia, aparelho e série; rejeição de sessões futuras, atuais e não finalizadas; séries incompletas; ausência de preenchimento automático de cargas; cadastro de academias; validação de vínculos. Sintaxe de todos os módulos verificada. A integração real com login e sincronização Firebase precisa ser validada com a conta de teste após publicar; não foram usados seus registros reais durante esta verificação.
