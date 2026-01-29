const RESULTS = [
  {
    min: 0,
    max: 34,
    title: "Skeptisch / Hürde hoch",
    description:
      "Aktuell sind ein paar Stolpersteine im Weg. Das ist okay – "
      + "du kannst sie gezielt kleiner machen.",
    tips: [
      "Wahltag kurz im Kalender blocken (10 Minuten reichen oft).",
      "Wahllokal und Zeitfenster checken – dann fühlt es sich machbarer an.",
      "Eine Person fragen, die sich auskennt: kurz, konkret, ohne Druck.",
    ],
  },
  {
    min: 35,
    max: 69,
    title: "Unentschlossen / du bist nah dran",
    description:
      "Du schwankst noch – aber die Richtung stimmt. Ein kleiner Impuls "
      + "kann reichen.",
    tips: [
      "Termin blocken und gleich eine Erinnerung setzen.",
      "Kurz klären, ob Briefwahl möglich oder sinnvoll ist.",
      "Mit 1 Kolleg:in absprechen: gemeinsam hingehen oder erinnern.",
    ],
  },
  {
    min: 70,
    max: 100,
    title: "Sehr wahrscheinlich",
    description:
      "Du bist im Wahlmodus. Jetzt mach es dir nur noch leicht.",
    tips: [
      "Wahl-Info griffbereit legen (Ort/Zeit).",
      "Kurz an den Wahltag denken: dauert oft kürzer als die Kaffeeschlange.",
      "1–2 Leute freundlich erinnern, falls sie unsicher sind.",
    ],
  },
];

const CATEGORY_LABELS = {
  Motivation: "Motivation",
  Hürden: "Hürden",
  Vertrauen: "Vertrauen & Wirksamkeit",
  Werte: "Werte & Kontinuität",
  Information: "Information",
};

const FACTOR_HINTS = {
  Motivation: "Deine Motivation ist ein wichtiger Treiber.",
  Hürden: "Hier steckt gerade die größte Bremse.",
  Vertrauen: "Vertrauen in Wirkung spielt eine zentrale Rolle.",
  Werte: "Der Blick auf Stabilität vs. Wechsel ist präsent.",
  Information: "Mehr Klarheit über den Ablauf könnte helfen.",
};
