# RadioCar

<img width="799" height="410" alt="img" src="https://github.com/user-attachments/assets/483a33c1-a947-497c-b84e-43a5f4f04e68" />

Um player web inspirado em rádios automotivos clássicos. O projeto une a aparência de um painel físico — metal, LEDs, botões com profundidade e tela digital — ao controle da conta Spotify do visitante.

## Acesse

Após a publicação no GitHub Pages, o endereço do projeto é:

`https://mateusfrmacedo.github.io/radiocar/`

## Recursos

- Visual skeuomórfico de rádio automotivo, com sombras, relevo e resposta de botão pressionado.
- Tela LCD com fonte de estética digital e animação de inicialização.
- Equalizador LCD com animações, picos orgânicos e cores sincronizadas com a iluminação escolhida.
- Modo **MIC EQ** opcional: usa o microfone, mediante autorização, para mover o equalizador conforme o som ambiente.
- Controle de volume pelo grande botão rotativo, inclusive com arrastar vertical em telas sensíveis ao toque.
- Botões físicos para ligar/desligar, tocar/pausar, faixa anterior, próxima, aleatório, repetição, informações e compartilhamento.
- Autenticação individual com Spotify: cada visitante conecta a própria conta; nenhuma senha é armazenada pelo RadioCar.
- Leitura das playlists da conta conectada e seleção de faixas no próprio painel.
- Reprodução via Spotify Web Playback SDK, com atualização de título, artista, progresso e volume no LCD.
- Modo minimalista: o botão físico do Spotify oculta ou reabre a biblioteca de playlists e faixas.
- Alternância entre acabamento escuro e claro.

## Controles do painel

| Controle | Função |
| --- | --- |
| Power | Liga ou desliga o rádio e as luzes vermelhas do painel. |
| Botão rotativo | Ajusta o volume. Arraste para cima ou para baixo. |
| Play/Pause | Inicia ou pausa a faixa atual. |
| Botão Spotify | Antes da conexão, abre o login do Spotify. Depois, mostra ou oculta playlists e faixas. |
| Menu | Mostra a biblioteca de playlists. |
| Voltar / anterior | Retorna à faixa anterior. |
| Próxima | Avança para a próxima faixa. |
| Aleatório | Ativa ou desativa a reprodução aleatória. |
| Repetição | Alterna a repetição da faixa. |
| Info | Mostra informações do RadioCar no LCD. |
| Compartilhar | Copia o título e o artista da faixa atual quando o navegador permite. |
| USB | Exibe uma mensagem indicando que a reprodução é feita pelo Spotify. |
| MIC EQ (configurações) | Solicita acesso ao microfone e faz o equalizador reagir ao som ambiente. Pressione novamente para desligar. |

## Requisitos do Spotify

O controle completo de reprodução no navegador usa o Spotify Web Playback SDK. Por isso, a conta conectada precisa ter **Spotify Premium**. Contas gratuitas podem concluir o login, mas a reprodução dentro do player pode não ser disponibilizada pela plataforma.

O projeto utiliza OAuth com PKCE. 

## Privacidade

Os tokens de acesso necessários para a sessão do Spotify ficam somente no armazenamento local do navegador do visitante. O RadioCar não possui servidor próprio nem armazena dados de contas musicais.
