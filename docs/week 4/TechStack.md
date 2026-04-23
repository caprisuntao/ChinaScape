# Tech Stack

## Overview
This tech stack is optimized for a one-person team to prevent scope creep and manage complexity. It relies on a single language (JavaScript/TypeScript) end-to-end and requires zero DevOps overhead.

---

## Core Technologies

### Frontend: Next.js (React)
* Built-in routing easily handles attraction pages and the itinerary builder.
* Server-Side Rendering (SSR) and Static Site Generation (SSG) support the <5s load time requirement.
* Effortless, free deployment on Vercel.

### Styling: Tailwind CSS
* Enables rapid building of responsive layouts.
* Eliminates context-switching between separate CSS files.

### Backend: Next.js API Routes
* Keeps frontend and backend in a single repository.
* Saves significant time by eliminating the need to manage or deploy a separate server.

### Database & Auth: Supabase (PostgreSQL)
* Generous free tier suited for a university project.
* Provides out-of-the-box authentication for User Profiles (FR5).
* Built-in storage seamlessly handles images and media (FR7).
* Visual table editor allows for easy attraction data management without writing raw SQL.

---

### Third-Party Services
* **Mapbox GL JS:** Offers a better free tier for student projects compared to Google Maps. Excellent support for plotting map pins (FR2).
* **Ticketing Links:** Implemented as standard external hyperlinks (FR9) to avoid complex API integrations for the MVP.

---

## Why This Stack 
* **Unified Language:** JavaScript/TypeScript handles everything from front to back.
* **Simplified Deployment:** Vercel manages hosting with zero DevOps headaches.
* **BaaS Efficiency:** Supabase replaces the need to build and maintain custom Auth, Database, Storage, and APIs.
* **Massive Community:** The combination of Next.js and Supabase ensures you can easily find tutorials and troubleshooting help.