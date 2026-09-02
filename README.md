<img width="1328" height="482" alt="playercar" src="https://github.com/user-attachments/assets/ecfcfba8-c2af-4cd3-a0b2-20932b96e5fc" />

# RadioCar

Um player web inspirado em rádios automotivos clássicos. O projeto une a aparência de um painel físico — metal, LEDs, botões com profundidade e tela digital — ao controle da conta Spotify do visitante.

## Recursos

- Visual skeuomórfico de rádio automotivo, com sombras, relevo e resposta de botão pressionado.
- Tela LCD com fonte de estética digital e animação de inicialização.
- Controle de volume pelo grande botão rotativo, inclusive com arrastar vertical em telas sensíveis ao toque.
- Botões físicos para ligar/desligar, tocar/pausar, faixa anterior, próxima, aleatório, repetição, informações e compartilhamento.
- Autenticação individual com Spotify: cada visitante conecta a própria conta; nenhuma senha é armazenada pelo RadioCar.
- Leitura das playlists da conta conectada e seleção de faixas no próprio painel.
- Reprodução via Spotify Web Playback SDK, com atualização de título, artista, progresso e volume no LCD.
- Modo minimalista: o botão físico do Spotify oculta ou reabre a biblioteca de playlists e faixas.
- Alternância entre acabamento escuro e claro.

## Requisitos do Spotify

O controle completo de reprodução no navegador usa o Spotify Web Playback SDK. Por isso, a conta conectada precisa ter **Spotify Premium**. 

O projeto utiliza OAuth com PKCE


