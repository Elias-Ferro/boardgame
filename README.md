# boardgame

Minha versão online do Banco Imobiliário.

## Como usar

Abra `index.html` no navegador.

- O banqueiro acessa `index.html?player=bank` para adicionar até seis jogadores e mover qualquer um deles.
- Cada participante recebe um link gerado pelo banqueiro no formato `index.html?player=ID`.
- O estado do jogo é salvo em *localStorage*. Abrir a página em outra aba do mesmo navegador mostra as informações atuais.
- O painel de controle aparece como uma barra lateral à direita do tabuleiro.
- O banqueiro vê a lista completa de jogadores, saldo e propriedades, podendo mover ou remover qualquer um.
- Cada jogador vê apenas seu saldo e suas propriedades.
- O resultado do dado é exibido para todos acima do tabuleiro.
