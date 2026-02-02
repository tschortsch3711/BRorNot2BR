const RESULTS = [
  {
    min: 0,
    max: 34,
    title: "Geh wählen.",
    description:
      "Aktuell klemmt es noch an ein paar Stellen – total normal. "
      + "Mit einem kleinen Push wird’s machbar.",
    tips: [
      "Einen Mini-Slot blocken (10 Minuten reichen oft).",
      "Ort und Zeit checken – dann wird’s konkret.",
      "Eine Person fragen, die Bescheid weiß: kurz, konkret, ohne Druck.",
    ],
  },
  {
    min: 35,
    max: 69,
    title: "Geh wählen.",
    description:
      "Du bist nah dran. Ein kleiner Reminder oder eine Info reicht meist, "
      + "damit es klappt.",
    tips: [
      "Termin blocken und eine Erinnerung setzen.",
      "Kurz klären, ob Briefwahl möglich ist.",
      "Mit 1 Kolleg:in absprechen: gemeinsam hingehen oder erinnern.",
    ],
  },
  {
    min: 70,
    max: 100,
    title: "Geh wählen.",
    description:
      "Du bist im Wahlmodus. Mach es dir nur noch leicht und setz den Haken.",
    tips: [
      "Wahl-Info griffbereit legen (Ort/Zeit).",
      "Kurz an den Wahltag denken: dauert oft kürzer als die Kaffeeschlange.",
      "1–2 Leute freundlich erinnern, falls sie unsicher sind.",
    ],
  },
];

const ALWAYS_REASONS = [
  "Nichtwählen heißt: andere entscheiden lassen.",
  "Der Aufwand ist klein – die Wirkung kann groß sein (Signal & Legitimation).",
  "Wenn du eine Stimme hast, ist Nichtnutzen fast immer die schlechtere Option.",
];

const ALWAYS_WHY_NOT = [
  "Du gibst Einfluss ab, obwohl du ihn kostenlos hättest.",
  "Geringere Beteiligung schwächt Aussagekraft und Signal im Unternehmen.",
];

const TAG_LABELS = {
  zeit: "Zeit ist heute dein Endgegner.",
  info: "Info ist dein fehlendes Puzzleteil.",
  wirkung: "Wirkung steht auf deiner Wunschliste.",
  vertrauen: "Vertrauen ist gerade auf Standby.",
  bequemlichkeit: "Bequemlichkeit ist ein kuscheliges Sofa.",
  gemeinschaft: "Gemeinschaft ist dein Booster.",
  verantwortung: "Verantwortung klopft freundlich an.",
  zynismus: "Zynismus hat dir den Kaffee geklaut.",
};

const TAG_HINTS = {
  zeit: {
    positive: "Mini-Slot blocken, dann erledigt sich der Rest fast von allein.",
    negative: "Plane 10 Minuten ein – kürzer als die nächste Kaffeepause.",
  },
  info: {
    positive: "Mit einem kurzen Faktencheck bleibst du souverän.",
    negative: "Ein kurzer Blick auf Ort/Zeit reicht oft schon.",
  },
  wirkung: {
    positive: "Dein Signal zählt – besonders, wenn viele mitziehen.",
    negative: "Beteiligung ist sichtbar: Viele Stimmen = mehr Wirkung.",
  },
  vertrauen: {
    positive: "Stabiles Vertrauen macht den Haken auf dem Stimmzettel leicht.",
    negative: "Wirkung ist manchmal leise – aber sie ist da.",
  },
  bequemlichkeit: {
    positive: "Mach’s dir leicht: Termin setzen und abhaken.",
    negative: "Mach’s dir leicht: Kalender + kurzer Weg, fertig.",
  },
  gemeinschaft: {
    positive: "Zu zweit hingehen, zu dritt erinnern – Team hilft.",
    negative: "Gemeinsam ist’s leichter: eine Person mitnehmen.",
  },
  verantwortung: {
    positive: "Kurz investieren, langfristig ruhiger schlafen.",
    negative: "Einmal hingehen = Verantwortung souverän erledigt.",
  },
  zynismus: {
    positive: "Ein bisschen Pragmatismus schlägt Dauer-Zynismus.",
    negative: "Zynismus parkt dich – ein kleiner Schritt bringt dich voran.",
  },
};

const TAG_SHARE_LINES = {
  zeit: "Bei mir war’s am Ende eine Sache von zehn Minuten.",
  info: "Ein kurzer Info-Check hat’s easy gemacht.",
  wirkung: "Mir war wichtig, dass meine Stimme Wirkung zeigt.",
  vertrauen: "Ich vertraue darauf, dass Beteiligung etwas verändert.",
  bequemlichkeit: "Ich hab’s mir leicht gemacht: Termin rein, erledigt.",
  gemeinschaft: "Gemeinsam gehen macht’s einfacher.",
  verantwortung: "Ich wollte’s mir später nicht vorwerfen.",
  zynismus: "Ein bisschen Pragmatismus war stärker als mein Zynismus.",
};
