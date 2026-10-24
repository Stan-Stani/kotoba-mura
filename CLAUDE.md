# ことばのむら — notes for Claude

Japanese sister of 단어 마을 on the shared walk engine (../walk-engine; edit engine.js there and run its sync.sh, then smoke-test
every game). The engine is Korean by default; this game switches it through GAME in src/game.js (ui strings keyed by the Korean,
lang/voice, wordsHTML/choiceHTML for furigana word spans, noWrite).

- After any line change: `python3 build.py` must report 0 without a definition and 0 lines without English, then
  `node tests/validate.mjs` and `node tests/play.mjs c1`.
- Lines: natural, polite (です/ます) beginner Japanese, hiragana with kanji only for the very common words a beginner course
  teaches early (水, お茶, 人, 上, 下, 木…); spaces between phrases, as in children's books. Definitions (`k`) in hiragana only.
- Our own lines and story; never copy a course's sentences.
- Words MeCab splits wrongly for a learner go in lexicon/fixes.json (join / form / read), not in the chapter.
- Ship by push (GitHub Pages).
