const state = {
  currentIndex: 0,
  answers: {},
  lastFocus: null,
};


const startScreen = document.getElementById("start-screen");
const questionScreen = document.getElementById("question-screen");
const resultScreen = document.getElementById("result-screen");
const questionTitle = document.getElementById("question-title");
const questionText = document.getElementById("question-text");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const scoreValue = document.getElementById("score-value");
const resultText = document.getElementById("result-text");
const topFactors = document.getElementById("top-factors");
const nextSteps = document.getElementById("next-steps");
const answerOptionsEl = document.getElementById("answer-options");
const answerComebackEl = document.getElementById("answer-comeback");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

const startBtn = document.getElementById("start-btn");
const whyBtn = document.getElementById("why-btn");
const disclaimerBtn = document.getElementById("disclaimer-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
const shareBtn = document.getElementById("share-btn");

const totalQuestions = QUESTIONS.length;
let pendingAdvance = null;

const openSection = (section) => {
  [startScreen, questionScreen, resultScreen].forEach((screen) => {
    screen.classList.toggle("hidden", screen !== section);
  });
};

const calcScore = () => {
  let total = 0;
  let minTotal = 0;
  let maxTotal = 0;
  const tagTotals = {};
  const tagMax = {};

  QUESTIONS.forEach((question) => {
    const answer = state.answers[question.id];
    if (!answer) {
      return;
    }
    const scores = question.options.map((option) => option.score);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    const maxAbs = Math.max(Math.abs(minScore), Math.abs(maxScore));

    total += answer.score * question.weight;
    minTotal += minScore * question.weight;
    maxTotal += maxScore * question.weight;

    if (!tagTotals[answer.tag]) {
      tagTotals[answer.tag] = 0;
      tagMax[answer.tag] = 0;
    }
    tagTotals[answer.tag] += answer.score * question.weight;
    tagMax[answer.tag] += maxAbs * question.weight;
  });

  const score = Math.round(((total - minTotal) / (maxTotal - minTotal)) * 100);
  return {
    score: Number.isFinite(score) ? score : 0,
    tagTotals,
    tagMax,
  };
};

const buildTopFactors = (tagTotals, tagMax) => {
  const factors = Object.keys(tagTotals).map((key) => {
    const ratio = tagMax[key] ? tagTotals[key] / tagMax[key] : 0;
    const hints = TAG_HINTS[key] || {};
    return {
      key,
      ratio,
      label: TAG_LABELS[key] || key,
      hint: ratio >= 0 ? hints.positive || "" : hints.negative || "",
    };
  });

  factors.sort((a, b) => Math.abs(b.ratio) - Math.abs(a.ratio));
  return factors.slice(0, 3);
};

const clearComeback = () => {
  answerComebackEl.textContent = "";
  answerComebackEl.classList.add("hidden");
  nextBtn.disabled = true;
  pendingAdvance = null;
};

const showComeback = (text) => {
  clearComeback();
  answerComebackEl.textContent = text;
  answerComebackEl.classList.remove("hidden");
  nextBtn.disabled = false;
};

const renderQuestion = () => {
  const question = QUESTIONS[state.currentIndex];
  if (!question) {
    return;
  }
  clearComeback();
  questionTitle.textContent = `Frage ${state.currentIndex + 1}`;
  questionText.textContent = question.text;
  const progress = ((state.currentIndex + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `Frage ${state.currentIndex + 1} von ${totalQuestions}`;

  answerOptionsEl.innerHTML = "";
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "scale__btn";
    button.type = "button";
    button.textContent = option.label;
    button.addEventListener("click", () => handleAnswer(option));
    answerOptionsEl.appendChild(button);
  });
};

const handleAnswer = (option) => {
  const question = QUESTIONS[state.currentIndex];
  state.answers[question.id] = option;
  showComeback(option.comeback);

  pendingAdvance = () => {
    if (state.currentIndex < totalQuestions - 1) {
      state.currentIndex += 1;
      renderQuestion();
    } else {
      renderResult();
    }
  };
};

const renderResult = () => {
  const { score, tagTotals, tagMax } = calcScore();
  const result = RESULTS.find((entry) => score >= entry.min && score <= entry.max) || RESULTS[0];
  scoreValue.textContent = score;
  resultText.innerHTML = `
    <h3>${result.title}</h3>
    <p>${result.description}</p>
    <div class="result__block">
      <h4>Kurz &amp; fundiert</h4>
      <ul class="list">${ALWAYS_REASONS.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
    <div class="result__block">
      <h4>Warum Nichtwählen schlechter ist</h4>
      <ul class="list">${ALWAYS_WHY_NOT.map((item) => `<li>${item}</li>`).join("")}</ul>
    </div>
  `;

  nextSteps.innerHTML = "";
  result.tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    nextSteps.appendChild(li);
  });

  topFactors.innerHTML = "";
  const factors = buildTopFactors(tagTotals, tagMax);
  factors.forEach((factor) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="factor-title">${factor.label}</span>
      <span class="factor-hint">${factor.hint}</span>
    `;
    topFactors.appendChild(li);
  });

  openSection(resultScreen);
  resultScreen.scrollIntoView({ behavior: "smooth", block: "start" });
};

const resetFlow = () => {
  state.currentIndex = 0;
  state.answers = {};
  renderQuestion();
  openSection(startScreen);
};

const showModal = (title, bodyHtml) => {
  state.lastFocus = document.activeElement;
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modal.classList.remove("hidden");
  modal.removeAttribute("hidden");
  modal.setAttribute("aria-hidden", "false");
  trapFocus(modal);
};

const hideModal = () => {
  modal.classList.add("hidden");
  modal.setAttribute("hidden", "");
  modal.setAttribute("aria-hidden", "true");
  releaseFocusTrap();
  if (state.lastFocus) {
    state.lastFocus.focus();
  }
};

let focusTrapHandler = null;

const trapFocus = (container) => {
  const focusable = Array.from(
    container.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
  );
  if (!focusable.length) {
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  first.focus();

  focusTrapHandler = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      hideModal();
      return;
    }
    if (event.key !== "Tab") {
      return;
    }
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  container.addEventListener("keydown", focusTrapHandler);
};

const releaseFocusTrap = () => {
  if (focusTrapHandler) {
    modal.removeEventListener("keydown", focusTrapHandler);
    focusTrapHandler = null;
  }
};

const openWhy = () => {
  showModal(
    "Warum wählen?",
    `
    <div class="card-grid">
      <div class="info-card">
        <span class="tag">Mitbestimmung</span>
        <p>Wählen heißt: Anliegen werden sichtbar und ernst genommen.</p>
      </div>
      <div class="info-card">
        <span class="tag">Schutz & Balance</span>
        <p>Ein Betriebsrat schafft Ausgleich zwischen Alltag und Interessen.</p>
      </div>
      <div class="info-card">
        <span class="tag">Alltagsnähe</span>
        <p>Niemand kennt die Realität besser als die Mitarbeitenden selbst.</p>
      </div>
      <div class="info-card">
        <span class="tag">Signalwirkung</span>
        <p>Hohe Beteiligung zeigt: Wir interessieren uns für unseren Arbeitsplatz.</p>
      </div>
      <div class="info-card">
        <span class="tag">Gemeinschaft</span>
        <p>Gemeinsam entscheiden fühlt sich weniger einsam an.</p>
      </div>
    </div>
    <div class="info-card myth">
      <strong>Mythos:</strong> "Bringt eh nix."<br />
      <span>Realität: Ohne Beteiligung wird es eher still als besser.</span>
    </div>
    <div class="info-card myth">
      <strong>Mythos:</strong> "Andere machen das schon."<br />
      <span>Realität: Viele denken das – und dann fehlt die Stimme.</span>
    </div>
    <div class="info-card myth">
      <strong>Mythos:</strong> "Ich kenne mich nicht aus."<br />
      <span>Realität: Informiert wählen heißt nicht perfekt wissen, sondern bewusst entscheiden.</span>
    </div>
    <div class="info-card myth">
      <strong>Mythos:</strong> "Eine Stimme ist egal."<br />
      <span>Realität: Wahlbeteiligung zeigt, wie wichtig euch das Thema ist.</span>
    </div>
  `
  );
};

const openDisclaimer = () => {
  showModal(
    "Disclaimer & Datenschutz",
    `
    <div class="info-card">
      <p><strong>Keine Rechtsberatung:</strong> Dieses Tool ist eine unverbindliche Entscheidungshilfe und ersetzt keine juristische Beratung.</p>
      <p><strong>Nicht offiziell:</strong> Die Seite ist nicht von einer offiziellen Stelle betrieben.</p>
      <p><strong>Datenschutz:</strong> Es werden keinerlei Daten gespeichert, gesendet oder getrackt. Alles läuft lokal in deinem Browser.</p>
      <p><strong>Offline-freundlich:</strong> Keine externen Libraries, Fonts oder Requests.</p>
    </div>
  `
  );
};

const copyHint = async () => {
  const { tagTotals, tagMax } = calcScore();
  const factors = buildTopFactors(tagTotals, tagMax);
  const topTag = factors[0]?.key;
  const tagLine = topTag && TAG_SHARE_LINES[topTag] ? ` ${TAG_SHARE_LINES[topTag]}` : "";
  const text = `Ich geh zur BR-Wahl: dauert kurz, wirkt lang. Nichtwählen heißt Einfluss verschenken.${tagLine} Kommst du mit?`;

  try {
    await navigator.clipboard.writeText(text);
    shareBtn.textContent = "Hinweis kopiert!";
    setTimeout(() => {
      shareBtn.textContent = "Hinweis kopieren";
    }, 2000);
  } catch (error) {
    shareBtn.textContent = "Kopieren nicht möglich";
  }
};

startBtn.addEventListener("click", () => {
  openSection(questionScreen);
  renderQuestion();
});

backBtn.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", () => {
  if (pendingAdvance) {
    pendingAdvance();
  }
});

resetBtn.addEventListener("click", resetFlow);
restartBtn.addEventListener("click", () => {
  resetFlow();
  openSection(questionScreen);
  renderQuestion();
});
shareBtn.addEventListener("click", copyHint);

whyBtn.addEventListener("click", openWhy);
disclaimerBtn.addEventListener("click", openDisclaimer);
modalClose.addEventListener("click", hideModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

hideModal();
renderQuestion();
