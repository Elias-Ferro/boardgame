const urlParams = new URLSearchParams(window.location.search);
const playerIdParam = urlParams.get('player');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let players = [];

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
    board.appendChild(square);
  }
}

function renderBoard() {
  for (let i = 0; i < 40; i++) {
    const square = document.getElementById('sq' + i);
    square.innerHTML = '';
  }
  players.forEach((p) => {
    const token = document.createElement('div');
    token.className = 'token';
    token.style.backgroundColor = p.color;
    const square = document.getElementById('sq' + p.position);
    const index = square.children.length;
    token.style.left = 2 + index * 14 + 'px';
    token.style.top = '2px';
    square.appendChild(token);
  });
}

function movePlayer(id, steps) {
  const player = players.find((p) => p.id === id);
  if (!player) return;
  player.position = (player.position + steps) % 40;
  savePlayers();
  renderBoard();
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
    players.push({ id, name, color, position: 0 });
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
      `<span style="color:${p.color}">${p.name}</span> - <a href="${link}">link</a> ` +
      `<input type="number" id="step-${p.id}" min="1" placeholder="passos"><button data-id="${p.id}">Mover</button>`;
    list.appendChild(row);
  });
  list.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const steps = parseInt(document.getElementById('step-' + id).value, 10) || 0;
      movePlayer(id, steps);
    });
  });
}

function setupPlayerControls(id) {
  const controls = document.getElementById('controls');
  const btn = document.createElement('button');
  btn.textContent = 'Lançar dados';
  controls.appendChild(btn);
  btn.addEventListener('click', () => {
    const roll =
      Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    movePlayer(id, roll);
    alert('Você moveu ' + roll + ' casas');
  });
}

window.addEventListener('storage', () => {
  loadPlayers();
  renderBoard();
});

createBoard();
loadPlayers();
renderBoard();

if (playerIdParam === 'bank') {
  setupBankerControls();
} else if (playerIdParam) {
  setupPlayerControls(playerIdParam);
}
