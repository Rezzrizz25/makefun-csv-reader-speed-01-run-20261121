# Submit status — csv-reader-speed-01-run-20261121

**Status: PREPARED — awaiting Rija's review. DO NOT SUBMIT yet.**

- Bounty: "Read broken CSV files faster, 21 November 2026" (`csv-reader-speed-01-run-20261121`)
- Prize: $100 total (10 places × $10 USDC)
- Deadline (entries close): Mon 23 Nov 2026 10:42 +08 (2026-11-23T02:42:00Z)
- Result due: 2026-12-08T02:42:00Z
- Repo: https://github.com/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121 (public)
- Commit: `73378abf71d64139a49e9ca9639cba0f9bdc5937` (branch `main`)
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
- `check`: 5 passed, 0 failed (license_osi fixed with the SPDX line)
- Benchmark (practice set, 6 cases, ~10.2M chars; `run()` CPU, 5 alternating
  passes): baseline avg 695 ms, this entry avg 133 ms → **5.2× faster**
  (full `main.ts` wall: ~1.9–2.5 s vs baseline ~4.4–4.8 s; the rest is the
  JSON parse/stringify both share)

## Transcript bundle — NOT YET MADE (needs the parent agent)

No bundle file exists. The kit's `bundle` refused to write one in this
builder session (exit 2), exact text:

> makefun bundle: the run record is not whole, so no bundle was written
> (bundle --dry-run prints the record as it stands):
>   the prompt: the earliest session,
>   sessions/muse-app/b48ea197-1f5d-4ce0-b599-3368f8064774.jsonl, opens with
>   no message of the person's in words

The builder session opens with a hand-off brief, not Rija's own words, and
its parent session was NOT bundled (it contains live API keys). The parent
agent will attempt bundling centrally after this session completes, when the
usage rows exist (muse.db currently holds 0 usage rows for this session;
a subagent's row is written only once its run completes). Bundle command
used (from the unpacked kit):

`node cli/makefun.mjs bundle --repo ~/workspace/makefun-csv-reader-speed-01-run-20261121 --out <file> --no-discover --session ~/agents/agent-b48ea197-1f5d-4ce0-b599-3368f8064774/sessions/b48ea197-1f5d-4ce0-b599-3368f8064774.jsonl --no-family --provider meta --model muse-spark-1.3 --effort default --mcp none`

Kit: `~/workspace/makefun-csv-reader-speed-01-run-20261121-kit/csv-reader-speed-01-run-20261121-kit`
(also downloaded fresh from https://make.fun/c/csv-reader-speed-01-run-20261121/kit)

## To submit (after Rija's review)

`node cli/makefun.mjs submit --competition csv-reader-speed-01-run-20261121 --repo-url https://github.com/Rezzrizz25/makefun-csv-reader-speed-01-run-20261121 --commit 73378abf71d64139a49e9ca9639cba0f9bdc5937 --title "Fast csv-reader drop-in" --bundle <transcripts.tar.gz> --keypair ~/.solana/agent-wallet.json`
(run from inside the unpacked kit; the keypair signs the entry message.
No submit/sign command has been run.)
