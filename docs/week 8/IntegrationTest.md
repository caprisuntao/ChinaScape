# ChinaScape — Integration Test Record


## Section 1 — Attractions API

---

### TEST-001 — Load All Attractions

| Field | Details |
|---|---|
| **Page** | `/attractions` |
| **API Called** | `GET /api/attractions` |
| **How to Test** | Navigate to the Attractions page and wait for it to load |
| **Expected Result** | List of attractions appears, 8 per page |
| **Actual Result** | All 8 attractions loaded correctly |
| **Status** | Pass|
---

### TEST-002 — Search Attractions by Name

| Field | Details |
|---|---|
| **Page** | `/attractions` |
| **API Called** | `GET /api/attractions?search=wall` |
| **How to Test** | Type "wall" into the search box and wait for results |
| **Expected Result** | Only attractions matching "wall" appear (e.g. The Great Wall) |
| **Actual Result** | All attractions matching the search requirment appeared |
| **Status** | Pass |

---

### TEST-003 — Filter Attractions by Category

| Field | Details |
|---|---|
| **Page** | `/attractions` |
| **API Called** | `GET /api/attractions?category=History` |
| **How to Test** | Click the "History" category chip filter |
| **Expected Result** | Only History category attractions are shown |
| **Actual Result** | All attractions catagotized as history showed up |
| **Status** | Pass |

---

### TEST-004 — Load Single Attraction Detail

| Field | Details |
|---|---|
| **Page** | `/attractions/[id]` |
| **API Called** | `GET /api/attractions/[id]` |
| **How to Test** | Click on any attraction from the list page |
| **Expected Result** | Full detail page loads with name, image, hours, fee, description, Chinese flashcard |
| **Actual Result** | Full detail page loaded with all information displayed correctly |
| **Status** | Pass |

---

## Section 2 — Authentication

---

### TEST-005 — Register New Account

| Field | Details |
|---|---|
| **Page** | `/register` |
| **API Called** | Supabase Auth signup |
| **How to Test** | Fill in name, email, and password (min 6 chars) and submit |
| **Expected Result** | Account is created, user is redirected, profile row auto-created in DB |
| **Actual Result** | Account created successfully, user redirected to home page |
| **Status** | Pass |

---

### TEST-006 — Login

| Field | Details |
|---|---|
| **Page** | `/login` |
| **API Called** | Supabase Auth signin |
| **How to Test** | Enter a valid registered email and password, click Login |
| **Expected Result** | User is logged in, Navbar updates to show My Profile / Logout |
| **Actual Result** | User logged in successfully, Navbar updated correctly |
| **Status** | Pass |

---

### TEST-007 — Logout

| Field | Details |
|---|---|
| **Page** | Any page (Navbar) |
| **API Called** | Supabase Auth signout |
| **How to Test** | Click the Logout button in the Navbar |
| **Expected Result** | User is logged out, Navbar updates to show Sign In / Register |
| **Actual Result** | User logged out successfully, Navbar updated correctly |
| **Status** | Pass |

---

## Section 3 — Favourites

---

### TEST-008 — Save a Favourite

| Field | Details |
|---|---|
| **Page** | `/attractions/[id]` |
| **API Called** | `POST /api/favourites` |
| **How to Test** | While logged in, open any attraction and click the Save button |
| **Expected Result** | Toast notification appears, button changes to Saved/Unsave |
| **Actual Result** | Toast notification appeared, button changed to Saved |
| **Status** | Pass |

---

### TEST-009 — Remove a Favourite

| Field | Details |
|---|---|
| **Page** | `/attractions/[id]` or `/profile` |
| **API Called** | `DELETE /api/favourites/[id]` |
| **How to Test** | Click Unsave on a saved attraction, or Remove on the profile page |
| **Expected Result** | Favourite is removed, toast confirmation appears |
| **Actual Result** | Favourite removed successfully, toast confirmation appeared |
| **Status** | Pass |

---

## Section 4 — Itinerary

---

### TEST-010 — Create a New Itinerary

| Field | Details |
|---|---|
| **Page** | `/itinerary` |
| **API Called** | `POST /api/itineraries` |
| **How to Test** | Log in, go to Itinerary page, enter a title and duration, click Save |
| **Expected Result** | Itinerary is saved to Supabase, appears in Saved tab |
| **Actual Result** | Itinerary saved successfully, appeared in Saved tab |
| **Status** | Pass |

---

### TEST-011 — Load Saved Itinerary into Builder

| Field | Details |
|---|---|
| **Page** | `/itinerary` |
| **API Called** | `GET /api/itineraries` |
| **How to Test** | Go to the Saved tab, click "Load into Builder" on a saved itinerary |
| **Expected Result** | The itinerary days and attractions are restored into the builder |
| **Actual Result** | Itinerary days and attractions restored into builder correctly |
| **Status** | Pass |

---

### TEST-012 — Delete an Itinerary

| Field | Details |
|---|---|
| **Page** | `/itinerary` or `/profile` |
| **API Called** | `DELETE /api/itineraries/[id]` |
| **How to Test** | Click Delete on a saved itinerary in the Saved tab or Profile page |
| **Expected Result** | Itinerary is removed from the list with a toast confirmation |
| **Actual Result** | Itinerary removed from list, toast confirmation appeared |
| **Status** | Pass |

---

### TEST-013 — Add Attraction to Itinerary

| Field | Details |
|---|---|
| **Page** | `/itinerary` |
| **API Called** | `POST /api/itineraries/[id]/items` |
| **How to Test** | Open the attraction picker modal, search for an attraction, and add it to a day |
| **Expected Result** | Attraction appears in the correct day of the itinerary builder |
| **Actual Result** | Attraction appeared in the correct day of the itinerary builder |
| **Status** | Pass |

---

## Section 5 — Profile

---

### TEST-014 — View Profile Data

| Field | Details |
|---|---|
| **Page** | `/profile` |
| **API Called** | Supabase profile + itineraries + favourites fetch |
| **How to Test** | Log in and navigate to `/profile` |
| **Expected Result** | Display name, member since date, itinerary count, and saved spots count all load correctly |
| **Actual Result** | All profile data loaded correctly |
| **Status** | Pass |

---

### TEST-015 — Edit Display Name

| Field | Details |
|---|---|
| **Page** | `/profile` |
| **API Called** | Supabase profile update |
| **How to Test** | Click the pencil icon next to the display name, type a new name, and save |
| **Expected Result** | Display name updates on the page and in the database |
| **Actual Result** | Display name updated successfully on page and in database |
| **Status** | Pass |

---
