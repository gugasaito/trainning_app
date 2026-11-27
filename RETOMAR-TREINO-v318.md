# FB-027 — Retomar treino finalizado — v3.18.0 BETA

Preparado localmente em 26/11/2026; não publicado. Esta cópia inclui os recursos anteriores e a correção v3.17.1 de horários fracionários do Saúde.

## Fluxo

Histórico → treino finalizado → Retomar este treino → confirmar.

A mesma sessão volta ao estado em andamento e o app abre a tela Treinar. ID, academia, semana/data inicial, séries, cargas, repetições, notas, Feito, exercícios concluídos e intervalos anteriores são preservados. Nenhum treino novo ou série duplicada é criado.

O cronômetro continua do tempo ativo já acumulado. O intervalo entre finalizar e retomar não entra no tempo ativo, nem nos intervalos dos exercícios. O tempo decorrido total mantém a regra existente de tempo de calendário desde o início, incluindo interrupções. O usuário escolhe qual exercício continuar; nenhum exercício é reiniciado automaticamente. Concluídos exigem Refazer exercício para liberar edição.

Retomar fica indisponível enquanto existe outro treino ativo ou pausado, e a regra também é verificada antes de salvar. Não é permitido retomar sessões na lixeira, registros semanais legados sem sessão nem atividades avulsas. Essas entradas mantêm seus fluxos atuais.

Pode finalizar e retomar novamente. As retomadas são guardadas em resumptions, com horário da finalização anterior e da retomada. O backup e a sincronização mantêm essa informação. O tempo do cardio que veio do contador continua a partir dos intervalos preservados, mantendo valores distintos já informados.

## Saúde — vários períodos na mesma sessão

Após a continuação ser finalizada no Tracker e no Watch, é possível reunir até 20 treinos do Saúde não sobrepostos na mesma sessão do Tracker, preservando cada identificador e registro original. O automático busca por cada período efetivo da sessão, evitando a interrupção e respeitando o limite de 48 horas por consulta nativa. Reabrir o Tracker não inicia um treino no Watch.

Com automático ligado, cada período com correspondência inequívoca é associado; ambiguidades exigem escolha. Uma atividade durante a lacuna entre períodos não é associada à sessão retomada. Sem automático, use Saúde → sessão → Buscar treino correspondente → Adicionar / atualizar período. Adicionar outro não substitui o anterior.

O Histórico mostra um cartão unificado:
- Calorias: soma dos valores conhecidos, com aviso de total parcial se algum período não tiver calorias. Se nenhum informar calorias, mostra Não disponível.
- Tempo no Saúde: soma da duração dos registros, excluindo a lacuna entre eles. Não altera o tempo ativo medido pelo Tracker.
- Gráfico: reúne as amostras reais disponíveis em um único eixo de tempo, preserva a lacuna, mantém o filtro por exercício e não interpola.
- Média combinada: média das amostras exibidas, identificada assim no cartão. Não faz média simples das médias dos registros originais, nem estima uma média por duração. Sem amostras individuais, a média combinada é Não disponível; médias originais continuam nos detalhes.
- Mínima/máxima: extremos conhecidos dos resumos originais, quando disponíveis.
- Detalhes: permite consultar fonte, horários, tipo, calorias e média de cada registro original.

Na aba Saúde, pode desvincular um período mantendo os demais, ou remover todas as associações. Desvincular interrompe a associação automática para aquela sessão até nova associação manual, evitando recolocar o período removido. Nada é escrito ou apagado no Saúde. Sobreposições entre registros diferentes são recusadas para não duplicar calorias. UUIDs de todos os períodos ficam protegidos contra associação a outra sessão/atividade e contra reutilização a partir da lixeira. Tentar novamente atualiza por UUID, sem duplicar a soma.

O modelo mantém o resumo principal legado e healthWorkouts com todos os registros originais quando há vários períodos. O consolidado é calculado na apresentação, sem substituir as medições originais por uma soma gravada.

## Testes

130 testes automatizados passaram com dados fictícios. Incluem retomada, preservação de séries/contas/backup, associação por períodos, soma parcial de calorias, lacunas reais, média das amostras, 360 pontos sem perda dos originais, duplicação, sobreposição, ambiguidades e desvinculação individual.

Prévia mobile 390 × 844 validou a retomada com tempo acumulado e a associação manual de um segundo período a um primeiro já salvo. O Histórico mostrou uma sessão, 500 kcal, 120 minutos de Saúde e um gráfico com grupos de amostras separados pela lacuna. Não houve acesso a dados reais ou Firebase real. Falta validar o fluxo com HealthKit real no iPhone, após publicação beta autorizada.

## Destino proposto

Somente beta: repositório gugasaito/trainning_app_beta e site https://gugasaito.github.io/trainning_app_beta/. Firebase full-body-tracker-beta; armazenamento fbt-beta:account-v3:. Sem alteração Swift. Push, PR, merge e deploy exigem autorização específica e não foram executados.

## Validação e retorno

Antes de aplicar, exporte backup beta e guarde os arquivos publicados. Valide primeiro com um treino fictício contendo séries e um exercício concluído. Finalize, retome e confira preservação, tempo e nova finalização. Teste também o bloqueio com outro treino ativo e reabra o app para conferir persistência.

Se houver problema, exporte backup atualizado e restaure os arquivos da versão beta anterior com um novo identificador de cache. Não restaure backup antigo por cima de novos registros. Uma sessão já retomada deve ser finalizada ou pausada antes de trocar arquivos. Não é necessário apagar dados ou desinstalar. As retomadas não alteram a identificação das séries existentes.


## Compatibilidade de retorno e outros aparelhos

Antes de associar vários períodos, confirme v3.18.0 em todos os clientes usados pela conta de teste. Clientes antigos não conhecem a coleção completa e podem substituir apenas o resumo principal, causando inconsistência. Não continue gravando dados dessa conta em uma versão antiga após unificar períodos. Em caso de falha, exporte backup atualizado e suspenda gravações; priorize correção mantendo leitura de healthWorkouts e resumptions. Voltar para o leitor antigo depois de novas associações não é um retorno seguro. Não sobrescreva dados atuais com um backup antigo.

O pacote inicial v3.18.0 que continha somente retomada foi substituído por FB027-Web-BETA-Retomar-Unificar-Saude-v3.18.0.zip. O cache deste pacote é full-body-beta-v3180-20261126-2. Continua não publicado por este trabalho.
