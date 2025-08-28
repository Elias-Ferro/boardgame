# boardgame

Minha versão online do Banco Imobiliário.

## Como usar

Abra `index.html` no navegador.

- O banqueiro acessa `index.html?player=bank` para adicionar até seis jogadores e mover qualquer um deles.
- Cada participante recebe um link gerado pelo banqueiro no formato `index.html?player=ID`.
- O estado do jogo é salvo em *localStorage*. Abrir a página em outra aba do mesmo navegador mostra as informações atuais.
- O tabuleiro ocupa a área principal e os controles ficam em uma barra lateral à esquerda.
- O layout é responsivo, mantendo o jogo visível sem rolagem.
- O banqueiro vê a lista completa de jogadores, saldo e propriedades, podendo mover ou remover qualquer um na barra lateral.
- Cada jogador usa a mesma barra lateral para rolar dados, ver saldo e cartas das propriedades adquiridas.
- As casas do tabuleiro exibem o nome, preço e uma faixa colorida conforme o Banco Imobiliário.
- Cada casa do tabuleiro pode ser clicada pelo jogador que está nela para exibir um modal com informações e opção de compra.
