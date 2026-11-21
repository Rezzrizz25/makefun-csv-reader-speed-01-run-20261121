# Submit status — csv-reader-speed-01-run-20261121

**Status: PREPARED — awaiting Rija's review. DO NOT SUBMIT yet.**

- Bounty: "Read broken CSV files faster, 21 November 2026" (`csv-reader-speed-01-run-20261121`)
- Prize: $100 total (10 places × $10 USDC)
- Deadline (entries close): Mon 23 Nov 2026 10:42 +08 (2026-11-23T02:42:00Z)
- Result due: 2026-12-08T02:42:00Z
- Repo: https://github.com/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121 (public)
- Commit: `cc413b993ea26c3727b0836e6a5f9c7b5620c960` (branch `main` — the
  code commit; this status file was committed on top of it, code identical)
- **Submit candidate:** the latest HEAD (this status file is committed on top
  of the code commit; submit the latest HEAD)
- Entry: `solve.js` (fast drop-in for csv-reader 1.0.0) + `main.ts`, MIT LICENSE
  (SPDX-License-Identifier: MIT), README with 3 live make.fun badges +
  referral https://make.fun/r/v4m1pbv2, `.makefun/owner.json` (agent wallet
  87cXnmH3V6zZPosrtrFVKB7qZyPDw2nAr8teDrbjuP3M)

## Verification (local, practice set from drand round 34140941)

- Kit scorer: **passed 1, 6/6 cases** (`grade-local --driver process`,
  result_sha256 `05939409e1088e565463dfd494215e2788869dd942217a4ad9641fadde658086`,
  L1 regrade reproduced byte for byte)
- Outputs byte-identical to the house baseline's `main.ts` on all 6 cases
- Determinism: two runs byte-identical
- Differential fuzz vs the reference reader: 20,100 random/edge-case inputs,
  **0 mismatches**
- `check` (with bundle, at the code commit): **15 passed, 0 failed**
  (license_osi, thinking_in_window, thinking_priced, thinking_reproduces
  78.8% authored, transcripts_run_record all pass)
- Benchmark (practice set, 6 cases, ~10.2M chars; `run()` CPU, 5 alternating
  passes): baseline avg 695 ms, this entry avg 133 ms → **5.2× faster**
  (full `main.ts` wall: ~1.9–2.5 s vs baseline ~4.4–4.8 s; the rest is the
  JSON parse/stringify both share)

## Transcript bundle — MADE centrally by the parent (2026-11-21 ~15:48 +08)

The builder's own `bundle` call was refused (run record not whole: the
builder session opens with a hand-off brief, not Rija's words). The parent
bundled centrally with `--prompt-file` (the watch schedule's configured
prompt) + `--prompt-origin scheduled` + `--prompt-via "makefun-new-bounty-watch cron, every 2h"`
+ `--muse-usage` (1 priced usage row exported from muse.db after the session
completed: 8,555,414 in / 57,944 out, ipnext/avocado-5.17-v2)
+ `--no-discover --session <builder session file> --no-family --provider ipnext`,
using ONLY the builder's own session file. The parent session was NOT bundled
(it contains live API keys).

- **Bundle:** `transcripts.tar.gz` in this directory — 218,485 bytes,
  sha256 `9ecf563662985bda453424123674a1f29f510eed0bbdcfde62cb05033f210bd4`
- **Leak check:** clean — no `sk-`/`v1-`/token strings (only the literal
  phrase "sk-or-v1-" inside the task-prompt text in the manifest)
- **Kit check with this bundle:** 15 passed, 0 failed, 5 skipped

Kit: `~/workspace/makefun-csv-reader-speed-01-run-20261121-kit/csv-reader-speed-01-run-20261121-kit`
(also downloaded fresh from https://make.fun/c/csv-reader-speed-01-run-20261121/kit)

## To submit (after Rija's review)

`node cli/makefun.mjs submit --competition csv-reader-speed-01-run-20261121 --repo-url https://github.com/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121 --commit <latest HEAD> --title "Fast csv-reader drop-in" --bundle <transcripts.tar.gz> --keypair ~/.solana/agent-wallet.json`
(run from inside the unpacked kit; the keypair signs the entry message.
No submit/sign command has been run.)
