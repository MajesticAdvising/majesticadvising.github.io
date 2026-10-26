# RT Park Public Funds Dashboard v0.2

**Concept demo** of how the UVI Research and Technology Park could show its public funds moving in USDC on Solana.

It is **not** a wallet, a payment system, or a live feed. It never connects to mainnet and never moves funds.

Every payment in the ledger is **sample data**. The budget figures are real and cited in the page's Sources section.

## Ground rules

- Funds always move through a bank. RT Park's bank authorizes every transaction; Circle signs it on the bank's instruction.
- Majestic Advising never holds funds or keys.
- USDC is not a bank deposit and is not FDIC insured.
- Concept only. RT Park has not agreed to any part of it.

## Architecture

```
   DEMO DATA block  (<script id="demo-data">)
         │  constants, real figures, sample templates
         ▼
   DEMO APP block   (<script id="demo-app">)
         │  build sample transaction → validate → add to ledger
         ▼
   Page             flow animation, ledger table, budget bars, sources
         │
         ▼  (optional, button only)
   Solana Devnet    getGenesisHash → getTokenSupply (read only)
```

One HTML file. No build step, no libraries, no network needed. The MA monogram is embedded as base64.

## Files

```
rtpark-transparency-demo-v2.html   current demo (open this)
rtpark-transparency-demo-v1.html   first pass (kept, not overwritten)
preview-v2.png                     full page screenshot, 1440px wide
src/template.html                  v1 source with {{LOGO_BASE64}} placeholder
sources/                           hearing PDFs the figures came from
sketches/                          Ryan's Keynote sketches, unzipped
```

## Run

Double click `rtpark-transparency-demo-v2.html`, or:

```bash
open rtpark-transparency-demo-v2.html
```

## Where to change things

All data and settings live in `<script id="demo-data">`. Nothing in `demo-app` needs editing.

| Constant | What it controls |
|---|---|
| `HEADLINE_FIGURES` | the four big numbers (whole USD) |
| `COST_CENTERS`, `COST_CENTER_TOTALS` | spending bars (whole USD, from the testimony appendix) |
| `SALARY_BUDGET` | salary budget vs. paid line under the bars |
| `FY2026_ELAPSED_PCT` | position of the white pace line |
| `SOURCES` | Sources list; keys are referenced as "Source N" |
| `SAMPLE_TEMPLATES` | sample payments: kind, from, to, program, note, USD range, flow path |
| `PROGRAMS`, `KINDS` | filter pills and type dropdown |
| `TICK_MS`, `STATUS_STEP_MS`, `MAX_LEDGER_ROWS` | ledger speed and length |
| `DEFAULT_DEVNET_RPC_URL`, `SOLANA_DEVNET_USDC_MINT` | the optional devnet check |

Money is integer minor units, same as majestic-usdc: whole USD for cited figures, **micro-USDC** (6 decimals) for sample payments. `1_000_000` micro-USDC = 1 USDC = $1.00.

## Devnet check

Read only. Same rules as `crates/solana-adapter/src/config.rs`:

- `validateRpcUrl` rejects empty and mainnet URLs.
- `identifyCluster` fails closed unless the genesis hash is Devnet.
- `requireUsdcDecimals` checks the Circle Devnet USDC mint has 6 decimals.

Offline, the check prints an error and the rest of the page keeps working.

## Privacy

Workers are `Employee 001` style IDs; vendors and borrowers are numbered. No named person's pay is posted. RT Park would keep the ID list private.

## Sample data rules

- Signatures start with `DEMO`. `O` is not base58, so they can never match a real transaction. Explorer links use the real devnet URL format and will show "not found."
- `validateTransaction` refuses a sample with a non DEMO signature, a non positive amount, or an unknown kind.
- Opening rows are seeded (`rngState = 42`) so every run looks the same at first.

## Known limitations

- RT Park's FY 2026 budget by category was not in the hearing documents. Bars compare FY 2026 spending through May 31 against FY 2025 full year spending.
- In the testimony appendix, Marketing FY 2025 ($313,026) equals the FY 2026 figure of the cost center above it. Possible typo in the source; shown as printed.
- Capital projects and Workforce preparedness show "none yet" because the source reported nothing for FY 2026.
- GVI Open Finance (transparency.vi.gov) does not break out RT Park spending; RT Park is self funded.
