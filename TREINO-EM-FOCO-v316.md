# v3.16.0 — Seleção e treino ativo (FB-026)

Design aprovado em 24/11/2026. Laranja do logo; treino selecionado com texto branco; INICIAR TREINO verde. Lista compacta antes de iniciar, detalhes expansíveis sem iniciar a sessão. Academia abaixo dos treinos. Texto introdutório, campo de semana e instruções retirados desta tela; histórico e cálculo progressivo das semanas preservados.

Durante a sessão, painel sticky com tempo ativo, pausar/retomar/finalizar. Tempo decorrido incluindo pausas e tempo ativo continuam no Histórico. O exercício iniciado ganha foco e espaçamento; os demais não aparecem enquanto ele está em execução. Finalize ou pause para liberar a lista. Finalizados são protegidos, com Refazer preservando dados e intervalos anteriores.

Iniciar exercício cria atomicamente sessão + intervalo, exigindo academia, ou abre apenas intervalo quando sessão já está ativa. Não retoma treino pausado silenciosamente. Musculação e cardio podem iniciar primeiro.

Campos de variação/aparelho mantêm texto livre e sugestões anteriores; referência cruza academia, exercício, variação e série. Datas por série são mostradas porque séries diferentes podem ter referências em sessões diferentes. Sem histórico não gera carga fictícia. Selects nativos de 0 a 1000; valores fracionários/maiores já registrados são preservados como opção adicional. Feito salva flag e horário por série; novo toque desfaz a marca sem apagar valores. A próxima série não marcada recebe “Sua vez”. + Série até 20; notas até 5000 caracteres.

Seletor discreto abre planos da conta. Programa A/B/C original permanece com seus IDs e escolhas. Adicionar plano permite professor, título e até 26 treinos; nenhum professor fictício é cadastrado. Exercícios são definidos no formulário conforme prescrição, com séries/alvo/unidade opcionais por linha. Cadastro é manual na conta do atleta: não inclui portal/login de professores nem compartilhamento entre contas. Adicionar cardio inclui atividade e meta de minutos no treino selecionado. Duração executada vem dos intervalos do Tracker, não é uma medição do Saúde. Segundos de cardio ficam fora de volumes kg × reps. Metas não significam exercícios executados.

Catálogo e flags são opcionais no backup v2, isolados por conta, sincronizados com revisão e validados. Não alteramos regras Firebase nem SDK nativo. A leitura Saúde e o gráfico Horizonte continuam com amostras reais sincronizadas após sessão; não são dados ao vivo.

## Publicação e retorno

Base confirmada: 44e2930f73ed355ba5fa4a12c25e564228682663 (v3.15.3, PR #12). Atualizar todos os navegadores/dispositivos antes de registrar nesta versão, evitando clientes antigos editando os mesmos dados. Exportar backup antes/depois da atualização. O pacote não contém histórico pessoal nem conta de teste.

Antes de criar planos/cardio, um Revert do PR restaura código v3.15.3 (publicar SW com NOVO nome de cache para clientes que já instalaram v3.16). Porém v3.15.3 não entende exercícios de novos planos/cardio e não preserva Feito. Depois de usar recursos novos, não basta reverter código: manter o leitor v3.16 e corrigir por nova versão é o retorno recomendado. Nunca importar backup antigo sobre dados recentes sem comparar e exportar os dois. Não apagar cache de armazenamento/dados do site para atualizar. Fechar/reabrir abas permite ativação do SW quando todas as abas antigas saírem; uma sessão em andamento não é recarregada à força.

Atualização Web; não substitua Config.xcconfig, Bundle ID, OAuth ou arquivos Swift.
