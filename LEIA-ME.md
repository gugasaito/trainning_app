# Full Body Tracker 2.0

PWA estático para iPhone, sem instalação de dependências. Inclui treinos A/B/C, registro automático por série, séries adicionais, semanas 1–520, histórico editável, volume semanal total, volume e carga média por exercício, tempo de pranchas e backup JSON validado.

## Publicação com GitHub Pages

1. Extraia este ZIP.
2. Crie um repositório no GitHub e envie os arquivos desta pasta para a raiz, incluindo `.nojekyll`. O `index.html` deve ficar na raiz.
3. Abra Settings → Pages → Build and deployment → Deploy from a branch.
4. Escolha a branch main, pasta /(root), e salve.
5. Aguarde a publicação e abra o endereço HTTPS informado pelo GitHub.

Referência: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Os registros iniciais estão em seed.json e serão públicos em hospedagem pública. Para publicar sem seu histórico pessoal, mantenha exercises e substitua records por [] em seed.json antes de enviar.

## Instalação no iPhone

No Safari, abra o endereço publicado. Aguarde “Disponível offline”. Toque em Compartilhar → Adicionar à Tela de Início e habilite Abrir como App, quando oferecido. Abra pelo novo ícone e confirme que os treinos aparecem. Depois, ative o modo avião e reabra para conferir o funcionamento offline no seu aparelho.

Referência: https://support.apple.com/en-eg/guide/iphone/iphea86e5236/ios

## Uso e dados

Selecione treino e semana. Os campos são salvos ao digitar; aceitam vírgula decimal. A semana representa o programa, sem data obrigatória. Para continuar, use semanas posteriores. Cada exercício tem uma entrada por semana. Registre o peso de um halter, como na planilha. Séries extras já presentes foram preservadas mesmo quando excedem a prescrição.

O volume soma carga × repetições das séries completas. Uma série com apenas carga ou apenas repetições é marcada incompleta e não entra no volume. Ausência é diferente de zero. Pranchas somam segundos, separados do volume em kg. A média considera as cargas/tempos preenchidos.

Em Backup, exporte JSON regularmente e guarde em Arquivos/iCloud Drive. Ao restaurar, revise a contagem e confirme a substituição. O aplicativo oferece exportar o histórico atual antes da confirmação. Backups v2 são aceitos; formatos do app antigo não puderam ser inspecionados.

Os dados ficam no armazenamento do navegador, por endereço e aparelho. Limpar os dados do site pode apagar o histórico. Ao trocar de endereço ou dispositivo, exporte e restaure o JSON. Não há sincronização com a planilha após a importação inicial.

## Atualizações

Antes de substituir arquivos, exporte um backup. Preserve o endereço e a chave de armazenamento no código. Incremente CACHE em sw.js ao modificar arquivos. Feche todas as janelas do app e reabra para ativar a nova versão. O histórico existente v2 não é substituído pelo seed em atualizações.

## Verificação local

Sirva a pasta por HTTP local, por exemplo `python3 -m http.server 8080`, e abra http://localhost:8080. Não abra index.html diretamente pelo gerenciador de arquivos: módulos e service worker exigem servidor; no iPhone, use HTTPS.

Conferências automatizadas realizadas: sintaxe JavaScript; 23 exercícios e 76 registros extraídos da planilha; backup de ida e volta; rejeição de duplicatas e versão incompatível; distinção de zero e ausência; cálculo de série incompleta e tempo de prancha. Agachamento A, semana 1: 620 kg × reps e uma série incompleta. Prancha frontal, semana 1: 180 s.

Limites da verificação: não houve teste visual em navegador nem instalação em iPhone físico nesta execução. Teste recomendado após publicar: editar uma série, recarregar, conferir o histórico e gráfico, exportar/restaurar backup e reabrir em modo avião.

## Proveniência e continuidade

Fonte: treino_full_body_progressao_atualizado.xlsx. O hash SHA-256 da fonte está em seed.json. Nomes, metas, séries e registros foram extraídos das abas A, B e C. Datas não foram inventadas. O ZIP anterior full-body-tracker-pwa.zip não estava disponível; esta implementação reconstrói os recursos descritos no histórico acessível. Não foi possível comparar funcionalidades adicionais nem garantir migração de armazenamento da versão antiga.
