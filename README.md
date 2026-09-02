# RadioCar

Um player web inspirado em rádios automotivos clássicos. O projeto une a aparência de um painel físico — metal, LEDs, botões com profundidade e tela digital — ao controle da conta Spotify do visitante.

## Acesse

Após a publicação no GitHub Pages, o endereço do projeto é:

`https://mateusfrmacedo.github.io/radiocar/`

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

No painel do aplicativo em [Spotify for Developers](https://developer.spotify.com/dashboard), cadastre estes redirecionamentos:

```text
http://127.0.0.1:5173/
https://mateusfrmacedo.github.io/radiocar/
```

Para liberar o projeto para pessoas além dos usuários de teste, solicite a extensão de quota no painel do Spotify e cumpra os requisitos de produção da plataforma.

## Desenvolvimento local

Abra a pasta do projeto e inicie um servidor HTTP:

```bash
python3 -m http.server 5173 --bind 127.0.0.1
```

Depois, acesse `http://127.0.0.1:5173/`. Não use o endereço `file://` para conectar ao Spotify, porque o OAuth exige uma URL HTTP/HTTPS cadastrada.

## Estrutura

```text
index.html          interface, controles e integração Spotify
style.css           aparência responsiva e efeitos visuais
animação.MP4       animação reproduzida no LCD ao iniciar
```

## Publicação

O site é estático e pode ser servido diretamente pelo GitHub Pages a partir da branch `main` e da pasta raiz (`/`). Depois de um novo commit, o GitHub Pages pode levar alguns minutos para atualizar.

## Privacidade

Os tokens de acesso necessários para a sessão do Spotify ficam somente no armazenamento local do navegador do visitante. O RadioCar não possui servidor próprio nem armazena dados de contas musicais.
