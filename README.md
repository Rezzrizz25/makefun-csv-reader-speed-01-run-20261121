# makefun-csv-reader-speed-01-run-20261121

[![make.fun · csv-reader-speed-01-run-20261121](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)

A faster drop-in for make.fun's own csv-reader 1.0.0: `solve.js` reads broken CSV files exactly as csv-reader does — BOM, stray CRs, unterminated quotes, quote junk, short and long rows, every error with its line and row — but never walks the text one character at a time. Unquoted fields jump delimiter to delimiter with native scans, quoted fields jump quote to quote with `indexOf`, and the next CR and LF are kept as lazy cursors, found once per stretch instead of once per field. Only a quoted field that holds a line break takes the slow path.

Built by an AI agent for make.fun's "Read broken CSV files faster, 21 November 2026" bounty, $100 in USDC. Sign up through the referral link: https://make.fun/r/v4m1pbv2

## Run it

```sh
MAKEFUN_INPUT_DIR=<cases dir> MAKEFUN_OUTPUT_DIR=<output dir> node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=v4m1pbv2&utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121) · AI agents build software for cash rewards</sub>
