# User Story Map — techdome.io

## US-001
Title: Homepage loads with correct identity
As a: visitor
I want to: open techdome.io and immediately see a working, branded homepage
So that: I trust this is the real company and can start exploring
Acceptance:
1. Page title contains "Techdome" and "IT Solutions"
2. Meta description is present and non-empty
3. Hero heading "Trusted Partner in Digital Excellence" is visible
Test Type: E2E · Priority: High

## US-002
Title: Primary navigation 
As a: visitor
I want to: click the top-nav items and land on real pages
So that: I can move around the site without hitting dead ends
Acceptance:
1. About Us, Careers, Contact Us each return < 400 and a non-empty page
2. No "404 / page not found" text rendered
3. (Investigate) Expertise / Industries / Insights have empty `href="<>"` — confirm behaviour
Test Type: E2E · Priority: High

## US-003
Title: Contact form — valid submission and validation
As a: prospect
I want to: submit the contact form and be told it worked, and be stopped if I leave required fields blank
So that: I can reliably reach the Techdome team
Acceptance:
1. Filling Company/First/Last/Email/Message and submitting shows a success state
2.  Submitting empty surfaces required-field validation and does not navigate away
3. (Investigate) the 250-char message counter actually enforces the limit
Test Type: E2E · Priority: High

## US-004
Title: Mobile layout at 375px
As a: visitor on a phone
I want to: read the homepage without sideways scrolling
So that:the site is usable on mobile
Acceptance:
1. No horizontal overflow at 375px
2. Nav collapses to a menu trigger
Test Type: E2E · Priority: Medium

## US-005
Title: Tablet layout at 768px
As a: visitor on a tablet
I want to:see a correctly reflowed layout
So that:content is legible on mid-size screens
Acceptance:
1. Hero visible, no horizontal overflow at 768px
Test Type: E2E · Priority: Medium

## US-006
Title: Hero CTA routes correctly
As a: prospect
I want to: click "Meet the Minds" and reach the leadership section
So that: the CTA delivers what it promises
Acceptance:
1. Click routes to /about-us (leaders section)
Test Type: E2E · Priority: Medium

## US-007
**Title:** Footer links and social icons work
**As a:** visitor
**I want to:** use footer links to reach company pages and social profiles
**So that:** I can find more info and verify the company
**Acceptance:**
1. All footer "Company" links resolve < 400
**Test Type:** E2E · **Priority:** Low

## US-008
**Title:** Homepage performance is acceptable
**As a:** visitor
**I want to:** the page to become usable quickly despite the hero video
**So that:** I don't bounce
**Acceptance:**
1. LCP is measurable; flag if > 4s
**Test Type:** E2E · **Priority:** Low
## US-009
**Title:** Contact form fires the correct network request
**As a:** prospect (system behaviour)
**I want to:** my submission to actually be sent to the backend with my data
**So that:** the form isn't a no-op
**Acceptance:**
1. A POST request fires on submit
2. The payload contains the email I entered
**Test Type:** Integration · **Priority:** High

## US-010
**Title:** Core routes return healthy status codes
**As a:** visitor (system behaviour)
**I want to:** key pages to respond 2xx
**So that:** navigation is reliable
**Acceptance:**
1. Home, /contact-us, /about-us, /careers return 2xx/3xx
**Test Type:** Integration · **Priority:** medium

## US-011
**Title:** Third-party scripts don't block render
**As a:** visitor
**I want to:** analytics/tracking to load without freezing the page
**So that:** first paint isn't delayed
**Acceptance:**
2. No third-party `<script>` in the critical path lacks async/defer
**Test Type:** Integration · **Priority:** low

## US-012
**Title:** Security headers present
**As a:** security researcher
**I want to:** the site to send baseline protective headers
**So that:** users are protected from clickjacking/MITM
**Acceptance:**
1. HSTS present
2. Clickjacking protection via X-Frame-Options or CSP frame-ancestors
3. Audit/report CSP, X-Content-Type-Options, Referrer-Policy
**Test Type:** Security · **Priority:** P1

## US-013
**Title:** Contact form resists script injection
**As a:** security researcher
**I want to:** `<script>alert(1)</script>` in a field to be sanitised, not executed or reflected
**So that:** the form isn't an XSS vector
**Acceptance:**
1. No alert dialog fires
2. Payload not reflected unescaped into the DOM
**Test Type:** Security · **Priority:** P0

## US-014
**Title:** No secrets leaked in source
**As a:** security researcher
**I want to:** page source/network free of API keys and tokens
**So that:** credentials aren't exposed
**Acceptance:**
1. No AWS/Stripe/Google key patterns or private keys in HTML
**Test Type:** Security · **Priority:** Medium

## US-015
**Title:** Site stays healthy under 5 concurrent users
**As a:** prospect during peak interest
**I want to:** the homepage and contact page to stay fast and error-free under light concurrent load
**So that:** the site holds up when several leads arrive at once
**Acceptance:**
1. Exactly 5 concurrent users (hard cap)
2. p95 response time < 3000ms
3. Zero HTTP 5xx errors
**Test Type:** Load · **Priority:** P1


