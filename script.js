const urlParams = new URLSearchParams(window.location.search);
const playerIdParam = urlParams.get('player');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let players = [];

const squares = [
  { name: 'Partida', type: 'start' },
  { name: 'Leblon' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Presidente Vargas' },
  { name: 'Av. Nossa Senhora de Copacabana' },
  { name: 'Companhia Ferroviária', type: 'transport' },
  { name: 'Av. Brigadeiro Faria Lima' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Rebouças' },
  { name: 'Av. 9 de Julho' },
  { name: 'Prisão', type: 'jail' },
  { name: 'Av. Europa' },
  { name: 'Companhia de Viação', type: 'transport' },
  { name: 'Rua Augusta' },
  { name: 'Av. Pacaembu' },
  { name: 'Companhia de Táxi Aéreo', type: 'transport' },
  { name: 'Interlagos' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Morumbi' },
  { name: 'Av. 23 de Maio' },
  { name: 'Férias', type: 'vacation' },
  { name: 'Av. Estados Unidos' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Washington Luiz' },
  { name: 'Av. Brasil' },
  { name: 'Companhia de Navegação', type: 'transport' },
  { name: 'Jardim Europa' },
  { name: 'Av. Paulista' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Brooklin' },
  { name: 'Vá para a Prisão', type: 'gotojail' },
  { name: 'Campo Grande' },
  { name: 'Bangu' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Botafogo' },
  { name: 'Companhia de Aviões', type: 'transport' },
  { name: 'Aterro do Flamengo' },
  { name: 'Imposto de Renda', type: 'tax' },
  { name: 'Ipanema' },
  { name: 'Jardim Leblon' }
];

function loadPlayers() {
  players = JSON.parse(localStorage.getItem('players') || '[]');
}

function savePlayers() {
  localStorage.setItem('players', JSON.stringify(players));
}

function indexToGrid(i) {
  if (i <= 10) return { row: 11, col: 11 - i };
  if (i <= 20) return { row: 11 - (i - 10), col: 1 };
  if (i <= 30) return { row: 1, col: (i - 20) + 1 };
  return { row: (i - 30) + 1, col: 11 };
}

function createBoard() {
  const board = document.getElementById('board');
  for (let i = 0; i < 40; i++) {
    const square = document.createElement('div');
    square.className = 'square';
    square.id = 'sq' + i;
    const pos = indexToGrid(i);
    square.style.gridRow = pos.row;
    square.style.gridColumn = pos.col;
    const label = document.createElement('span');
    label.className = 'name';
    label.textContent = squares[i].name;
    square.appendChild(label);
    board.appendChild(square);
  }
}

function renderBoard() {
  for (let i = 0; i < 40; i++) {
    const square = document.getElementById('sq' + i);
    const label = square.querySelector('.name');
    square.innerHTML = '';
    square.appendChild(label);
  }
  players.forEach((p) => {
    const token = document.createElement('div');
    token.className = 'token';
    token.style.backgroundColor = p.color;
    token.textContent = p.name;
    const square = document.getElementById('sq' + p.position);
    const index = square.querySelectorAll('.token').length;
    token.style.left = '2px';
    token.style.top = 2 + index * 16 + 'px';
    square.appendChild(token);
  });
}

function movePlayer(id, steps) {
  const player = players.find((p) => p.id === id);
  if (!player) return;
  player.position = (player.position + steps) % 40;
  savePlayers();
  renderBoard();
  if (playerIdParam === 'bank') {
    updateBankerList();
  } else if (playerIdParam) {
    updatePlayerInfo(playerIdParam);
  }
}

function setupBankerControls() {
  const controls = document.getElementById('controls');
  const addForm = document.createElement('div');
  addForm.innerHTML =
    '<input id="newPlayerName" placeholder="Nome"> <button id="addPlayer">Adicionar</button>';
  controls.appendChild(addForm);

  document.getElementById('addPlayer').onclick = () => {
    const name = document.getElementById('newPlayerName').value.trim();
    if (!name || players.length >= 6) return;
    const id = Date.now().toString();
    const color = colors[players.length % colors.length];
    players.push({ id, name, color, position: 0, balance: 1500, properties: [] });
    savePlayers();
    renderBoard();
    updateBankerList();
  };

  const list = document.createElement('div');
  list.id = 'bankerList';
  controls.appendChild(list);

  updateBankerList();
}

function updateBankerList() {
  const list = document.getElementById('bankerList');
  list.innerHTML = '';
  players.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'playerRow';
    const link = `${location.pathname}?player=${p.id}`;
    row.innerHTML =
      `<span style="color:${p.color}">${p.name}</span> (pos ${p.position})<br>` +
      `Saldo: ${p.balance} - Props: ${p.properties.length}<br>` +
      `<a href="${link}">link</a> ` +
      `<input type="number" id="step-${p.id}" min="1" placeholder="passos">` +
      `<button data-id="${p.id}">Mover</button> ` +
      `<button data-remove="${p.id}">Remover</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const steps = parseInt(document.getElementById('step-' + id).value, 10) || 0;
      movePlayer(id, steps);
    });
  });
  list.querySelectorAll('button[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove');
      players = players.filter((p) => p.id !== id);
      savePlayers();
      renderBoard();
      updateBankerList();
    });
  });
}

function setupPlayerControls(id) {
  const controls = document.getElementById('controls');
  const info = document.createElement('div');
  info.id = 'playerInfo';
  controls.appendChild(info);
  updatePlayerInfo(id);

  const btn = document.createElement('button');
  btn.textContent = 'Rolar dados';
  controls.appendChild(btn);
  btn.addEventListener('click', () => {
    rollDice(id);
  });
}

function updatePlayerInfo(id) {
  const player = players.find((p) => p.id === id);
  const info = document.getElementById('playerInfo');
  if (!player || !info) return;
  info.innerHTML =
    `<div>Saldo: ${player.balance}</div><div>Propriedades: ${
      player.properties.join(', ') || 'Nenhuma'
    }</div>`;
}

function showDiceRoll(result) {
  const dice = document.getElementById('dice');
  dice.style.display = 'block';
  let count = 0;
  const interval = setInterval(() => {
    dice.textContent = Math.floor(Math.random() * 6) + 1;
    count++;
    if (count > 10) {
      clearInterval(interval);
      dice.textContent = result;
      setTimeout(() => {
        dice.style.display = 'none';
      }, 1000);
    }
  }, 100);
}

function rollDice(id) {
  const roll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
  movePlayer(id, roll);
  localStorage.setItem('lastRoll', JSON.stringify({ result: roll, time: Date.now() }));
  showDiceRoll(roll);
}

window.addEventListener('storage', (e) => {
  if (e.key === 'players') {
    loadPlayers();
    renderBoard();
    if (playerIdParam === 'bank') {
      updateBankerList();
    } else if (playerIdParam) {
      updatePlayerInfo(playerIdParam);
    }
  }
  if (e.key === 'lastRoll' && e.newValue) {
    const data = JSON.parse(e.newValue);
    showDiceRoll(data.result);
  }
});

createBoard();
loadPlayers();
renderBoard();

if (playerIdParam === 'bank') {
  setupBankerControls();
} else if (playerIdParam) {
  setupPlayerControls(playerIdParam);
}
