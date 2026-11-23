# v3.14.0 — Horizonte (FB-024)

Timeline de frequência cardíaca em traços laranja, média em painel verde, consulta por amostra e mínimo/máximo/duração. O eixo cobre o workout associado do Saúde; não confundir com a duração da sessão Tracker. A média e extremos vêm do resumo HealthKit, não da seleção de pontos desenhados. Intervalos sem amostras ficam sem marcas; nunca se interpola ou fabrica uma curva com média/mínima/máxima.

Novas leituras exigem o app iOS atualizado e reautorização na aba Saúde. O aviso informa que amostras individuais serão enviadas ao Firebase da conta. Para workouts antigos: selecionar sessão, reautorizar, buscar e associar o mesmo workout novamente. Sem amostras acessíveis, mostrar indisponibilidade; o Saúde não distingue negação de leitura de inexistência de dados.

Cada workout conserva no máximo 180 observações reais, distribuídas pelo conjunto lido quando houver mais pontos, com indicação de seleção reduzida. A precisão gravada é de 1 ms e 0,1 bpm. O leitor consulta apenas amostras relacionadas ao workout e dentro de seu período, com teto de 20.000 retornos e indicação de redução quando o teto for atingido. Não há nova permissão de escrita no Saúde. Não há zonas clínicas nem medição ao vivo.

Backup JSON e sincronização incluem a timeline; resumos antigos seguem aceitos. Snapshot novo grava sessões somente dentro de state para evitar duplicação. Snapshots antigos com sessions no topo continuam legíveis. Limite de 800 KB de estado para sincronização continua existindo; se excedido, o app mantém pendência e solicita exportação. O limite local varia por navegador.
