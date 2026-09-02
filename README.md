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

## Requisitos do Spotify

O controle completo de reprodução no navegador usa o Spotify Web Playback SDK. Por isso, a conta conectada precisa ter **Spotify Premium**. Contas gratuitas podem concluir o login, mas a reprodução dentro do player pode não ser disponibilizada pela plataforma.

O projeto utiliza OAuth com PKCE. O identificador público do aplicativo Spotify fica no código, mas o `client secret` nunca deve ser colocado em arquivos publicados ou no navegador.


