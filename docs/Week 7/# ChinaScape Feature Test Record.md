# ChinaScape Feature Test Record

This document outlines the functional and integration test cases for the ChinaScape application. These tests verify the core user flows, database interactions, and optimization features.

| Test ID | Feature | Test Steps | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC01** | User Registration | 1. Go to `/register`<br>2. Fill in valid name, email, password<br>3. Click Create Account | User is created and redirected to home | As expected | ✅ Pass |
| **TC02** | Registration — empty fields | 1. Go to `/register`<br>2. Leave name empty<br>3. Click Create Account | Error: "Display name is required" | As expected | ✅ Pass |
| **TC03** | Registration — invalid email | 1. Go to `/register`<br>2. Enter "notanemail" as email<br>3. Click Create Account | Error: "Please enter a valid email address" | As expected | ✅ Pass |
| **TC04** | User Login | 1. Go to `/login`<br>2. Enter valid credentials<br>3. Click Sign In | User is logged in, navbar shows My Profile | As expected | ✅ Pass |
| **TC05** | Login — wrong password | 1. Go to `/login`<br>2. Enter wrong password<br>3. Click Sign In | Error message shown | As expected | ✅ Pass |
| **TC06** | Logout | 1. While logged in click Logout | User is logged out, navbar shows Sign In | As expected | ✅ Pass |
| **TC07** | Browse attractions | 1. Go to `/attractions` | Grid of attractions displayed | As expected | ✅ Pass |
| **TC08** | Search attractions | 1. Go to `/attractions`<br>2. Type "wall"<br>3. Click Search | Only matching attractions shown | As expected | ✅ Pass |
| **TC09** | Category filter | 1. Go to `/attractions`<br>2. Click "History" chip | Only History attractions shown | As expected | ✅ Pass |
| **TC10** | Pagination | 1. Go to `/attractions`<br>2. Click Next | Next page of attractions loads | As expected | ✅ Pass |
| **TC11** | View attraction detail | 1. Click any attraction card | Detail page loads with full info| As expected | ✅ Pass |
| **TC12** | Save to favourites | 1. Open an attraction<br>2. Click Save (logged in) | Attraction saved, button changes to Saved | As expected | ✅ Pass |
| **TC13** | Save — not logged in | 1. Open an attraction<br>2. Click Save (logged out) | Redirected to `/login` | As expected | ✅ Pass |
| **TC14** | Remove from favourites | 1. Click Saved button on a saved attraction | Attraction removed, button changes back | As expected | ✅ Pass |
| **TC15** | **Caching** | 1. Load `/attractions`<br>2. Go to detail page<br>3. Go back | Attractions load instantly from cache (SessionStorage) | As expected | ✅ Pass |
| **TC16** | API — GET `/api/attractions` | Call endpoint in browser | Returns JSON list of attractions | As expected | ✅ Pass |
| **TC17** | API — POST unauthenticated | Call `/api/itineraries` without login | Returns 401 Unauthorised | As expected | ✅ Pass |
