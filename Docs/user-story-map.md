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
Title: Primary navigation resolves
As a: visitor
I want to: click the top-nav items and land on real pages
So that: I can move around the site without hitting dead ends
Acceptance:
1. About Us, Careers, Contact Us each return < 400 and a non-empty page
2. No "404 / page not found" text rendered
3. (Investigate) Expertise / Industries / Insights have empty `href="<>"` — confirm behaviour
Test Type: E2E · Priority: P0