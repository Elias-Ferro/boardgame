## Banco Imobiliário Online

Uma adaptação simples do clássico jogo de compra e venda de propriedades, feita apenas com HTML, CSS e JavaScript.

## Conceito

Os participantes percorrem o tabuleiro adquirindo propriedades e cobrando aluguel. O banqueiro administra o dinheiro e garante que as regras sejam seguidas.

## Como jogar

1. Abra `index.html` no navegador.
2. O banqueiro acessa `index.html?player=bank` e compartilha os links gerados (`index.html?player=ID`) com até seis participantes.
3. Cada jogador rola os dados, move seu pino e pode comprar a propriedade em que cair, quando disponível.
4. Ao passar ou cair na casa **Partida**, o jogador recebe 100 de bônus.
5. A casa **Férias** também concede 100 ao participante que chegar nela, mas apenas um jogador pode ocupá-la por vez.
6. Se cair em uma propriedade já comprada, o dono pode cobrar aluguel e o jogador paga usando "Pagar aluguel".
7. O banqueiro visualiza todos os participantes em uma lista expansível e pode ajustar seus saldos.
8. O dado é de seis lados e aparece no rodapé da barra lateral sem deslocar os controles.
9. O estado da partida é salvo no *localStorage*, permitindo retomar o jogo no mesmo navegador.
