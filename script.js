const params = new URLSearchParams(window.location.search);
const lang = params.get("lang");
const language = document.getElementById("language");

const display = document.getElementById("textDisplay");
const input = document.getElementById("userInput");
const nextBtn = document.getElementById("next"); // 👈 NEW

let words = [];
let currentWord = 0;
let data = null;
let currentKeyIndex = 0;
let validKeys = [];

/* 🔒 PREVENT MOBILE KEYBOARD ISSUES */
input.setAttribute("autocapitalize", "none");
input.setAttribute("autocomplete", "off");
input.setAttribute("autocorrect", "off");
input.setAttribute("spellcheck", "false");

function updateLanguageLabel(activeLang) {
  const map = {
    en: { label: "English", flag: "🇬🇧" },
    pt: { label: "Português", flag: "🇧🇷" },
    it: { label: "Italiano", flag: "🇮🇹" },
    fr: { label: "Français", flag: "🇫🇷" },
    de: { label: "Deutsch", flag: "🇩🇪" }
  };

  const langData = map[activeLang];

  if (!langData) {
    language.innerHTML = `<hp>${activeLang}</hp>`;
    return;
  }

  language.innerHTML = `
    <hp>
      ${langData.flag} ${langData.label}
    </hp>
  `;
}



/* FETCH DATA */
fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    prepareKeys();
    startGame();
  });

/* =========================
   KEY PREPARATION
========================= */

function prepareKeys() {
  const keys = Object.keys(data);

  if (lang === "rm") {
    validKeys = keys;
  } else {
    validKeys = keys.filter(k => data[k][lang]);
  }

  currentKeyIndex = Math.floor(Math.random() * validKeys.length);
}

/* =========================
   LANGUAGE RESOLUTION
========================= */

function resolveLanguageForKey(key) {
  const availableLangs = Object.keys(data[key]);

  if (lang === "rm") {
    return availableLangs[Math.floor(Math.random() * availableLangs.length)];
  }

  return data[key][lang] ? lang : null;
}

/* =========================
   SAFE INPUT RESET
========================= */

function resetInputSafely() {
  input.value = "";
  requestAnimationFrame(() => {
    input.focus();
    input.setSelectionRange(0, 0);
  });
}

/* =========================
   🔥 ACTIVE WORD HIGHLIGHT
========================= */

function updateActiveWord() {
  [...display.children].forEach((span, index) => {
    span.classList.toggle("word-active", index === currentWord);
  });
}

/* =========================
   START GAME
========================= */

function startGame() {
  if (!validKeys.length) return;

  const key = validKeys[currentKeyIndex];
  const activeLang = resolveLanguageForKey(key);

  if (!activeLang) {
    goNext();
    return;
  }

  // ✅ UPDATE UI LANGUAGE LABEL
  updateLanguageLabel(activeLang);

  const text = data[key][activeLang];

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
  updateActiveWord();
}


/* =========================
   INPUT HANDLING
========================= */

input.addEventListener("input", () => {
  let typed = input.value;
  const target = words[currentWord];
  const wordSpan = display.children[currentWord];

  if (typed.endsWith(" ")) {
    typed = typed.trim();
    input.value = typed;

    if (typed === target) {
      wordSpan.className = "word-flash";
      setTimeout(() => wordSpan.className = "word-correct", 1000);

      currentWord++;
      updateActiveWord(); // ✅ move highlight
      resetInputSafely();

      if (currentWord === words.length) {
        finishParagraph();
      }
    } else {
      wordSpan.className = "word-error";
      setTimeout(() => wordSpan.className = "word", 3000);
      resetInputSafely();
    }
    return;
  }

  wordSpan.innerHTML = "";

  for (let i = 0; i < target.length; i++) {
    const span = document.createElement("span");
    span.textContent = target[i];

    if (typed[i] === undefined) span.className = "";
    else if (typed[i] === target[i]) span.className = "correct-letter";
    else span.className = "wrong-letter";

    wordSpan.appendChild(span);
  }

  wordSpan.appendChild(document.createTextNode(" "));
});

/* =========================
   PARAGRAPH FINISH
========================= */

function finishParagraph() {
  [...display.children].forEach(w => w.style.color = "green");

  setTimeout(() => {
    goNext();
  }, 3000);
}

/* =========================
   NEXT PARAGRAPH BUTTON
========================= */

function goNext() {
  currentKeyIndex++;

  if (currentKeyIndex >= validKeys.length) {
    currentKeyIndex = 0;
  }

  startGame();
}

/* 👇 BUTTON HANDLER */
if (nextBtn) {
  nextBtn.addEventListener("click", goNext);
}

/* =========================
   BACK
========================= */

function goBack() {
  window.location.href = "index.html";
}
