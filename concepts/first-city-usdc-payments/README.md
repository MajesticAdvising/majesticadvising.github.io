# First City USDC Payments v0.1

**Concept demo** of how an Oklahoma municipal government (name held in confidence) could accept USDC payments. The city's bank converts them to dollars.

It is **not** a wallet, a payment system, or a live feed. It never connects to mainnet and never moves funds.

Every payment in the ledger is **sample data**. The public figures are real and cited in the page's Sources section. The city's own budget is not shown, so the city's name stays out.

## Ground rules

- The city accepts USDC payments, and a bank converts them to dollars.
- The city's funds always move through a bank. The bank is unnamed: the city's bank.
- Majestic Advising never moves, holds or converts funds, and never holds or controls keys.
- USDC is not a bank deposit and is not FDIC insured.
- Concept only. Nothing is signed, and no agency has endorsed it.
- As of Oct 2026, based on public sources, no U.S. city we could find accepts USDC payments yet. That line is never an absolute claim.

## Architecture

```
   DEMO DATA block  (<script id="demo-data">)
         │  constants, real figures, sample templates
         ▼
   DEMO APP block   (<script id="demo-app">)
         │  build sample transaction → validate → add to ledger
         ▼
   Page             flow animation, ledger table, category bars, sources
         │
         ▼  (optional, button only)
   Solana Devnet    getGenesisHash → getTokenSupply (read only)
```

One HTML file. No build step, no libraries, no network needed. The MA monogram is embedded as base64.

## Files

```
index.html    this demo (open this)
README.md     this note
```

## Run

Double click `index.html`, or:

```bash
open index.html
```

On the public site the page is `concepts/first-city-usdc-payments/`.

## Where to change things

All data and settings live in `<script id="demo-data">`. Nothing in `demo-app` needs editing.

| Constant | What it controls |
|---|---|
| `HEADLINE_FIGURES` | the four cited numbers (not the city's budget) |
| `SOURCES` | Sources list; keys are referenced as "Source N" |
| `SAMPLE_TEMPLATES` | sample payments: kind, from, category, note, USD range |
| `CATEGORIES`, `KINDS` | filter pills and type dropdown |
| `TICK_MS`, `STATUS_STEP_MS`, `MAX_LEDGER_ROWS` | ledger speed and length |
| `DEFAULT_DEVNET_RPC_URL`, `SOLANA_DEVNET_USDC_MINT` | the optional devnet check |

Money is integer minor units, same as majestic-usdc: whole USD for cited figures, **micro USDC** (6 decimals) for sample payments. `1_000_000` micro USDC = 1 USDC = $1.00 in this sample.

## Devnet check

Read only. Same rules as `crates/solana-adapter/src/config.rs`:

- `validateRpcUrl` rejects empty and mainnet URLs.
- `identifyCluster` fails closed unless the genesis hash is Devnet.
- `requireUsdcDecimals` checks the Circle Devnet USDC mint has 6 decimals.

Offline, the check prints an error and the rest of the page keeps working.

## Privacy

Payers are `Resident 0001` and `Business 0042` style IDs. No named person or firm is shown. The city would keep any real ID list private. The city itself is not named.

## Sample data rules

- Signatures and wallet addresses start with `DEMO`. `O` is not base58, and the address body also contains `0`, so they can never match a real account or transaction. Explorer links use the real devnet URL format and will show "not found."
- `validateTransaction` refuses a sample with a non DEMO signature, a non DEMO address, a non positive amount, or an unknown kind.
- Opening rows are seeded (`rngState = 42`) so every run looks the same at first.

## Known limitations

- City budget figures from the research file are left off this public page. The sources for those figures name the city.
- Category bars add up sample payments only. They are not the city's books.
- The "no U.S. city we could find" line is a review of public sources as of Oct 2026. It is not a claim that no city anywhere accepts USDC payments.
- Which bank would convert USDC to dollars is open. This page does not pick one.
