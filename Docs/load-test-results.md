# Load Test Results

**Date:** 2026-06-28T16:49:21.426Z
**Target:** https://techdome.io
**Concurrent users:** 5 (hard cap, controlled via Promise.all over 5 contexts)
**Journey per user:** GET / then GET /contact-us
**Total navigations sampled:** 10

| Metric | Value | Threshold | Result |
|---|---|---|---|
| p95 response time | 5994 ms | < 3000 ms | ❌ |
| Average response time | 751 ms | — | — |
| Max response time | 5994 ms | — | — |
| HTTP 5xx errors | 10 | 0 | ❌ |

**Verdict: FAIL**

## 5xx errors
- 503 https://techdome.io/
- 503 https://techdome.io/
- 503 https://techdome.io/
- 503 https://techdome.io/
- 503 https://techdome.io/
- 503 https://techdome.io/contact-us
- 503 https://techdome.io/contact-us
- 503 https://techdome.io/contact-us
- 503 https://techdome.io/contact-us
- 503 https://techdome.io/_app/immutable/chunks/index._PWc9HQq.js
