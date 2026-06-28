# Claude Code Usage Log

## Prompt #1  — EXAMPLE (replace with your real interactions)
**What I asked:**
"Scaffold a Playwright contact-form test for techdome.io that fills all fields and asserts a success message."

**What Claude did:**
Generated a test using `page.getByText('Send Message')` for the button and a hardcoded
`page.getByText('Thank you')` success assertion.

**What I changed / accepted / rejected:**
- **Changed** the button selector from `getByText` to `getByRole('button', { name: /send message/i })`.
  Text selectors match any element with that text (including a heading), so a role-based selector is less ambiguous.
- **Rejected** the hardcoded "Thank you" assertion — I hadn't confirmed the real confirmation copy.
  I opened `--ui`, watched the actual submit, and discovered [fill in what you saw].
- **Added** a `waitUntil: 'domcontentloaded'` because the SvelteKit hydration meant fields
  weren't interactable on initial `load`.

---

## Prompt #2
**What I asked:**
"How do I get the correct locators for techdome.io elements without 
guessing selectors?"

**What Claude did:**
Suggested using `npx playwright codegen https://techdome.io/` to 
auto-record interactions and generate locators by clicking through 
the site manually.

**What I changed / accepted / rejected:**
- **Accepted** the codegen approach — ran `npx playwright codegen https://techdome.io/`
  and clicked through the contact form, nav links, and CTA buttons.
- **Changed** some generated locators where codegen produced overly brittle 
  selectors and replaced them with role-based ones like `getByRole('button', { name: /send message/i })`.
- **Rejected** some text-based selectors codegen produced for nav items 
  

## Prompt #3
**What I asked:**
"I need to write a Playwright test that scans the homepage HTML source 
for leaked API keys or secrets. What regex patterns should I check for?"

**What Claude did:**
Provided 4 regex patterns covering the most common real-world secret formats:
- /AKIA[0-9A-Z]{16}/ for AWS Access Key IDs
- /sk_live_[0-9a-zA-Z]{24,}/ for Stripe live secret keys
- /AIza[0-9A-Za-z\-_]{35}/ for Google API keys
- /-----BEGIN (RSA|PRIVATE) KEY-----/ for PEM private keys

Also explained WHY each pattern matches that specific format 
(e.g. AWS keys always start with AKIA, Google keys always start with AIza).

**What I changed / accepted / rejected:**
- **Accepted** all 4 patterns — Claude explained the reasoning behind each 
  one and they match documented real-world secret formats, not arbitrary guesses.
- **Accepted** the test structure of looping over patterns with 
  expect().not.toMatch() — clean and easy to extend with more patterns later.
- **Understood the limitation** — these patterns only catch secrets that are 
  literally present in the HTML source.
- **Noted** this test passed on techdome.io — no secrets found in page source, 
  which is the expected and correct result.

## Prompt #5
**What I asked:**
"The assignment says maximum 5 concurrent users and treating exceeding 
it as a fundamental failure. If I use Playwright parallel workers the 
count varies by machine — a 16-core machine could spin up 16 workers. 
How do I guarantee exactly 5 concurrent users on any machine?"

**What Claude did:**
Explained two approaches and why one is safer than the other:

- **Approach 1 (risky):** Set workers: 5 in playwright.config.ts 
  — problem is this is machine-dependent and could still vary, 
  and each worker runs a separate test, not a controlled simulation.

- **Approach 2 (correct):** Pin the load project to workers: 1 
  in playwright.config.ts so Playwright itself adds zero parallelism, 
  then inside that single test manually create exactly 5 browser 
  contexts and fire them together with Promise.all.
  This guarantees concurrency = 5, provably, on any machine.

**What I changed / accepted / rejected:**
- **Accepted** Approach 2 — it's the only way to guarantee exactly 
  5 concurrent users regardless of the machine running the test.
  

- **Implemented it as:**
  playwright.config.ts → load project pinned to workers: 1
  load.spec.ts → Promise.all over 5 browser contexts manually


- **This is the key architectural decision of the load test** — 
  the concurrency is controlled inside the test code itself, 
  not delegated to the Playwright runner which is non-deterministic 
  across machines.