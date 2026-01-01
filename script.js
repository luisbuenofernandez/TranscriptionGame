const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");
const language = document.getElementById("language");

const display = document.getElementById("textDisplay");
const input = document.getElementById("userInput");

let words = [];
let currentWord = 0;
let data = null;

if (lang === "rm"){
  language.innerHTML = "<hp>rm</h>";
} else {
  language.innerHTML = `<hp>${lang}</p>` ;
}

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    startGame();
  });

function getRandomLanguage() {
  const langs = ["en", "pt", "it"];
  return langs[Math.floor(Math.random() * langs.length)];
}

/* ✅ MOBILE-SAFE INPUT RESET */
function resetInputSafely() {
  input.value = "";
  requestAnimationFrame(() => {
    input.focus();
    input.setSelectionRange(0, 0);
  });
}

function startGame() {
  const keys = Object.keys(data);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const activeLang = lang === "rm" ? getRandomLanguage() : lang;
  const text = data[randomKey][activeLang];

  words = text.split(" ");
  currentWord = 0;
  display.innerHTML = "";

  words.forEach(word => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.className = "word";
    display.appendChild(span);
  });

  resetInputSafely();
}

/* 🔧 FIXED INPUT HANDLER */
input.addEventListener("input", () => {
  let typed = input.value;
  const target = words[currentWord];
  const wordSpan = display.children[currentWord];

  /* ✅ SPACE DETECTED (works on mobile + PC) */
  if (typed.endsWith(" ")) {
    typed = typed.trim();
    input.value = typed;

    if (typed === target) {
      wordSpan.className = "word-flash";
      setTimeout(() => {
        wordSpan.className = "word-correct";
      }, 1000);

      currentWord++;
      resetInputSafely();

      if (currentWord === words.length) {
        finishParagraph();
      }
    } else {
      wordSpan.className = "word-error";
      setTimeout(() => {
        wordSpan.className = "word";
      }, 3000);
      resetInputSafely();
    }
    return;
  }

  /* letter-by-letter coloring (unchanged) */
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

      currentWord++;
      resetInputSafely();

      if (currentWord === words.length) {
        finishParagraph();
      }
    } else {
      wordSpan.className = "word-error";
      setTimeout(() => {
        wordSpan.className = "word";
      }, 3000);
      resetInputSafely();
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
