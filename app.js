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

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

const startBtn = document.getElementById("start-btn");
const whyBtn = document.getElementById("why-btn");
const disclaimerBtn = document.getElementById("disclaimer-btn");
const backBtn = document.getElementById("back-btn");
const resetBtn = document.getElementById("reset-btn");
const restartBtn = document.getElementById("restart-btn");
const shareBtn = document.getElementById("share-btn");

const scaleButtons = Array.from(document.querySelectorAll(".scale__btn"));

const totalQuestions = QUESTIONS.length;

const openSection = (section) => {
  [startScreen, questionScreen, resultScreen].forEach((screen) => {
    screen.classList.toggle("hidden", screen !== section);
  });
};

const normalizeAnswer = (value, reverse) => {
  const normalized = value - 2;
  return reverse ? -normalized : normalized;
};

const calcScore = () => {
  let total = 0;
  let totalMax = 0;
  const categoryTotals = {};
  const categoryMax = {};

  QUESTIONS.forEach((question) => {
    const answer = state.answers[question.id];
    if (!answer) {
      return;
    }
    const value = normalizeAnswer(answer, question.reverseScoring);
    const weighted = value * question.weight;
    total += weighted;
    totalMax += 1 * question.weight;

    if (!categoryTotals[question.category]) {
      categoryTotals[question.category] = 0;
      categoryMax[question.category] = 0;
    }
    categoryTotals[question.category] += weighted;
    categoryMax[question.category] += 1 * question.weight;
  });

  const score = Math.round(((total + totalMax) / (2 * totalMax)) * 100);
  return {
    score: Number.isFinite(score) ? score : 0,
    categoryTotals,
    categoryMax,
  };
};

const buildTopFactors = (categoryTotals, categoryMax) => {
  const factors = Object.keys(categoryTotals).map((key) => {
    const ratio = categoryMax[key] ? categoryTotals[key] / categoryMax[key] : 0;
    return {
      key,
      ratio,
      label: CATEGORY_LABELS[key] || key,
      hint: FACTOR_HINTS[key] || "",
    };
  });

  factors.sort((a, b) => Math.abs(b.ratio) - Math.abs(a.ratio));
  return factors.slice(0, 3);
};

const renderQuestion = () => {
  const question = QUESTIONS[state.currentIndex];
  if (!question) {
    return;
  }
  questionTitle.textContent = `Frage ${state.currentIndex + 1}`;
  questionText.textContent = question.text;
  const progress = ((state.currentIndex + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `Frage ${state.currentIndex + 1} von ${totalQuestions}`;
};

const handleAnswer = (value) => {
  const question = QUESTIONS[state.currentIndex];
  state.answers[question.id] = Number(value);

  if (state.currentIndex < totalQuestions - 1) {
    state.currentIndex += 1;
    renderQuestion();
  } else {
    renderResult();
  }
};

const renderResult = () => {
  const { score, categoryTotals, categoryMax } = calcScore();
  const result = RESULTS.find((entry) => score >= entry.min && score <= entry.max);
  scoreValue.textContent = score;
  resultText.innerHTML = `
    <h3>${result.title}</h3>
    <p>${result.description}</p>
  `;

  nextSteps.innerHTML = "";
  result.tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    nextSteps.appendChild(li);
  });

  topFactors.innerHTML = "";
  const factors = buildTopFactors(categoryTotals, categoryMax);
  factors.forEach((factor) => {
    const li = document.createElement("li");
    const direction = factor.ratio >= 0 ? "Treiber" : "Bremse";
    li.textContent = `${factor.label}: ${direction}. ${factor.hint}`;
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
  const text = "BRorNot2BR: 60 Sekunden Wahl-Check. Ganz ohne Daten, nur im Browser.";
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

scaleButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    handleAnswer(event.currentTarget.dataset.value);
  });
});

backBtn.addEventListener("click", () => {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion();
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
