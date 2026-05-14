# ChinaScape — UX Optimization Record

**Version:** 1.0
**Date:** 2026-05-07
**Project:** ChinaScape Tourist Platform

---

## Overview

This document records the UX optimizations implemented during the development of ChinaScape. Each record describes the problem identified, the solution implemented, and how it improves the user experience.

**Total Optimizations:** 4

---

## OPT-01 — Data Caching on Home Page

### Problem Identified
Every time a user visited the home page, it made a request to the Supabase database to fetch the 6 featured attractions. This caused a noticeable loading delay each time the user navigated back to the home page. for example, after browsing an attraction detail and returning home.

### Before
- Every home page visit triggered a database query
- Users saw a "Loading attractions..." message on every return visit
- Poor experience for users who frequently navigate back to home

### Optimization Implemented
Implemented client-side caching using `sessionStorage`. Featured attractions are fetched once from Supabase and stored locally in the browser for a limited time. the cached data is served instantly if it is less than 5 minutes old. After 5 minutes the cache expires and fresh data is fetched automatically.

### After
- First visit: fetches from database 
- Return visits within 5 minutes: served from cache
- Users no longer see a loading state on return visits

### Why It Improves UX
Users using the site frequently go back to the home page. Removing the loading delay on return visits makes the site feel fast and responsive, which is very important for the overall experience in the website.

---

## OPT-02 — Data Caching on Attractions List Page

### Problem Identified
The attractions list page re-fetched data from Supabase every time a user:
- Navigated away and came back
- Applied the same search filter again
- Returned to a previously visited page number

This resulted in repeated identical database queries and unnecessary loading states that disrupted the browsing experience.

### Before
- Every filter, search, or page navigation triggered a new database call
- Returning to a previous search showed a loading state again
- Browsing felt slow and repetitive
- Higher than necessary database usage

### Optimization Implemented
Implemented a per-query caching system using `sessionStorage`. Each unique combination of search term, category filter, and page number gets its own cache entry. Categories are cached separately with a longer effective duration since they almost never change.

### After
- First load of any search/filter/page combination: fetches from database
- Subsequent visits to the same combination: served from cache instantly
- Going back to page 1 after page 2 is instant
- Re-applying the same category filter is instant
- Categories list never re-fetched during the session

### Why It Improves UX
Users browsing attractions often go back and forth between filters and pages as they compare options. Making these repeated interactions instant removes friction and encourages exploration without the frustration of repeated loading states.

---

## OPT-03 — Data Caching on Attraction Detail Page

### Problem Identified
Each time a user opened an attraction detail page, the full attraction data (including joined city, category, and flashcard) was re-fetched from the database. Users who opened the same attraction multiple times — for example, to show a taxi driver the Chinese address flashcard — experienced repeated loading delays.

### Before
- Every detail page visit triggered a full database query including joins
- Loading spinner shown on every visit
- Estimated load time: 400–800ms per visit
- Particularly frustrating for the flashcard use case where speed matters

### Optimization Implemented
Added `Cache-Control` headers to the `GET /api/attractions/[id]` API route. This allows the browser and any CDN (such as Vercel's edge network) to cache individual attraction responses for 10 minutes, with a 2-minute stale-while-revalidate window to serve fresh data in the background.

### After
- First visit to a detail page: fetches from server 
- Return visits within 10 minutes: served from browser/CDN cache instantly
- Flashcard page loads almost immediately on repeat visits
- Stale-while-revalidate ensures data stays reasonably fresh

### Why It Improves UX
Users browsing attractions often go back and forth between filters and pages as they compare options. Making these repeated interactions instant removes friction and encourages exploration without the frustration of repeated loading states.

---

## OPT-04 — Pagination on Attractions List Page

### Problem Identified
Without pagination, the attractions list page would load all attractions from the database in a single request. As the database grows, this would result in:
- Very long initial load times
- Excessive data transferred to the browser
- An overwhelming, unscrollable list for the user
- Poor performance on slower connections

### Before
- All attractions loaded in one query (no limit applied)
- Page load time grows as more attractions are added
- Users must scroll through potentially hundreds of entries
- No clear visual structure to the browsing experience

### Optimization Implemented
Implemented server-side pagination using Supabase's `.range()` method. Attractions are loaded 8 at a time. The total count is retrieved using `{ count: 'exact' }` so the correct number of pages can be calculated and displayed. Navigation controls (Previous / Next buttons with a page indicator) allow users to move between pages. The page resets to 1 automatically when a new search or filter is applied.

**Page size:** 8 attractions per page  
**UX additions:**
- Previous / Next buttons with disabled states on boundaries
- "Page X of Y" indicator
- Auto-scroll to top on page change
- Page resets to 1 on new search or filter

### After
- Only 8 attractions loaded per request regardless of database size
- Page load time remains consistent as database grows
- Users have a clear, manageable browsing experience
- Combined with caching (OPT-02), previously visited pages load instantly
- Total result count still visible ("X attractions found")

### Why It Improves UX
Breaking content into pages is a standard web pattern that users understand intuitively. Limiting results to 8 per page keeps the interface uncluttered and manageable, especially on mobile screens. The combination with caching means navigating between pages is fast in both directions.

---

## Summary

| ID | Optimization | Page Affected | Technique | Impact |
|---|---|---|---|---|
| OPT-01 | Home page caching | Home (`/`) | sessionStorage cache | Eliminates repeat loading states |
| OPT-02 | Attractions list caching | Attractions (`/attractions`) | Per-query sessionStorage cache | Instant repeat searches and filters |
| OPT-03 | Attraction detail caching | Detail (`/attractions/[id]`) | HTTP Cache-Control headers | Fast repeat visits |
| OPT-04 | Attractions pagination | Attractions (`/attractions`) | Server-side Supabase range() | Consistent load time regardless of database size |

---

*ChinaScape UX Optimization Record — v1.0 — 2026-05-07*
