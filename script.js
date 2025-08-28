const urlParams = new URLSearchParams(window.location.search);
const playerIdParam = urlParams.get('player');

const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
let players = [];
let chanceCards = [];
let currentChance = null;

const squares = [
  { name: 'Partida', type: 'start' },
  { name: 'Leblon', price: 60, color: '#8B4513' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Presidente Vargas', price: 60, color: '#8B4513' },
  { name: 'Av. Nossa Senhora de Copacabana', price: 100, color: '#ADD8E6' },
  { name: 'Companhia Ferroviária', type: 'transport' },
  { name: 'Av. Brigadeiro Faria Lima', price: 100, color: '#ADD8E6' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Rebouças', price: 120, color: '#ADD8E6' },
  { name: 'Av. 9 de Julho', price: 140, color: '#FF69B4' },
  { name: 'Prisão', type: 'jail' },
  { name: 'Av. Europa', price: 140, color: '#FF69B4' },
  { name: 'Companhia de Viação', type: 'transport' },
  { name: 'Rua Augusta', price: 160, color: '#FF69B4' },
  { name: 'Av. Pacaembu', price: 160, color: '#FF69B4' },
  { name: 'Companhia de Táxi Aéreo', type: 'transport' },
  { name: 'Interlagos', price: 180, color: '#FFA500' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Morumbi', price: 180, color: '#FFA500' },
  { name: 'Av. 23 de Maio', price: 200, color: '#FFA500' },
  { name: 'Férias', type: 'vacation' },
  { name: 'Av. Estados Unidos', price: 220, color: '#FF0000' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Av. Washington Luiz', price: 220, color: '#FF0000' },
  { name: 'Av. Brasil', price: 240, color: '#FF0000' },
  { name: 'Companhia de Navegação', type: 'transport' },
  { name: 'Jardim Europa', price: 260, color: '#FFFF00' },
  { name: 'Av. Paulista', price: 260, color: '#FFFF00' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Brooklin', price: 280, color: '#FFFF00' },
  { name: 'Vá para a Prisão', type: 'gotojail' },
  { name: 'Campo Grande', price: 300, color: '#008000' },
  { name: 'Bangu', price: 300, color: '#008000' },
  { name: 'Sorte ou Revés', type: 'chance' },
  { name: 'Botafogo', price: 320, color: '#008000' },
  { name: 'Companhia de Aviões', type: 'transport' },
  { name: 'Aterro do Flamengo', price: 350, color: '#0000FF' },
  { name: 'Imposto de Renda', type: 'tax' },
  { name: 'Ipanema', price: 400, color: '#0000FF' },
  { name: 'Jardim Leblon', price: 450, color: '#0000FF' }
];

const jailIndex = squares.findIndex((s) => s.type === 'jail');
const vacationIndex = squares.findIndex((s) => s.type === 'vacation');

function loadPlayers() {
  players = JSON.parse(localStorage.getItem('players') || '[]');
  players.forEach((p) => {
    if (p.chanceUsed === undefined) p.chanceUsed = false;
    if (p.inJail === undefined) p.inJail = false;
  });
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
    if (squares[i].color) {
      square.style.borderTop = '0.5vmin solid ' + squares[i].color;
    }
    square.appendChild(label);
    if (squares[i].price) {
      const price = document.createElement('span');
      price.className = 'price';
      price.textContent = '$' + squares[i].price;
      square.appendChild(price);
    }
    if (squares[i].type === 'jail') {
      const icon = document.createElement('span');
      icon.className = 'icon jail-icon';
      icon.textContent = '👮';
      square.appendChild(icon);
    } else if (squares[i].type === 'gotojail') {
      const icon = document.createElement('span');
      icon.className = 'icon gotojail-icon';
      icon.textContent = '↙';
      square.appendChild(icon);
    }
    square.addEventListener('click', () => {
      if (!playerIdParam || playerIdParam === 'bank') return;
      const player = players.find((p) => p.id === playerIdParam);
      if (!player) return;
      if (player.position !== i) return;
      if (!squares[i].type) {
        showPropertyModal(i, player);
      } else if (squares[i].type === 'chance' && !player.chanceUsed) {
        showChanceModal(player);
      }
    });
    board.appendChild(square);
  }
}

function renderBoard() {
  for (let i = 0; i < 40; i++) {
    const square = document.getElementById('sq' + i);
    const label = square.querySelector('.name');
    const price = square.querySelector('.price');
    const icon = square.querySelector('.icon');
    square.innerHTML = '';
    square.appendChild(label);
    if (price) square.appendChild(price);
    if (icon) square.appendChild(icon);
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
  if (player.inJail) {
    player.balance -= 50;
    player.inJail = false;
  }
  const oldPos = player.position;
  let newPos = (oldPos + steps) % 40;
  const laps = Math.floor((oldPos + steps) / 40);
  if (laps > 0) player.balance += laps * 100;
  if (squares[newPos].type === 'gotojail' || newPos === jailIndex) {
    newPos = jailIndex;
    player.inJail = true;
  } else if (newPos === vacationIndex) {
    const occupied = players.some(
      (p) => p.id !== player.id && p.position === newPos
    );
    if (occupied) {
      newPos = (newPos - 1 + 40) % 40;
    } else {
      player.balance += 100;
    }
  }
  player.position = newPos;
  player.chanceUsed = false;
  savePlayers();
  renderBoard();
  if (playerIdParam === 'bank') {
    updateBankerList();
  } else if (playerIdParam) {
    updatePlayerInfo(playerIdParam);
  }
  if (player.inJail) {
    showJailModal();
  }
}

function setupBankerControls() {
  const controls = document.getElementById('sidebar');
  const addForm = document.createElement('div');
  addForm.innerHTML =
    '<input id="newPlayerName" placeholder="Nome"> <button id="addPlayer">Adicionar</button>';
  controls.insertBefore(addForm, document.getElementById('dice'));

  document.getElementById('addPlayer').onclick = () => {
    const name = document.getElementById('newPlayerName').value.trim();
    if (!name || players.length >= 6) return;
    const id = Date.now().toString();
    const color = colors[players.length % colors.length];
    players.push({
      id,
      name,
      color,
      position: 0,
      balance: 1500,
      properties: [],
      chanceUsed: false,
      inJail: false,
    });
    savePlayers();
    renderBoard();
    updateBankerList();
  };

  const list = document.createElement('div');
  list.id = 'bankerList';
  controls.insertBefore(list, document.getElementById('dice'));

  updateBankerList();
}

function updateBankerList() {
  const list = document.getElementById('bankerList');
  list.innerHTML = '';
  players.forEach((p) => {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.style.color = p.color;
    summary.textContent = p.name;
    details.appendChild(summary);

    const body = document.createElement('div');
    const link = `${location.pathname}?player=${p.id}`;
    body.innerHTML =
      `Pos: ${p.position}<br>` +
      `Saldo: <span id="bal-${p.id}">${p.balance}</span><br>` +
      `Propriedades: ${p.properties.join(', ') || 'Nenhuma'}<br>` +
      `<a href="${link}">link</a><br>` +
      `<input type="number" id="step-${p.id}" min="1" placeholder="passos">` +
      `<button data-move="${p.id}">Mover</button><br>` +
      `<input type="number" id="cash-${p.id}" placeholder="valor">` +
      `<button data-add="${p.id}">Adicionar</button>` +
      `<button data-sub="${p.id}">Remover</button> ` +
      `<button data-remove="${p.id}">Excluir</button>`;
    details.appendChild(body);
    list.appendChild(details);
  });
  list.querySelectorAll('button[data-move]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-move');
      const steps = parseInt(document.getElementById('step-' + id).value, 10) || 0;
      movePlayer(id, steps);
    });
  });
  list.querySelectorAll('button[data-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-add');
      const amount = parseInt(document.getElementById('cash-' + id).value, 10) || 0;
      const player = players.find((pl) => pl.id === id);
      player.balance += amount;
      savePlayers();
      renderBoard();
      updateBankerList();
    });
  });
  list.querySelectorAll('button[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-sub');
      const amount = parseInt(document.getElementById('cash-' + id).value, 10) || 0;
      const player = players.find((pl) => pl.id === id);
      player.balance -= amount;
      savePlayers();
      renderBoard();
      updateBankerList();
    });
  });
  list.querySelectorAll('button[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove');
      players = players.filter((pl) => pl.id !== id);
      savePlayers();
      renderBoard();
      updateBankerList();
    });
  });
}

function setupPlayerControls(id) {
  const controls = document.getElementById('sidebar');
  const info = document.createElement('div');
  info.id = 'playerInfo';
  controls.insertBefore(info, document.getElementById('dice'));

  const props = document.createElement('div');
  props.id = 'playerProperties';
  controls.insertBefore(props, document.getElementById('dice'));

  const btn = document.createElement('button');
  btn.textContent = 'Rolar dados';
  controls.insertBefore(btn, document.getElementById('dice'));
  btn.addEventListener('click', () => {
    rollDice(id);
  });

  updatePlayerInfo(id);
}

function updatePlayerInfo(id) {
  const player = players.find((p) => p.id === id);
  const info = document.getElementById('playerInfo');
  if (!player || !info) return;
  info.innerHTML = `<div>Saldo: ${player.balance}</div>`;
  const props = document.getElementById('playerProperties');
  if (props) {
    props.innerHTML = '';
    player.properties.forEach((name) => {
      const card = document.createElement('div');
      card.className = 'property-card';
      card.textContent = name;
      props.appendChild(card);
    });
  }
}

function showDiceRoll(result) {
  return new Promise((resolve) => {
    const dice = document.getElementById('dice');
    if (!dice) {
      resolve();
      return;
    }
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
          resolve();
        }, 1000);
      }
    }, 100);
  });
}

function rollDice(id) {
  const roll = Math.floor(Math.random() * 6) + 1;
  localStorage.setItem(
    'lastRoll',
    JSON.stringify({ result: roll, time: Date.now() })
  );
  showDiceRoll(roll).then(() => {
    movePlayer(id, roll);
  });
}

function showJailModal() {
  const modal = document.getElementById('jailModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.getElementById('closeJail').onclick = () => {
    modal.classList.add('hidden');
  };
}

function showChanceModal(player) {
  if (!chanceCards.length || player.chanceUsed) return;
  player.chanceUsed = true;
  savePlayers();
  currentChance = chanceCards[Math.floor(Math.random() * chanceCards.length)];
  document.getElementById('chanceText').textContent = currentChance.text;
  document.getElementById('chanceModal').classList.remove('hidden');
  document.getElementById('closeChance').onclick = () => {
    player.balance += currentChance.value;
    savePlayers();
    if (playerIdParam === 'bank') {
      updateBankerList();
    } else {
      updatePlayerInfo(player.id);
    }
    document.getElementById('chanceModal').classList.add('hidden');
  };
}

function showPropertyModal(index, player) {
  const modal = document.getElementById('propertyModal');
  const nameEl = document.getElementById('modalName');
  const infoEl = document.getElementById('modalInfo');
  const buyBtn = document.getElementById('buyBtn');
  const square = squares[index];
  const price = square.price || 0;
  nameEl.textContent = square.name;
  infoEl.textContent = `Preço: ${price}`;
  const owned = player.properties.includes(square.name);
  buyBtn.style.display = owned ? 'none' : 'block';
  buyBtn.onclick = () => {
    if (player.balance >= price) {
      player.balance -= price;
      player.properties.push(square.name);
      savePlayers();
      updatePlayerInfo(player.id);
    }
    hideModal();
  };
  modal.classList.remove('hidden');
}

function hideModal() {
  document.getElementById('propertyModal').classList.add('hidden');
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
document.getElementById('closeModal').addEventListener('click', hideModal);
fetch('sorteReves.json').then(r=>r.json()).then(data=>chanceCards=data);

const sidebar = document.getElementById('sidebar');
if (playerIdParam === 'bank') {
  setupBankerControls();
} else if (playerIdParam) {
  setupPlayerControls(playerIdParam);
} else if (sidebar) {
  sidebar.textContent = 'Acesse com ?player=bank para o banqueiro ou ?player=<id> para jogador.';
}
