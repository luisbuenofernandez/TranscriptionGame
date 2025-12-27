const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");

const display = document.getElementById("textDisplay");
const input = document.getElementById("userInput");

let words = [];
let currentWord = 0;
let data = null;

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    startGame();
  });

function startGame() {
  const keys = Object.keys(data);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const text = data[randomKey][lang];

  words = text.split(" ");
  currentWord = 0;
  display.innerHTML = "";

  words.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.className = "word";
    display.appendChild(span);
  });

  input.value = "";
  input.focus();
}

input.addEventListener("input", () => {
  const typed = input.value;
  const target = words[currentWord];
  const wordSpan = display.children[currentWord];

  wordSpan.innerHTML = "";

  for (let i = 0; i < target.length; i++) {
    const span = document.createElement("span");
    span.textContent = target[i];

    if (typed[i] === undefined) {
      span.className = "";
    } else if (typed[i] === target[i]) {
      span.className = "correct-letter";
    } else {
      span.className = "wrong-letter";
    }
    wordSpan.appendChild(span);
  }

   // ✅ THIS LINE FIXES EVERYTHING
  wordSpan.appendChild(document.createTextNode(" "));
});

input.addEventListener("keydown", e => {
  if (e.key === " " || e.key === "Enter") {
    e.preventDefault();

    const typed = input.value;
    const target = words[currentWord];
    const wordSpan = display.children[currentWord];

    if (typed === target) {
      wordSpan.className = "word-flash";
      setTimeout(() => {
        wordSpan.className = "word-correct";
      }, 1000);

      input.value = "";
      currentWord++;

      if (currentWord === words.length) {
        finishParagraph();
      }
    } else {
      wordSpan.className = "word-error";
      setTimeout(() => {
        wordSpan.className = "word";
      }, 3000);
      input.value = "";
    }
  }
});

function finishParagraph() {
  [...display.children].forEach(w => w.style.color = "green");

  setTimeout(() => {
    display.innerHTML = "";
    startGame();
  }, 3000);
}

function goBack() {
  window.location.href = "index.html";
}
