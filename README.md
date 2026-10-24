# ことばのむら

A tiny Pokémon-style Japanese village for beginners: walk around, talk to people, answer in Japanese, earn badges. The Japanese
sister of [단어 마을](https://github.com/Stan-Stani/daneo-maul), on the same shared walk engine.

- People with **!** teach new words through quizzes; each word is a badge. Words come back for review as a **?** when they're due
  (spaced repetition); getting one right first time earns its ★.
- **Tap any word** for its reading, a simple Japanese explanation in hiragana, and the English behind **?**. Every line has its
  English behind the **?** in the dialogue box too.
- **ふりがな** over every kanji (on by default; START menu to turn it off). No romaji, as in most beginner courses.
- Chapter 1 · えきと カフェ: こんにちは · ありがとう · すみません · 水 · お茶 · ごはん · すし · ください · おいしい · いくら.

## Files
- `src/chapters/cN.js` — the chapters. `src/game.js` — this game's settings: the engine's UI text in Japanese, the Japanese voice,
  furigana and word spans. `src/village.js`, `src/kit.js` — 단어 마을's art and chapter kit. `src/engine.js` is GENERATED from
  walk-engine; never edit it here.
- `build.py` writes `index.html`. It splits every Japanese line into words with MeCab (`pip install fugashi unidic-lite`) and
  reports words with no definition (`lexicon/missing.txt`) and lines with no English (`src/lines-todo.json`).
- `lexicon/defs.json` — the learner dictionary (`r` reading, `k` simple Japanese, `e` English); a chapter's own words are in its
  `DICT`. `lexicon/fixes.json` — words MeCab splits or reads wrong for a learner (`join`, `form`, `read`).
- `src/lines-en.json` — each line in English, keyed by the line.
- Checks: `node tests/validate.mjs`, `node tests/play.mjs c1` (plays `tests/walk/c1.js` in headless Chrome).
