# Application Correctness And Architecture Review

Date: 2026-09-06. Specialist scope: deterministic tools, registry/rendering, Ask/REST/MCP contracts, input validation, units, and test quality.

Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Verified `HEAD` and local `origin/main`: `90d6dcab0580a91ca66382f2414d95e8817469e5`.
This is a review, not implementation approval. Proposed tasks below remain **planned**; the coordinator owns consolidation and the Release Judge owns approval.

## Findings

### COR-01 [P1] Ask silently replaces explicit units and calculation conditions

- Locations: [askToolRouter.ts:217](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:217), [askToolRouter.ts:264](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:264), [askToolRouter.ts:142](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:142).
- Scope: `/ask/` and `/api/v1/ask`; watts-to-amps, concrete, and AI token-cost routing. The deterministic calculators themselves receive different inputs from the question.
- Trigger/evidence: in-process `answerUtilityQuestion` returned these successful parser routes:

| Exact question | Inputs/result actually returned |
| --- | --- |
| `Convert 600 watts at 120 volts three-phase power factor 0.8 to amps.` | `phase: single-phase`, `powerFactor: 1`, answer `5 amps` |
| `How much concrete for 3 by 4 meters, 10 cm deep?` | `lengthFeet: 3`, `widthFeet: 4`, `depthInches: 4`, answer `0.163 cubic yards` with 10% waste |
| `Estimate AI token cost for 1000 requests with 1000 input tokens, 500 output tokens, $2 input and $8 output per 1000 tokens.` | Rates treated as per million; answer `$6.00`, not the `$6000` implied by the supplied rates |

- Cause: watts routing hardcodes phase/PF, concrete assigns feet and a default depth without checking explicit metric units, and token pricing never validates the quoted pricing denominator. All three routes advertise `confidence: high`. The parser runs before Ollama at [askToolRouter.ts:491](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:491), so this is not confined to forced-fallback mode.
- Confidence: high, source trace plus execution. Impact: materially wrong estimates with a deterministic-tool assurance; electrical/construction mistakes are especially consequential. No production incidence or actual user harm measured.
- Minimal task: **Preserve explicit units and qualifiers in Ask routes**. Owner: API And MCP Tester with Minimal Change Engineer. Validate the complete supported unit/condition set before accepting a parser route; normalize supported units, otherwise decline or request clarification. Do not expand this into a general expression or language engine.
- Acceptance tests: assert extracted inputs, not just answer text. Cover DC/single/three phase and PF; metric/imperial/mixed/unspecified concrete dimensions; per-1K/per-1M token pricing. The electrical example must preserve three-phase/PF and equal `runApiTool` with those inputs (or explicitly decline). The metric example must convert dimensions or decline, never reinterpret them as feet. The pricing example must return $6000 or decline. Preserve warnings and input evidence in the HTTP response. Test parser-first operation with external fetch mocked and ensure ambiguous questions cannot regain a wrong parser route through fallback.

### COR-02 [P1] Ask accepts numeric substrings as complete questions

- Locations: [askToolRouter.ts:109](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:109), [askToolRouter.ts:359](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:359).
- Scope: Ask percentage/arithmetic routing, including questions meant for the date tool.
- Trigger/evidence: `What is 18% of 1,000?` returned `18% of 1 is 0.18.`; `What is 2 + 3 * 4?` returned `2 + 3 = 5.`; `How many days between 2026-05-01 and 2026-05-15?` returned `2026 - 5 = 2021.` All were successful parser responses.
- Cause: unanchored regular expressions accept a prefix of a grouped number, expression, or ISO date. The single-operator runner correctly calculates the wrong extracted operands. Lower route confidence does not prevent execution.
- Confidence: high, executed. Impact: ordinary date and arithmetic questions receive unrelated or incomplete answers instead of a supported route or a clear limitation.
- Minimal task: **Require complete, unambiguous numeric matches**. Owner: API And MCP Tester with Minimal Change Engineer. Add numeric token boundaries/grouping validation and guards against leftover operators/date syntax. Route date intent deliberately or decline; chained expressions may be rejected because the current basic runner explicitly supports only two operands.
- Acceptance tests: the three exact fixtures above; leading decimals, negative numbers, scientific notation, grouped thousands, malformed grouping, dates in both orders, and multiple calculations in one sentence. A rejected expression must not return `ok: true` for a prefix. Keep existing one-operation questions working. Test through `/api/v1/ask`, with an explicit no-network harness, including parser-first mode.

### COR-03 [P2] Month-end calendar subtraction returns negative days

- Locations: [calculator.ts:9320](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9320), [calculator.ts:9371](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:9371).
- Scope: `calculateAge`, `calculateDateDifference`, browser age/date tools, REST/MCP date-tool structured results. Browser consumers directly interpolate these fields at [UtilityCalculator.tsx:5135](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5135) and [UtilityCalculator.tsx:5182](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/UtilityCalculator.tsx:5182).
- Trigger/evidence: January 31 to March 1, 2026 returns age `0 years, 1 months, -2 days` and date difference `{days:29, calendarYears:0, calendarMonths:1, calendarDays:-2}`. The date REST handler returned HTTP 200 with this object.
- Cause: subtracting day numbers and borrowing once from February is insufficient when the start day exceeds February's length. The same faulty decomposition is duplicated in both functions.
- Confidence: high, direct execution and route execution. Impact: impossible human-readable calendar intervals despite a correct total-day count; callers using the calendar fields receive incorrect data.
- Minimal task: **Normalize shared calendar interval decomposition**. Owner: Minimal Change Engineer (calendar), reviewed by Code Reviewer. Specify the month-end convention and reuse a small date-only helper in age and difference calculations, using the existing clamped month-shift behavior where appropriate. Do not replace the entire utility module.
- Acceptance tests: Jan 29/30/31 to Feb/Mar in leap and non-leap years; Feb 29 birthdays; same-day and reversed intervals. Calendar components must be nonnegative, total days must remain correct, and adding the decomposed interval under the documented convention must reproduce the later date. Verify browser text and REST/MCP structured values. Existing tests at [calculator.test.ts:2296](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.test.ts:2296) do not assert the date-difference calendar components.

### COR-04 [P2] Non-finite calculations are reported as successful REST/MCP results

- Locations: [calculator.ts:399](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:399), [apiToolRegistry.ts:1489](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:1489), [apiHttp.ts:10](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiHttp.ts:10).
- Scope: shared runner result boundary and clients of it. Confirmed on basic arithmetic and mortgage; not claimed exhaustive across all tools.
- Trigger/evidence: REST basic tool with `{left:1e308,operator:'*',right:10}` returns HTTP 200, `ok:true`, answer `1e+308 * 10 = Error.`, and `{value:null}`. The MCP `run_tool` call returns HTTP 200 with `isError` absent/false and the same null result. A mortgage at annual rate 100000%, 30 years returns HTTP 200 and `Estimated monthly payment is $NaN...`, with monetary numeric fields serialized to null.
- Cause: input finiteness does not ensure result finiteness. Arithmetic/formulas can overflow; formatting only changes the text to `Error` or `$NaN`; `runApiTool` still returns normally and JSON serialization converts NaN/Infinity to null.
- Confidence: high, executed REST and MCP calls. Impact: clients cannot distinguish an unsupported numerical range from a completed result using the documented success/error indicators.
- Minimal task: **Reject non-finite numerical results before success serialization**. Owner: API And MCP Tester with Minimal Change Engineer. Add focused domain guards and a shared numerical-result invariant without rejecting legitimate domain-specific nulls. Keep the existing thrown-error path for REST and MCP; do not rely on searching formatted strings for `Error`.
- Acceptance tests: overflow for multiplication, percentage, and mortgage; deep/nested non-finite result fields; normal finite extremes and valid nullable outputs. REST must return an explicit non-success tool error; MCP tool result must set `isError:true`. Neither should claim success after coercing a non-finite number to null. Verify warning/URL contracts for successful calls remain unchanged.

### COR-05 [P2] Near-zero positive loan rates produce substantial negative interest

- Location: [calculator.ts:4652](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/calculator.ts:4652), especially the growth subtraction at line 4658. Input acceptance: [apiToolRegistry.ts:364](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:364); browser parser accepts finite scientific notation at [FinanceCalculator.tsx:2607](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/FinanceCalculator.tsx:2607).
- Scope: shared payment helper, loan/mortgage calculations and downstream borrowers of that helper. Near-zero rates are an edge case, not a claim that normal mortgage-rate examples are wrong.
- Trigger/evidence: `calculateLoanSummary(100000,1e-12,30)` returns monthly payment `260.62497843587596`, total paid `93824.99223691535`, total interest `-6175.00776308465`. REST mortgage with home price 125000, down payment 25000, same rate and term also succeeds with `$260.62`. At a nonnegative rate, scheduled total repayment should not be thousands below principal; the zero-rate payment is about $277.78.
- Cause: loss of precision in `(1+r)^n - 1` near zero. The exact `monthlyRate === 0` branch does not protect small positive rates. These outputs are finite, so COR-04 alone cannot fix this.
- Confidence: high, direct and REST execution. Impact: materially wrong payments and negative interest from schema-valid inputs; unusual trigger reduces frequency but not reproducibility.
- Minimal task: **Stabilize the shared annuity payment formula**. Owner: Minimal Change Engineer (finance), reviewed by Code Reviewer. Use stable logarithmic/exponential primitives or an explicitly tested near-zero treatment; retain the zero-rate branch. Review direct consumers, not every finance tool by default.
- Acceptance tests: zero and logarithmically spaced small positive rates, ordinary rates, long terms, and high supported rates. Assert continuity at zero, total repayment >= principal within a documented numerical tolerance, and agreement with an independent amortization/reference calculation. Cover loan and mortgage REST plus Canadian payment frequencies and existing APR/inverse-payment callers affected by the helper. Existing normal-rate fixtures must remain stable to their intended currency precision.

## Narrow Structural Opportunities

These are proposed follow-ups, not additional confirmed runtime failures or prerequisites for a wholesale refactor.

1. **P3: Make the OpenAPI tool-input contract consumable and test it.** [openapi.json.ts:12](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/pages/api/openapi.json.ts:12) packages schemas under per-tool `value` fields, then places the map under `components.schemas.toolInputs` at line 112. The run request at line 60 remains an unconstrained object and has no references to those tool inputs. Current route testing checks the OpenAPI version and route presence, not schema/client usability. Owner: API And MCP Tester. Minimal task: add a supported schema validator/client-consumption test and expose referenced schemas for the existing endpoints. Acceptance: a consumer can discover required mortgage inputs and rejected types from the document, and examples validate against the advertised contract. A specific external client failure or standards-validator failure was **not** tested here.
2. **P3: Preserve schema-to-runner typing locally.** [apiToolRegistry.ts:72](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiToolRegistry.ts:72) declares `run(input:any)` despite a generic schema type. Owner: Minimal Change Engineer with API And MCP Tester. Consider a small typed definition helper when next editing this registry, plus compile-time mismatch fixtures. Do not split the entire registry merely because of its size. Runtime schema checks remain valuable and should stay.

## Inspected Modules And Boundaries

| Area | Inspection and actual coverage |
| --- | --- |
| Operating docs | Root `AGENTS.md`, campaign `AGENTS.md`, `docs/ask-api-mcp-alpha.md`, and owning agent-role sections of `docs/recommended-agency-agents.md`; installed `code-review-and-quality` skill |
| Shared calculations | Selected implementations in `src/lib/calculator.ts`: number formatting/parsing, BigInt binary/decimal/hex arithmetic, loan/mortgage/auto loan, compound interest, amortization, payoff, IRR/APR, Canadian mortgage, calendar parsing/age/difference/shift, timestamp conversion, and adjacent unit-conversion boundaries; not every function |
| API registry | `src/lib/apiToolRegistry.ts`: all schema/dispatch/export boundary shapes, selected runner bodies, serialized metadata and non-privacy examples; `src/lib/hexCalculator.ts` |
| Ask | Full `src/lib/askToolRouter.ts` and `src/components/AskToolChat.tsx`; parser inputs/route order/error paths; Ollama request shape statically, not a live provider call |
| Rendering/registry | `src/data/tools.ts` interface/composition/lookup sections; registry loaded for identity checks; `src/data/blogGuideCanonicals.ts`; tool route static-path logic, finance/date mappings and component dispatch in `src/pages/tools/[slug].astro` |
| Browser calculators | `FinanceCalculator.tsx` selected finance modes/defaults, parsing, calculation cases and result/error handling; `UtilityCalculator.tsx` age/date cases and selected shared input/result handling; `BigNumberCalculator.tsx` and `BinaryCalculator.tsx` parsing/result paths |
| Tests | `src/lib/calculator.test.ts`, `src/lib/apiToolRegistry.test.ts`, `src/lib/hexCalculator.test.ts`, `tests/api/apiRoutes.test.ts`, `tests/api/mcp.test.ts`; selected source/registry assertions in `src/data/siteContentAudit.test.ts`; `package.json` test configuration and `vitest.config.ts` |

### API Entrypoint Inventory

All nine entrypoint files were inventoried; eight were read at handler/contract scope. Analytics is intentionally inventory-only because it belongs to the privacy/analytics reviewer.

| File | Methods and review extent |
| --- | --- |
| `src/pages/api/v1/tools/index.ts` | GET list/cache behavior; route tests executed |
| `src/pages/api/v1/tools/[slug].ts` | GET schema/404/cache behavior; route tests executed |
| `src/pages/api/v1/run/[slug].ts` | POST runner/errors, GET 405; route tests and targeted in-process requests executed |
| `src/pages/api/v1/ask.ts` | POST question/error boundary, GET 405; route tests executed |
| `src/pages/api/openapi.json.ts` | GET contract/cache source read and existing route test executed; no standards validator/code generation |
| `src/pages/mcp.ts` | POST transport lifecycle, GET/DELETE 405; server registrations in `src/lib/aftMcpServer.ts`; initialization/list/run tests and overflow probe executed |
| `src/pages/api/contact.ts` | POST JSON/form parsing, validation, SMTP handoff/status mapping, GET 405; static only, no email sent |
| `src/pages/api/admin/agent-tools.ts` | GET report read, POST refresh forwarding and input defaults; static only, no authenticated refresh invoked |
| `src/pages/api/analytics/events.ts` | GET/POST exports and file presence only; implementation deliberately excluded |

There are eight files under `src/pages/api` plus the separate MCP entrypoint, for nine inventory rows above. Shared `apiHttp.ts` and `aftMcpServer.ts` were read. Security/privacy policy adjudication, including authentication/rate-limit parity, remains with the security reviewer.

## Executed Verification

All execution occurred in the assigned worktree. No build/check, dependency installation, production request, mail send, API purchase, indexing submission, deployment, commit, new agent, or global-setting change was performed. Only this report is intentionally written by this specialist. Node environment variables used for forced fallback were child-process-local.

| Command / execution | Result |
| --- | --- |
| `git status --short` | At start: only untracked campaign directory; no tracked changes |
| `git rev-parse HEAD origin/main` | Both equal the baseline hash above; no fetch performed by this specialist |
| `Test-Path node_modules/vitest/vitest.mjs` | `True`; dependencies installed by coordinator were used |
| `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.test.ts src/lib/apiToolRegistry.test.ts src/lib/hexCalculator.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts` | 5 files, 173 tests passed, 2.28 seconds; no full-suite claim |
| `node --input-type=module -e "import * as c from './src/lib/calculator.ts'; console.log('age',c.calculateAge('2026-01-31','2026-03-01')); console.log('date',c.calculateDateDifference('2026-01-31','2026-03-01')); console.log('loan-tiny',c.calculateLoanSummary(100000,1e-12,30)); console.log('loan-overflow',c.calculateLoanSummary(100000,100000,30));"` | Reproduced COR-03/04/05; actual values recorded above |
| PowerShell here-strings piped into `node --experimental-transform-types --input-type=module` | Separate in-memory Ask, REST, MCP, registry/example and finance-case harnesses described below; all completed |
| `rg -n '^export const (GET\|POST\|PUT\|PATCH\|DELETE\|ALL\|OPTIONS\|prerender)' src/pages/api src/pages/mcp.ts` | Entrypoint/method inventory above |

Read-only exploration used `rg --files src tests`, filtered `rg` searches for exports/function names/date/finance/API references, `Get-Content`/`Select-Object`, and numbered PowerShell source slices. No report-generating `aft` command was run because it can write extra artifacts; the owning Ask/API/MCP done gates are reserved for implementation verification, not claimed passed by this report.

### In-Memory Harness Details

The repeated Node harness registered this process-local extension resolver (not a file or global configuration change):

```javascript
import { registerHooks } from 'node:module';
registerHooks({
  resolve(s, c, next) {
    try { return next(s, c); }
    catch (error) {
      if (s.startsWith('.')) return next(s + '.ts', c);
      throw error;
    }
  }
});
```

- Ask harness: set `process.env.AFT_ASK_FORCE_FALLBACK='true'`, imported `answerUtilityQuestion`, executed the six exact questions in COR-01/02, and printed question/route/inputs/answer. No provider fetch was needed.
- REST harness: imported `POST` from `src/pages/api/v1/run/[slug].ts`, constructed local `Request` objects with JSON `{inputs}`, and invoked the handler using `clientAddress:'correctness-probe'`. Cases: mortgage `{homePrice:125000,downPayment:25000,annualRatePercent:1e-12,years:30}`; same mortgage at `100000`; basic `{left:1e308,operator:'*',right:10}`; date `{startDate:'2026-01-31',endDate:'2026-03-01'}`. It printed status, ok, answer and result. URLs used `https://example.test/api` only as local Request metadata, with no network request.
- MCP harness: imported `POST` from `src/pages/mcp.ts`; local Request with Accept `application/json, text/event-stream`, JSON-RPC `tools/call`, `name:'run_tool'`, and the basic overflow case above. Printed status, `isError` (absent treated as false), parsed run. URL was local Request metadata, not a network destination.
- Registry harness: loaded `tools`, `listApiTools`, `apiTools`, `runApiTool`, and `getBlogGuidePathForTool`. Checked duplicate tool slugs, API membership, canonical guide path equality; executed each example where `risk !== 'privacy'` and verified JSON serialization. Result: **304 tools, 34 API tools, zero duplicate slugs, zero missing API tool pages by registry identity, zero canonical guide mismatches, 44 example executions without exceptions**. These are identity/execution checks, not live URL checks or independent numerical oracles.
- Finance harness: a process-local load hook used the installed TypeScript `transpileModule` for `FinanceCalculator.tsx`, adding exports for `financeConfigs` and `calculateFinance` **in memory only**; JSX compiled with `ReactJSX`, target ES2022/module ESNext. Resolver tried `.ts` then `.tsx`. Ran every mode's default and examples for `mortgage`, `loan`, `auto-loan`, `compound-interest`, `amortization`, `mortgage-payoff`, `irr`, `apr`, `mortgage-uk`, `canadian-mortgage`. **52 executions, no exceptions or NaN/Infinity/undefined/Error text**. This exercised component-level case wiring but not React rendering, events, clipboard or browser layout.

Tooling attempts that did not succeed: initial `Get-Content` without `-LiteralPath` failed for `[slug].ts` and was corrected; an initial Node Ask import failed because strip-only mode cannot handle a TypeScript parameter property, then succeeded with process-local `--experimental-transform-types`; listing the reports directory before writing found it did not yet exist. Transform-mode runs emit Node's experimental-feature warning. These are harness/environment details, not application findings. An initial read-only memory search found no correctness-specific evidence used in this report.

## Test Quality And Remaining Coverage

- Coordinator-reported supplemental evidence: 565 tests passed in the main check before its audit failure, and 110 functional smoke tests passed. These results were supplied during this review, not independently executed or inspected by this specialist. They do not turn the full check into a pass or invalidate the targeted reproductions above; the audit failure's details belong to the coordinator's report.
- The existing focused tests passed while all five findings reproduced independently. Green fixtures are not an adequate edge-case or semantic-interpretation gate.
- Many calculator tests bundle unrelated functions into one example-oriented test. Near-zero limits, result finiteness and calendar decomposition properties are missing for the identified failures. Add small regression/property tables beside the relevant functions rather than another broad snapshot or file-size-driven rewrite.
- The mocked-fetch test at `src/lib/apiToolRegistry.test.ts:233` explicitly verifies parser precedence and that fetch is **not** called. It does not prove Ollama routing works. Malformed provider arguments, unknown tools, provider errors/timeouts, and unsupported-question behavior remain a focused contract-test task for API And MCP Tester; do not call the current suite live-model proof.
- MCP initialization/list/basic run are proven only in-process. Full HTTP/server adapter behavior, disconnects, notification/batch handling, lifecycle under concurrency and third-party client compatibility were not tested.
- No browser, SSR build, hydration, keyboard, accessibility, visual, bundle or production runtime verification was performed. The browser-visible date impact is inferred from direct interpolation of a reproduced bad result, not a screenshot.
- The registry audit did not prove all 304 tools render exactly one correct component, nor that all modes/labels/defaults agree with every formula. Finance/date mappings and representative numeric component paths were inspected; broad renderer coverage remains with coordinator/browser QA.
- No independent tax/legal/provider-rate validation was performed. Finance observations are numerical implementation findings, not financial advice or an approval of statutory assumptions. IRR/APR/Canadian defaults executing successfully does not establish all financial-domain behavior.
- Privacy/ad implementation, analytics internals, TTS/OCR/game pilots and transcriber were deliberately left to their assigned reviewers. Shared tests may import adjacent code, but this report makes no findings or approval claims about those areas.
- Contact and private admin routes were reviewed statically only; no SMTP send, report refresh or authenticated operation was attempted. No conclusion about production credentials, availability or authorization strength is supported here.

Suggested implementation sequence for coordinator: COR-01/02 first (Ask meaning preservation), COR-03 next (calendar correctness), COR-04/05 together as coordinated but separately testable numeric-boundary work. Re-run the owning `ask-audit`, `api-ready`, `mcp-smoke` gates and the coordinator's build/check after implementation; require concrete acceptance evidence before approval. This report neither runs nor substitutes for those gates.
