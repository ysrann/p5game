const board = document.getElementById("board");
const rollDiceBtn = document.getElementById("rollDice");
const diceDisplay = document.getElementById("dice-display");
const turnDisplay = document.getElementById("turnDisplay");
const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers");
const timerEl = document.getElementById("timer");

let turn = 1;
let positions = [0, 0];
let isRolling = false;
let questionPositions = [5, 12, 18, 26, 32, 35, 43, 48, 51, 59, 66, 73, 83, 88, 94, 98];
let timer;

const questions = [
{
  q: "Siapa penemu teori relativitas?",
  options: ["Isaac Newton", "Albert Einstein", "Nikola Tesla"],
  answer: "Albert Einstein"
},
{
  q: "Negara mana yang pertama kali mengirim manusia ke luar angkasa?",
  options: ["Amerika Serikat", "Rusia", "Cina"],
  answer: "Rusia"
},
{
  q: "Sungai terpanjang di dunia adalah?",
  options: ["Amazon", "Nil", "Yangtze"],
  answer: "Nil"
},
{
  q: "Bahasa dengan jumlah penutur asli terbanyak di dunia adalah?",
  options: ["Bahasa Inggris", "Bahasa Spanyol", "Bahasa Mandarin"],
  answer: "Bahasa Mandarin"
},
{
  q: "Unsur kimia dengan simbol 'Au' adalah?",
  options: ["Perak", "Emas", "Aluminium"],
  answer: "Emas"
},
{
  q: "Siapa pelukis dari karya terkenal 'Mona Lisa'?",
  options: ["Michelangelo", "Vincent van Gogh", "Leonardo da Vinci"],
  answer: "Leonardo da Vinci"
},
{
  q: "Apa nama negara yang memiliki jumlah pulau terbanyak di dunia?",
  options: ["Filipina", "Indonesia", "Swedia"],
  answer: "Swedia"
},
{
  q: "Dalam mitologi Yunani, siapa dewa laut?",
  options: ["Zeus", "Hades", "Poseidon"],
  answer: "Poseidon"
},
{
  q: "Apa nama teleskop luar angkasa yang diluncurkan oleh NASA pada tahun 1990?",
  options: ["Kepler", "Hubble", "James Webb"],
  answer: "Hubble"
}, 
  {
    q: "Apa ibu kota Indonesia?",
    options: ["Jakarta", "Bandung", "Surabaya"],
    answer: "Jakarta"
  },
  {
    q: "Siapa presiden pertama Indonesia?",
    options: ["Soekarno", "Soeharto", "Jokowi"],
    answer: "Soekarno"
  },
  {
    q: "Gunung tertinggi di Indonesia?",
    options: ["Semeru", "Kerinci", "Puncak Jaya"],
    answer: "Puncak Jaya"
  },
  {
    q: "Kapan hari pendidikan nasional?",
    options: ["21 april", "21 mei", "2 april", "2 mei"],
    answer: "2 mei"
  },
  {
    q: "Kapan hari kesaktian Pancasila?",
    options: ["1 Oktober", "1 November", "1 Juni"],
    answer: "1 Oktober"
  },
  {
    q: "Gunung tertinggi didunia terletak di negara?",
    options: ["Jepang", "Finlandia", "Nepal"],
    answer: "Nepal"
  },
  {
    q: "Benua terkecil di dunia adalah?",
    options: ["Australia", "Eropa", "Antartika"],
    answer: "Australia"
  },
  {
    q: "Yang termasuk lembaga eksekutif ialah?",
    options: ["DPR", "Presiden", "Mahkamah Agung"],
    answer: "Presiden"
  }
];

function createBoard() {
  for (let i = 99; i >= 0; i--) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    if (questionPositions.includes(i)) cell.classList.add("question");
    cell.textContent = i + 1;
    board.appendChild(cell);
  }
}

function updatePawns() {
  document.querySelectorAll(".pion").forEach(el => el.remove());
  positions.forEach((pos, i) => {
    const pion = document.createElement("div");
    pion.className = `pion player${i + 1}`;
    const cell = board.querySelector(`.cell[data-index='${pos}']`);
    if (cell) cell.appendChild(pion);
  });
}

function rollDice() {
  if (isRolling) return;
  isRolling = true;
  const dice = Math.floor(Math.random() * 6) + 1;
  diceDisplay.textContent = `🎲 ${dice}`;
  const playerIndex = turn - 1;
  let newPos = positions[playerIndex] + dice;
  if (newPos > 99) newPos = 99;

  positions[playerIndex] = newPos;
  updatePawns();
  setTimeout(() => {
    if (questionPositions.includes(newPos)) {
      askQuestion(playerIndex);
    } else {
      checkWin();
      nextTurn();
    }
  }, 600);
}

function askQuestion(playerIndex) {
  const q = questions[Math.floor(Math.random() * questions.length)];
  questionText.textContent = q.q;
  answersBox.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => handleAnswer(opt === q.answer, playerIndex);
    answersBox.appendChild(btn);
  });
  questionBox.classList.add("show");
  let timeLeft = 10;
  timerEl.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(false, playerIndex);
    }
  }, 1000);
}

function handleAnswer(correct, playerIndex) {
  clearInterval(timer);
  questionBox.classList.remove("show");
  if (!correct) {
  const penalty = Math.floor(Math.random() * 28) + 3; // angka acak antara 3–30
  positions[playerIndex] = Math.max(positions[playerIndex] - penalty, 0);
  alert(`Jawaban salah! Mundur ${penalty} kotak.`);
  updatePawns();
  }
  checkWin();
  nextTurn();
}

function checkWin() {
  positions.forEach((pos, i) => {
    if (pos >= 99) {
      alert(`Pemain ${i + 1} menang!`);
      location.reload();
    }
  });
}

function nextTurn() {
  turn = turn === 1 ? 2 : 1;
  turnDisplay.textContent = `Giliran: Pemain ${turn} (${turn === 1 ? "Merah" : "Kuning"})`;
  isRolling = false;
}

createBoard();
updatePawns();
rollDiceBtn.onclick = rollDice;
