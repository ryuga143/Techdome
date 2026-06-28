## BUG-001
**Severity:** high
**Summary:** Keyboard users cannot access "Expertise", "Industries", "Insights" dropdown menus — hover-only interaction excludes keyboard navigation

**Steps:**
1. Go to https://techdome.io
2. Press Tab key repeatedly until focus lands on "Expertise", "Industries", 
   or "Insights" in the top navigation
3. Press Enter or Space to activate the focused item
4. Observe — no dropdown appears, page does not navigate anywhere

**Expected:** Pressing Enter/Space on a focused nav item should open the dropdown menu (same as hovering with a mouse)

**Actual:** Dropdowns only trigger on mouse hover. Keyboard users who Tab to these items and press Enter get no response — the dropdown never opens. The href="" means Enter also goes nowhere.

**Note:** Mouse hover works correctly — hovering over these items reveals sub-navigation options as intended.

**Evidence:** screenshot Attached in bug_evedience .Manually verified: hover shows dropdown, keyboard Enter does not.

## BUG-002
**Severity:** High
**Summary:** Critical security headers missing on techdome.io — 
             HSTS, X-Frame-Options, and CSP all absent from responses

**Steps:**
1. Open https://techdome.io in Chrome
2. Open DevTools → Network tab
3. Click any request and open the Headers tab
4. Check Response Headers for security-related entries
 OR run: npx playwright test --project=security

**Expected:** Production HTTPS site should include:
- strict-transport-security (HSTS) — forces HTTPS, prevents downgrade attacks
- x-frame-options — prevents clickjacking
- content-security-policy — controls what resources the page can load

**Actual:** None of the three headers are present in the response.
           DevTools confirms only these security-related headers exist:
           - x-xss-protection: 0  (actually DISABLES XSS protection)
           - access-control-allow-origin: * (overly permissive CORS)

**Evidence:** 
- DevTools screenshot showing response headers with no HSTS/XFO/CSP
- Playwright test `homepage response includes baseline security headers` FAILS
  with: "HSTS header — expect(received).toBeTruthy() — Received: undefined"

## BUG-003  (verify)
**Severity:** Low
**Summary:** Inconsistent trailing slashes across /solution/* URLs may cause redirects
**Steps:**
 1. Compare /solution/cloud-computing-solutions vs /solution/AI-solutions/
**Expected:** Consistent canonical URLs
**Actual:** [record status codes / redirect chains]
**Evidence:** [network log]



## BUG-004
**Severity:** Medium
**Summary:** "Glimpse of Our Key Expertise" carousel has no navigation arrows — users cannot scroll left/right to see all 4 cards

**Steps:**
1. Go to https://techdome.io
2. Scroll down to the "OUR KEY EXPERTISE — Glimpse of" section
3. Observe the horizontal card slider (4 cards visible in DOM)
4. Try to navigate to cards that are off-screen
5. Look for left/right arrow buttons to slide the carousel

**Expected:** A carousel/slider with multiple cards should provide:
             - A visible right arrow (→) to scroll forward
             - A visible left arrow (←) to scroll backward
             - OR dot indicators showing current position So users can discover and access all 4 cards

**Actual:** No navigation arrows or indicators exist.
           Only 2 cards are visible on screen at a time.
           The other cards are hidden (overflow-hidden on parent div)
           with no way for the user to reach them via UI controls.

           DOM confirms: div.slider contains 4 × div.slide children
           but the parent has overflow-hidden — cards are clipped 
           with no affordance to scroll.

**Evidence:** 
- Screenshot showing 2 visible cards with no arrow controls
- DevTools shows: class="slider flex gap-5 svelte-8vagvy" 
  with 4 slide children inside overflow-hidden container
- Right-side cards are unreachable without touch/swipe on mobile





## BUG-005
**Severity:** High
**Summary:** "News & Events" section heading is styled as a clickable element 
             (cursor: pointer) but clicking it does nothing — no navigation, 
             no redirect, no page reload

**Steps:**
1. Go to https://techdome.io
2. Scroll to the right panel on the homepage showing "News & Events"
3. Hover over the "News & Events" heading
4. Observe — cursor changes to a pointer hand (↖ → 👆) indicating it's clickable
5. Click on "News & Events"
6. Observe — nothing happens

**Expected:** Clicking "News & Events" should either:
             - Navigate to a News & Events page
             - Scroll to a relevant section
             - Open a dropdown or modal with more content
             (The pointer cursor strongly implies it is interactive)

**Actual:** Click does nothing — no navigation, no redirect, no visual feedback.
           The pointer cursor is a false affordance that misleads users 
           into thinking the element is interactive when it is not.

**Evidence:**
- Screenshot showing "News & Events" highlighted with pointer cursor visible
- DevTools confirms: div with cursor-pointer class wraps the h2 "News & Events"
  but has no href, onclick, or event handler attached

**Root Cause:** The parent div has cursor-pointer class applied 
               but no click handler or link wrapper — likely a 
               development oversight where the link was never wired up

**Impact:**
- Users expect to click it and get frustrated when nothing happens
- False affordance damages UX trust
- The actual child links (Event Highlights →, Top Moments →) work 
  fine but the heading itself is dead