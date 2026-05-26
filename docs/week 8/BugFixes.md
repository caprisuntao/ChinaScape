# ChinaScape — Bug Fix List
---

### BUG-001 — PowerShell Blocks npx Command

| Field | Details |
|---|---|
| **Page / Area** | Development Setup |
| **Severity** | High — blocked project from starting |
| **Description** | Running `npx create-next-app` in PowerShell was blocked due to execution policy restrictions on Windows. |
| **Steps to Reproduce** | 1. Open PowerShell. 2. Run `npx create-next-app chinascape`. 3. Command is blocked with execution policy error. |
| **Fix Applied** | Ran `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` to allow script execution. |
| **Status** | ✅ Fixed |

---

### BUG-002 — npm Install Fails with ECONNRESET Error

| Field | Details |
|---|---|
| **Page / Area** | Development Setup |
| **Severity** | High — blocked package installation |
| **Description** | Running `npm install` failed repeatedly with an ECONNRESET network error. |
| **Steps to Reproduce** | 1. Run `npm install`. 2. Installation starts then drops with ECONNRESET. |
| **Fix Applied** | Switched to mobile hotspot and ran `npm cache clean --force` before retrying. |
| **Status** | ✅ Fixed |

---

### BUG-003 — Node.js Not Recognised After Install

| Field | Details |
|---|---|
| **Page / Area** | Development Setup |
| **Severity** | Medium — could not run any Node commands |
| **Description** | After installing Node.js, running `node -v` in the terminal returned "command not found". |
| **Steps to Reproduce** | 1. Install Node.js. 2. Open existing terminal. 3. Run `node -v` — not recognised. |
| **Fix Applied** | Restarted the computer so the PATH variable was refreshed. |
| **Status** | ✅ Fixed |

---

### BUG-004 — Permission Denied for Table Attraction (Error 42501)
 
| Field | Details |
|---|---|
| **Page / Area** | `/api/attractions`|
| **Severity** | High |
| **Description** | Visiting `http://localhost:3000/api/attractions` returned `{"error": "permission denied for table attraction"}`. RLS was enabled and a SELECT policy existed but queries still failed. |
| **Steps to Reproduce** | 1. Enable RLS on attraction table 2. Create policy: `CREATE POLICY "Public read attractions" ON attraction FOR SELECT USING (true)` 3. Call `GET /api/attractions` 4. Error 42501 returned |
| **Fix Applied** | Ran the following in Supabase SQL Editor: `grant select on attraction to anon; grant select on city to anon; grant select on category to anon; grant select on flashcard to anon;` and the same for the `authenticated` role. |
| **Status** | ✅ Fixed |


---

### BUG-005 — User Registers Successfully But No Profile Row Created
 
| Field | Details |
|---|---|
| **Page / Area** | `/register` |
| **Severity** | High |
| **Description** | After registering, the user appeared in Supabase Authentication → Users but no corresponding row was created in the `profile` table. Features depending on the profile table (display name, stats) returned null or errored. |
| **Steps to Reproduce** | 1. Navigate to `/register` 2. Fill in valid name, email, password 3. Click Create Account 4. Check Supabase → Table Editor → profile 5. No row exists for the new user |
| **Fix Applied** | Replaced the manual insert with a Supabase database trigger. Created a `handle_new_user()` function and `on_auth_user_created` trigger in SQL that automatically inserts a profile row every time a new user is added to `auth.users`. The manual insert code was removed from the register page. |
| **Status** | ✅ Fixed |
 
---

## BUG-006 — Saved Itinerary Cannot Be Loaded Back Into Builder
 
| Field | Details |
|---|---|
| **Page / Area** | `/itinerary` — Saved Tab |
| **Severity** | Medium |
| **Description** | Itineraries saved to database appeared in the Saved tab but could not be loaded back into the builder. |
| **Steps to Reproduce** | 1. Build an itinerary with attractions in the builder 2. Click Save 3. Switch to the Saved tab 4. No "Load" button available, and even if added, no attraction data was stored to restore |
| **Fix Applied** | 1. Added a `metadata jsonb` column to the itinerary table: `alter table itinerary add column if not exists metadata jsonb;` 2. Updated `saveItinerary()` to include `metadata: { days }` in the insert, storing the complete day/attraction structure 3. Added a `loadIntoBuilder()` function that reads `itinerary.metadata.days` and restores it to state 4. Added "Load into Builder" and "Delete" buttons to each saved itinerary card in the Saved tab |
| **Status** | ✅ Fixed |


## Severity Guide

| Level | Meaning |
|---|---|
| **High** | Broke a core feature or blocked development entirely |
| **Medium** | Caused incorrect behaviour but had a workaround |
| **Low** | Minor visual or UX issue with little impact |

---