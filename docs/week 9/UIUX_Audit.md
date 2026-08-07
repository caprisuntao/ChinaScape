# ChinaScape — UI/UX Design Audit

**Version:** 1.0
**Date:** 2026-05-14 (Week 9)
**Scope:** Full front-end design audit — visual design, usability, accessibility, and design-system consistency
**Method:** Code-level review of all UI pages and components against the design tokens in `src/app/globals.css` (WCAG contrast ratios computed from actual token hex values). No browser rendering was performed.

---

## Overall Assessment

**6.5 / 10 — "Good foundation, inconsistent execution."**

The design system is a genuine strength: warm paper/ink neutrals paired with Chinese red `#B5271A`, Noto Serif SC display type over DM Sans body, and disciplined color usage (no rogue hex colors anywhere in the app). The gaps are consistency (spacing, radius, type scale), state coverage (loading/error/empty), and accessibility (keyboard support, focus visibility, contrast).

### Strengths (keep)

- Coherent, on-brand design tokens in `src/app/globals.css` — a distinctive warm/editorial direction
- Color discipline: all colors route through `@theme` tokens or opacity modifiers
- Thoughtful micro-motion: `Reveal` scroll animations, card hover lift + image zoom, animated hamburger, `prefers-reduced-motion` respected globally
- Disabled pagination button states, skeleton loading on the attractions grid, back-navigation on cultural subpages

---

## ⚠️ Critical — fix first (usability & trust)

### 1. Core features are mouse-only

| Location | Issue | Fix |
|---|---|---|
| `language/page.js:94-107` | Flashcard flip is a `div` with `onClick` — keyboard/AT users can never flip it | `role="button"`, `tabIndex={0}`, Enter/Space handler, `aria-pressed` |
| `itinerary/DayCard.js:64-82` | Reordering is drag-and-drop only, no keyboard path | Add up/down reorder buttons per row; keep DnD as enhancement |
| `itinerary/AttractionPicker.js:12-66` | Modal has no `role="dialog"`, no Escape handler, no focus trap/return | Dialog semantics + Escape + focus return to opener |
| `itinerary/TripHero.js:47-62` | Editable title is an `<h1>` with `onClick`, not keyboard-operable; Escape commits instead of cancelling | Real button styled as title; Escape reverts to pre-edit value |
| `DayCard.js`, `AttractionPicker.js` | Icon-only buttons (`+`, `×`, remove, close) have only `title` tooltips, no `aria-label` | Add `aria-label` to every icon button |

### 2. Destructive & dead-end flows

| Location | Issue | Fix |
|---|---|---|
| `itinerary/page.js:166-171, 196-205` | Loading a template or "Load into Builder" silently replaces the entire itinerary — no confirm, no undo | Confirm before replacing a non-empty builder; keep previous state for Undo |
| `profile/page.js:227` | "Edit" links to `/itinerary` with no itinerary id — opens a blank builder | Pass `?id=` and auto-load, or rename to "Open builder" |
| `register/page.js:26-40` | Signup success ignores email confirmation — user lands on home logged out with no feedback | Branch on `data.session`/`confirmed_at`; show "check your email" panel |

### 3. Failures masquerade as empty states

| Location | Issue | Fix |
|---|---|---|
| `itinerary/page.js:75-77, 88-90, 301` | Failed API calls render "No attractions match your search" / "No saved itineraries yet" | Track error state per fetch; render error card with Retry |
| `profile/page.js:35-53` | Failed fetches render "No itineraries saved yet." / "No saved spots." | Distinct "Couldn't load — Retry" state |
| `attractions/[id]/page.js:66-71, 127` | Failed fetch silently redirects to list; missing data renders a blank white page | Catch errors, use `notFound()`, render error state with back link |

### 4. WCAG AA contrast failures (consistent across pages)

| Location | Issue | Fix |
|---|---|---|
| Home, all 3 cultural subpages, all 4 auth pages — hero bands | `text-white/75`–`/50` on `#B5271A` ≈ 3.8–4.2:1 (needs 4.5:1) | `text-white/85+` or solid white for body copy |
| `profile/page.js:183, 284` | `text-ink-xlt` (#BFB5A8, ≈2:1) for 11px meta text | `text-ink-lt` (#7A6A58, ≈5.2:1) |
| `cultural/page.js:29, 42, 55` | Chevron `›` at `text-ink-xlt` ≈ 2:1 (fails 3:1 UI minimum) | `text-ink-md` or `text-red`, add `aria-hidden` |
| `language/page.js:98` | Flashcard category label at `opacity-60` (≈3.4:1 both states) | Solid `text-ink-lt` on white; solid white on red |

### 5. Content artifacts in shipped copy

| Location | Issue | Fix |
|---|---|---|
| `manners/page.js:47, 50, 110` | Literal markdown asterisks render: "*lower*", "*Gānbēi*", "*on*" | Remove asterisks or use `<em>` |
| `attractions/page.js:85, 115, 186` | Debug telemetry "served from cache / fetched from database" shown to end users | Delete `cacheStatus` from state and render |

---

## ⚡ Important

### 6. No visible keyboard focus anywhere
Every input/button uses `outline-none` + a 1px border-color change (`attractions`, `itinerary`, all auth pages, cultural). Add `focus-visible:ring-2 ring-red/40` globally.

### 7. Attractions filters not in URL + unbounded pagination
- `attractions/page.js` — search/category/page live only in component state: refresh, Back button, or sharing loses everything. Sync to query params.
- `attractions/page.js:251-263` — every page number rendered (13–60+ buttons at scale), wraps on mobile, no `aria-current="page"`, Prev/Next unlabeled. Window pages (current ±2 + ellipsis).

### 8. Toasts are invisible to screen readers and overflow on mobile
`itinerary/page.js:473`, `profile/page.js:314`, `attractions/[id]/page.js:229` — plain `div` with no `role="status"`/`aria-live`; `whitespace-nowrap` clips long messages at ~320px viewports. Add `role="status" aria-live="polite"` and `max-w` + wrapping.

### 9. Auth forms
- No `autocomplete` attributes on any input (breaks password managers; WCAG 1.3.5)
- Errors are a single top-of-card banner with no `role="alert"`, `aria-invalid`, or `aria-describedby` — screen readers never hear them
- Forgot-password validates email as non-empty only while login/register validate format — inconsistent

### 10. Offline export is a raw JSON dead end
`itinerary/page.js:217-246` — travelers get `my_itinerary_offline.json` and no way to read it. Export a printable/readable format, or explain what to do with the file.

### 11. Invalid HTML + dead affordances
- `profile/page.js:258-305` — `<button>` (remove) nested inside a `<Link>` (interactive-in-interactive)
- `food/page.js:152` — dish cards get hover border/shadow but are not clickable
- `profile/page.js:209` — itinerary rows show `cursor-pointer` + hover with no click handler
- `attractions/[id]/page.js:219-224` — sidebar Save button (`bg-paper` on `bg-paper`) has no hover/focus state; also duplicate Save with divergent labels ("+ Save" vs "+ Save to Favourites")

### 12. Mobile overflow
- `DayCard.js:29` — fixed `w-[130px]` city input + title + two 34px buttons overflow at ≤360px viewports
- `food/page.js:153-157` — `whitespace-nowrap` origin badge + long dish names overflow at 320px
- `cultural/page.js:21-57` — index cards with fixed 160px image leave ~52px for text on small screens (no stacking breakpoint)

### 13. Loading states unannounced & inconsistent
Attractions list (count text + skeleton + Suspense fallback) vs detail ("Loading..." text) vs itinerary/profile (nothing — pages flash empty states). Use one shared skeleton + `role="status"` wrapper.

---

## 💡 Polish

### 14. Spacing off the 8pt grid (all pages)
Hand-picked `10/14/18/22/28px` values throughout: `attractions/page.js:155-171, 224-228`, `itinerary` (`py-[15px]`, `gap-[14px]`, `px-[18px]`), auth (`mb-[14px]`, `mb-[22px]`), cultural (`px-[22px]`, `py-[30px]`), profile. Snap to 8/12/16/24/32.

### 15. Radius + type-scale drift
- `rounded-[16px]` (AttractionPicker.js:17), `rounded-md` (6px, DayCard.js:29,94; pagination on all cultural subpages) — off the 7/12/18px token scale
- Ad-hoc type scale `text-[10px]…[32px]` with no named tokens; mid-level headings are 15px vs 13px body (1.15:1 — flat hierarchy). Define scale in `@theme`.

### 16. Subpage heroes inconsistent with home
Cultural subpages use `py-8 md:py-10`, 26/32px h1, no animation vs home's `py-14 md:py-16`, 36/54px h1, fade-up animation. Extract a shared `HeroBand` component.

### 17. Auth pages copy-pasted
~50-line brand panel + form shell duplicated across login/register/forgot/reset, already drifting (`required` attrs, spacing, banner styles). Extract `AuthShell`/`AuthCard`.

### 18. Manners cards blend into page
`manners/page.js:22, 43, 61, 82, 100` — `bg-paper` cards on a `bg-paper` body, distinguished only by a 1px border; contradicts `bg-white` cards on food/language pages.

### 19. Semantics & metadata
- `attractions/[id]/page.js:144` — hero title is a `div`; page has no `<h1>`
- `attractions/page.js:216`, `[id]/page.js:136` — image `alt` duplicates the adjacent visible name
- No per-page metadata on cultural subpages (tabs always read "ChinaScape - 中国旅游")

### 20. Misc
- `food/page.js:136` — `autoFocus` on search pops the mobile keyboard on every load; field is supplementary
- `itinerary` drag feedback: live reorder on `dragover` causes rubber-band swapping; commit on `drop` with an insertion indicator
- Save button hover `hover:bg-gold-lt` (#FEF9E7 on white) is visually indistinguishable — use `hover:bg-gold` with white text

---

## Quick Wins (top 3, ~5 minutes each)

1. Delete the "served from cache" UI text + strip markdown asterisks from manners copy
2. Add `role="status"` + `aria-live="polite"` to the three toast components
3. Replace the detail-page blank-screen dead end with `notFound()` + "Back to attractions" link

---

## Severity Summary

| Severity | Count | Themes |
|---|---|---|
| ⚠️ Critical | 5 | Keyboard access, destructive flows, false empty states, contrast, content artifacts |
| ⚡ Important | 8 | Focus visibility, URL state, toasts, auth forms, offline export, invalid HTML, mobile overflow, loading states |
| 💡 Polish | 7 | Spacing, radius/type tokens, hero consistency, shared components, semantics, misc |

---

## Resolution Log (v1.1 — 2026-05-14)

All findings fixed in a single pass. Verification: `npm run lint` clean, `npm run test` 40/40, `npm run build` succeeds (22 routes).

### Resolved — Critical

| # | Finding | Fix |
|---|---|---|
| 1 | Mouse-only core features | Flashcards are now real `<button>`s with `aria-pressed` + `aria-live` (`language/page.js`); DayCard rows got keyboard up/down reorder buttons (`DayCard.js`); picker modal is now `role="dialog"` with `aria-modal`, Escape-to-close, Tab focus trap and focus return (`AttractionPicker.js`); TripHero rename is a keyboard-operable button and Escape now cancels the edit (`TripHero.js`); every icon button has an `aria-label` |
| 2 | Destructive & dead-end flows | Template/Saved loads ask before replacing a non-empty builder (inline confirm bar) and offer an Undo button in the toast; profile "Edit" now links to `/itinerary?id=…` which auto-loads the itinerary; register shows a "check your email" panel + resend action when email confirmation is pending |
| 3 | Failures as empty states | Attractions picker, saved tab, and profile sections track error state and render "Couldn't load — Try again" with a retry button; attraction detail page now renders a proper not-found/error state instead of a silent redirect or blank page |
| 4 | WCAG AA contrast | Hero-band text raised to `white/85–90` on all pages (home, attractions, cultural, auth, api-docs, itinerary); profile meta text `ink-xlt` → `ink-lt`; cultural chevrons `ink-xlt` → `ink-lt` + `aria-hidden`; flashcard category label no longer uses `opacity-60` |
| 5 | Content artifacts | Markdown asterisks removed from manners copy (`<em>` instead); "served from cache" debug text deleted |

### Resolved — Important

| # | Finding | Fix |
|---|---|---|
| 6 | Keyboard focus | Global `:focus-visible` red outline in `globals.css`; explicit `focus-visible:ring-2` on every `outline-none` input/button |
| 7 | URL state + pagination | Attractions search/category/page now live in the URL (shareable, Back/Forward works); pagination is windowed (current ±2 + ellipsis) with `aria-current="page"`, labelled Prev/Next, and `role="group"`/`aria-pressed` on chips |
| 8 | Toasts | `role="status" aria-live="polite"`, `max-w` + wrapping (itinerary, profile, detail) |
| 9 | Auth forms | Shared `AuthShell`/`AuthCard`/`AuthAlert`/`AuthField` component (`src/components/AuthShell.js`); `autocomplete` on all fields; field-level errors with `aria-invalid`/`aria-describedby`; banners have `role="alert"`; forgot-password now validates email format like the others |
| 10 | Offline export | Downloads a printable, styled HTML page (`*_offline.html`) with print styles instead of raw JSON; sidebar copy updated |
| 11 | Invalid HTML + dead affordances | Profile remove button moved out of the `<Link>`; dish cards no longer fake clickability; itinerary rows lost the misleading `cursor-pointer`; detail-page sidebar Save restyled with hover/focus and a consistent "+ Save"/"✓ Saved" label |
| 12 | Mobile overflow | Day-card city input is `flex-1 min-w-0` (caps at 130px); food origin badge wraps on mobile; cultural index cards stack vertically below `sm` |
| 13 | Loading states | `role="status"` + `aria-live` on all loading indicators; itinerary/profile sections show explicit loading states before data arrives |

### Resolved — Polish

| # | Finding | Fix |
|---|---|---|
| 14 | Spacing | Hand-picked `10/14/18/22/28px` values snapped to the 8pt set across all pages; page gutters unified to `md:px-12` (home, footer, attractions, itinerary, profile, cultural, api-docs) |
| 15 | Radius + type scale | `rounded-[16px]`/`rounded-md` → token radii; named type scale added to `@theme` (`text-display/hero/page-title/h2/h3/caption`) and applied to section titles (15px → 18px `text-h3`) and page heroes (28/40px) |
| 16 | Hero consistency | All subpage heroes now share `py-12 md:py-14` + `text-page-title md:text-hero` + `white/85` subtitle (cultural, auth, api-docs, attractions, profile) |
| 17 | Auth copy-paste | Extracted shared `AuthShell` component; all four pages rewritten on it |
| 18 | Manners cards | `bg-paper` → `bg-white` to match the other subpages |
| 19 | Semantics & metadata | Detail page hero is an `<h1>`; duplicated image `alt`s → `alt=""`; `layout.js` files add per-page titles/descriptions for the cultural subpages |
| 20 | Misc | `autoFocus` removed from food search; drag-and-drop now commits on drop (with a red insertion highlight) instead of janky live reordering; Save button hover is now a real state (`hover:bg-gold` + white text); food/language pagination gained labels, `aria-current`, hover states and pill radius |

### Deferred (needs product decision, not a code fix)

- **Saved-itinerary data model**: `loadIntoBuilder` and the detail route use `metadata.days`, but `GET /api/itineraries/[id]` returns items under `itinerary_item` — the URL-loaded flow relies on `metadata` being present. Works today; revisit if itineraries are ever created without metadata.

---

*ChinaScape UI/UX Audit — v1.1 — Week 9*
