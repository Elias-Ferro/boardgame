# boardgame

Minha versão online do Banco Imobiliário.

## Como usar

Abra `index.html` no navegador.

- O banqueiro acessa `index.html?player=bank` para adicionar até seis jogadores e mover qualquer um deles.
- Cada participante recebe um link gerado pelo banqueiro no formato `index.html?player=ID`.
- O estado do jogo é salvo em *localStorage*. Abrir a página em outra aba do mesmo navegador mostra as informações atuais.
- O tabuleiro fica centralizado com duas barras laterais.
- O banqueiro vê a lista completa de jogadores, saldo e propriedades, podendo mover ou remover qualquer um na barra lateral direita.
- Cada jogador possui uma barra lateral com o botão **Rolar dados**, animação do dado e cartões das propriedades adquiridas.
- Cada casa do tabuleiro pode ser clicada pelo jogador que está nela para exibir um modal com informações e opção de compra.
