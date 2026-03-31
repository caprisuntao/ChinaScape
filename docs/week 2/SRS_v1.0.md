# Requirements Specification (SRS) — ChinaScape v1.0

**Version:** 1.0  
**Date:** 2026-03-31

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for ChinaScape, a bilingual platform that introduces Chinese tourist attractions, supports itinerary planning, and provides cultural explanations for international visitors.

### 1.2 Scope
ChinaScape is a standalone web application (mobile-first) that helps international tourists discover attractions in China, plan itineraries, access cultural context in English, and use printable Chinese address flashcards for local communication. The platform may integrate third-party services for maps, ticketing links, and multimedia content.

### 1.3 Primary Users
- International tourists
- Student travelers
- Travel planners
- Cultural enthusiasts

### 1.4 Product Perspective
Standalone web application with optional third-party integrations (maps, ticket providers, multimedia hosting).

## 2. Overall Description

### 2.1 Assumptions and Dependencies
- Availability of third-party map services (e.g., Google Maps, Mapbox or region-appropriate provider).
- Ticketing providers may not offer English booking pages for all attractions.
- Offline mode requires local device storage for downloaded itineraries.

## 3. Functional Requirements (FR)

| ID | Requirement | Description |
|---|---|---|
| FR1 | Attraction Search | Search by name, city, or category (Nature, History, Food). |
| FR2 | Maps | Visual map pins showing attraction locations. |
| FR3 | Itinerary Builder | Tool to drag-and-drop attractions into a daily schedule. |
| FR4 | Cultural Insights | Dedicated sections for "Etiquette," "Historical Context," and "Must-Try Food." |
| FR5 | User Profiles | Save favorite spots and personalized itineraries. |
| FR6 | Multi-language Support | Primary UI in English, with Chinese "Flashcards" for showing to taxi drivers. |
| FR7 | Multimedia Content | Each attraction page includes photos or short video clips, and location. |
| FR8 | Offline Mode | Allow users to download itineraries for offline use. |
| FR9 | Ticketing Links | Integrate or link to official ticket booking pages where available. |
| FR10 | Cost Estimator | Provide estimated costs per itinerary (tickets, transport). |

## 4. Non-Functional Requirements (NFR)

| ID | Requirement | Description |
|---|---|---|
| NFR1 | Performance | Pages must load in under 5 seconds on typical mobile connections. |
| NFR2 | Localization | Dates and times must follow international formats (DD/MM/YYYY). |
| NFR3 | Mobile-First Design | Must be fully responsive for on-the-go usage. |

## 5. Use Cases

### UC1 — Search Attraction
- Flow: User searches by name or filter → system returns list → user opens attraction page → user saves attraction to favorites.

### UC2 — Build Itinerary
- Flow: User creates a new itinerary → user adds attractions → user arranges order (drag-and-drop) → user saves itinerary.

### UC3 — Download for Offline
- Flow: User selects attractions or an itinerary → user requests download → system packages content (texts, images, offline map data) and stores locally → user accesses content offline.

## 6. User Stories (selected)

1. As an international student, I want to search for attractions in English so that I can find places to visit without needing a translator.

2. As a history buff, I want to read cultural background stories so that I understand the significance of the temples I visit.

3. As a budget traveler, I want to see estimated entrance fees so that I can plan my spending.

4. As a busy student, I want to generate a 2-day itinerary automatically so that I don't waste time planning.

5. As a navigator, I want to see the Chinese name and address of a location so that I can show it to a taxi driver.

6. As a foodie, I want to see recommended local dishes near each attraction so that I can have an authentic culinary experience.

7. As a solo traveler, I want to save favorite spots so that I can refer back to them later.

8. As a first-time visitor, I want cultural explanations and etiquette tips so that I avoid unintentional offense.

9. As a non-Chinese speaker, I want integrated ticketing links that lead to English booking pages or clear instructions so that I can buy tickets easily.

## 7. Priority (MoSCoW)
Refer to the MoSCoW matrix in `docs/week 2/MoSCoWPriorityMatrix.md` for prioritization. Key must-haves include English search, Chinese/English address flashcards, core attraction database, and passport/ID requirements info.

## 9. Appendices
- Interview highlights and key insights: see `docs/week 2/interviewRecords.md`.
- Functional requirements table: see `docs/week 2/functionalRequirementsList.md`.

---
*Document: SRS v1.0*
