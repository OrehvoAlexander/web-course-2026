
const CODE_LENGTH = 4;
let secret = '';
let attempts = [];
let gameOver = false;

const input = document.getElementById('guess-input');
const checkBtn = document.getElementById('check-btn');
const newGameBtn = document.getElementById('new-game-btn');
const messageEl = document.getElementById('message');
const countEl = document.getElementById('attempts-count');
const historyEl = document.getElementById('history');
const lastGuessEl = document.getElementById('last-guess');
const lastResultEl = document.getElementById('last-result');

// Генерация случайного числа из 4 неповторяющихся цифр 
function generateSecret() {
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, CODE_LENGTH).join('');
}

// Проверка ввода.
function validateGuess(value) {
  if (value === '') return 'Введите число из 4 цифр.';
  if (!/^\d+$/.test(value)) return 'Допустимы только цифры 0–9: без букв, пробелов и символов.';
  if (value.length !== CODE_LENGTH) return `Нужно ровно ${CODE_LENGTH} цифры, а введено ${value.length}.`;
  if (new Set(value).size !== CODE_LENGTH) return 'Все цифры должны быть разными.';
  if (attempts.some(a => a.guess === value)) return 'Такая попытка уже была. Введите другое число.';
  return null;
}

// Подсчёт быков и коров
function countBullsAndCows(secretCode, guess) {
  let bulls = 0, cows = 0;
  const statuses = guess.split('').map((digit, i) => {
    if (secretCode[i] === digit) { bulls++; return 'bull'; }
    if (secretCode.includes(digit)) { cows++; return 'cow'; }
    return 'miss';
  });
  return { bulls, cows, statuses };
}

function plural(n, one, few, many) {
  const n100 = n % 100, n10 = n % 10;
  if (n100 >= 11 && n100 <= 14) return many;
  if (n10 === 1) return one;
  if (n10 >= 2 && n10 <= 4) return few;
  return many;
}

function resultText(bulls, cows) {
  return `${bulls} ${plural(bulls, 'бык', 'быка', 'быков')}, ${cows} ${plural(cows, 'корова', 'коровы', 'коров')}`;
}

// ===== Отрисовка
function createTiles(guess, statuses) {
  const frag = document.createDocumentFragment();
  guess.split('').forEach((digit, i) => {
    const tile = document.createElement('span');
    tile.className = 'tile ' + statuses[i];
    tile.textContent = digit;
    frag.appendChild(tile);
  });
  return frag;
}

function render() {
  countEl.textContent = attempts.length;

  lastGuessEl.innerHTML = '';
  const last = attempts[attempts.length - 1];
  if (last) {
    lastGuessEl.appendChild(createTiles(last.guess, last.statuses));
    lastResultEl.textContent = resultText(last.bulls, last.cows);
  } else {
    for (let i = 0; i < CODE_LENGTH; i++) {
      const t = document.createElement('span');
      t.className = 'tile empty';
      t.textContent = '?';
      lastGuessEl.appendChild(t);
    }
    lastResultEl.textContent = 'Попыток пока нет.';
  }

  // История
  historyEl.innerHTML = '';
  if (attempts.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty-note';
    li.textContent = 'Здесь появятся ваши попытки.';
    historyEl.appendChild(li);
  } else {
    attempts.slice().reverse().forEach(a => {
      const li = document.createElement('li');
      const digits = document.createElement('span');
      digits.className = 'digits';
      digits.appendChild(createTiles(a.guess, a.statuses));
      const res = document.createElement('span');
      res.className = 'res';
      res.textContent = `${a.guess} → ${resultText(a.bulls, a.cows)}`;
      li.append(digits, res);
      historyEl.appendChild(li);
    });
  }

  input.disabled = gameOver;
  checkBtn.disabled = gameOver;
}

function showMessage(text, isWin = false) {
  messageEl.textContent = text;
  messageEl.classList.toggle('win', isWin);
  input.classList.toggle('invalid', !isWin && text !== '');
}

function handleCheck() {
  if (gameOver) return;
  const value = input.value.trim();
  const error = validateGuess(value);
  if (error) {
    showMessage(error);
    return;
  }
  const { bulls, cows, statuses } = countBullsAndCows(secret, value);
  attempts.push({ guess: value, bulls, cows, statuses });
  input.value = '';

  if (bulls === CODE_LENGTH) {
    gameOver = true;
    showMessage(`Победа! Угадано за ${attempts.length} ${plural(attempts.length, 'попытку', 'попытки', 'попыток')}`, true);
  } else {
    showMessage('');
  }
  render();
  if (!gameOver) input.focus();
}

function newGame() {
  secret = generateSecret();
  attempts = [];
  gameOver = false;
  input.value = '';
  showMessage('');
  render();
  input.focus();
}

checkBtn.addEventListener('click', handleCheck);
input.addEventListener('keydown', e => { if (e.key === 'Enter') handleCheck(); });
input.addEventListener('input', () => { if (!gameOver) showMessage(''); });
newGameBtn.addEventListener('click', newGame);

newGame();
