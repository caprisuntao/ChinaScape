# Prototype Test — Feedback Record

**Date:** 2026-04-08

## 1. Executive summary

The prototype demonstrates a cohesive, culturally resonant aesthetic with a clear Single Page Application (SPA) feel.Several interactive dead ends (non-functional buttons and missing search logic) should be addressed before moving to beta.

## 2. Task Performance Metrics

| Task | Result | Observations |
|---|---:|---|
| Navigate to "Great Wall" | Success | Users found the "Featured Attractions" grid easy to scan. |
| Save an attraction | Success | The toggle button feedback (Save vs. Saved) is clear and immediate. |
| Review Day 1 Costs | Success | The "Cost Estimator" in the itinerary sidebar is highly visible. |
| Use Search Bar | Partial | Visual design is good, but users expected a result list (currently non-functional). |
| Find Cultural Etiquette | Success | The "Cultural Guide" card layout is engaging and descriptive. |

## 3. Qualitative Feedback

### Strengths
- **Visual Identity:** Noto Serif SC for headings and a deep "Imperial Red" create an authentic, premium travel atmosphere.
- **Localized Utility:** Displaying Chinese names (e.g., 长城 (Chángchéng)) alongside English is highly valued for on-the-ground navigation.
- **Scannability:** Tags (Historical, Nature, Wildlife) on attraction cards help users filter information at a glance.
- **Itinerary Detail:** Including "Passport required" warnings and clear cost summaries was appreciated.

### Pain Points
- **Interactivity Gaps:** The itinerary "Add" (+) button only triggers a toast instead of opening a selection menu.
- **Missing Search Logic:** The search bar is static — pressing Enter does not filter the attractions list.
- **Information Hierarchy:** In the Detail View, the "Nearby" section uses large images that can distract from the primary description.
- **Dead Links:** The "Explore" nav item and "Gallery/Ticketing" buttons have no destinations, breaking test immersion.

## 4. Technical & Design Recommendations

| Category | Recommended action |
|---|---|
| UX/UI | Add hover and active states to the itinerary `Act-Row` and make the hover color more distinct to indicate drag-and-drop capability. |
| Feature | Implement a simple JavaScript filter: hide/show cards in the attractions grid based on search input and Enter key. |
| Content | Expand the Cost Estimator to break down the total by transport type and show per-day subtotals. |
| Mobile | Make the 300–320px sidebars stack vertically on small screens; ensure touch targets meet accessibility size guidelines. |

## 5. Action items (short-term)
- Replace the itinerary Add toast with a selection modal or inline picker.
- Link or stub destinations for "Explore" and "Gallery/Ticketing" to avoid dead links during testing.
- Reduce prominence of "Nearby" images in Detail View (smaller thumbnails or collapsed carousel).
---
