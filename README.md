# ChinaScape
Discover China's Landscapes &amp; Culture

### China Tourist Attraction Introduction Platform

ChinaScape is a digital travel companion designed to bridge the gap between international travelers and the rich heritage of China. From the neon streets of Shanghai to the ancient echoes of the Great Wall, our platform provides the context and tools needed for an unforgettable journey.

---

## 📄 Topic Confirmation
**Project Choice:** ChinaScape Introduction & Planning Platform

We chose this topic to solve the common information gap international tourists face when visiting China. While there is plenty of data available, it is often fragmented. ChinaScape centralizes high-quality attraction data, simplifies the logistical headache of itinerary planning across provinces, and provides essential cultural context (etiquette, history, and customs) to ensure a respectful and smooth travel experience.

---

## 👥 Team Member List & Role Assignments

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| **胡登盛** | Full-Stack Developer | End-to-end development: UI design, database management, and core logic. |
---

## 🚀 Key Features
* **Attraction Introductions:** In-depth guides with historical significance and visitor tips.
* **Itinerary Planning:** Custom scheduling tools to help users navigate between cities and landmarks.
* **Cultural Explanations:** Insights into local traditions, food culture, and social norms to help tourists integrate.

---

## 🛠️ Tech Stack & Environment
* **Editor:** VScode
* **Version Control:** Git / GitHub
* **Documentation:** Markdown (.md)

---

## 📂 Repository Structure
* `/docs`: Project documentation and research.
* `/reports`: Weekly project reports.
* `/src`: Source code for the ChinaScape platform.
* `README.md`: Project overview and team information.

# ChinaScape — Project Run Instructions

**Version:** 1.0  
**Last Updated:** 2026-04-30  
**Tech Stack:** Next.js · Supabase (PostgreSQL) · Tailwind CSS

---

## Prerequisites

Before running this project, make sure the following are installed on your computer:

| Requirement | Version | Download |
|---|---|---|
| Node.js | v18 or above | https://nodejs.org |
| Git | Any recent version | https://git-scm.com |

You will also need a free **Supabase** account at https://supabase.com.

---

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/yourusername/chinascape.git
cd chinascape
```

---

## 2. Install Dependencies

Inside the project folder, run:

```bash
npm install
```

This will install all required packages including Next.js, Supabase, and Tailwind CSS. This may take 1–3 minutes depending on your internet connection.

---

## 3. Set Up Supabase

### 3.1 Create a Supabase Project

1. Go to https://supabase.com and sign in or create a free account
2. Click **New Project**
3. Give it a name (e.g. `chinascape`) and set a database password
4. Wait for the project to be created (takes about 1 minute)

### 3.2 Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Paste and run the following SQL to create all tables:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- City
create table city (
  city_id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_zh text not null,
  province text,
  description text
);

-- Category
create table category (
  category_id uuid primary key default uuid_generate_v4(),
  name text not null
);

-- Attraction
create table attraction (
  attraction_id uuid primary key default uuid_generate_v4(),
  city_id uuid references city(city_id) on delete set null,
  category_id uuid references category(category_id) on delete set null,
  name_en text not null,
  name_zh text not null,
  address_en text,
  address_zh text,
  opening_hours text,
  entrance_fee numeric(10, 2),
  description_en text,
  passport_required boolean default false,
  booking_notes text,
  ticket_url text,
  image_url text,
  video_url text
);

-- Profile (extends Supabase auth)
create table profile (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- Itinerary
create table itinerary (
  itinerary_id uuid primary key default uuid_generate_v4(),
  user_id uuid references profile(user_id) on delete cascade,
  title text not null,
  duration_days int default 1,
  is_template boolean default false,
  created_at timestamptz default now()
);

-- Itinerary Item
create table itinerary_item (
  item_id uuid primary key default uuid_generate_v4(),
  itinerary_id uuid references itinerary(itinerary_id) on delete cascade,
  attraction_id uuid references attraction(attraction_id) on delete cascade,
  day_number int not null,
  order_in_day int not null
);

-- Favourite
create table favourite (
  favourite_id uuid primary key default uuid_generate_v4(),
  user_id uuid references profile(user_id) on delete cascade,
  attraction_id uuid references attraction(attraction_id) on delete cascade,
  saved_at timestamptz default now(),
  unique(user_id, attraction_id)
);
```

### 3.3 Set Up Row Level Security (RLS)

Still in the SQL Editor, run this to configure access policies:

```sql
-- Enable RLS on all tables
alter table attraction enable row level security;
alter table city enable row level security;
alter table category enable row level security;
alter table flashcard enable row level security;
alter table profile enable row level security;
alter table itinerary enable row level security;
alter table itinerary_item enable row level security;
alter table favourite enable row level security;

-- Public read access
create policy "Public read attractions" on attraction for select using (true);
create policy "Public read cities" on city for select using (true);
create policy "Public read categories" on category for select using (true);
create policy "Public read flashcards" on flashcard for select using (true);

-- Grant anon and authenticated roles read access
grant select on attraction to anon, authenticated;
grant select on city to anon, authenticated;
grant select on category to anon, authenticated;
grant select on flashcard to anon, authenticated;

-- Authenticated users manage their own data
create policy "Users manage own profile" on profile for all using (auth.uid() = user_id);
create policy "Users manage own itineraries" on itinerary for all using (auth.uid() = user_id);
create policy "Users manage own itinerary items" on itinerary_item for all using (
  itinerary_id in (select itinerary_id from itinerary where user_id = auth.uid())
);
create policy "Users manage own favourites" on favourite for all using (auth.uid() = user_id);

grant all on itinerary to authenticated;
grant all on itinerary_item to authenticated;
grant all on favourite to authenticated;
grant all on profile to authenticated;
```

### 3.4 Get Your API Credentials

1. In your Supabase dashboard go to **Settings → API**
2. Copy your **Project URL** — it looks like `https://xxxxxx.supabase.co`
3. Copy your **anon/publishable key** — it starts with `eyJ...`

---

## 4. Configure Environment Variables

In the root of the project folder, create a file called `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with the credentials you copied from the Supabase dashboard.

> **Note:** `.env.local` is listed in `.gitignore` and will NOT be pushed to GitHub. Every developer needs to create their own copy of this file.

---

## 5. Run the Development Server

```bash
npm run dev
```

Then open your browser and go to:

```
http://localhost:3000
```

You should see the ChinaScape home page.

---

## 6. Verify the API is Working

To confirm the database connection is working, visit:

```
http://localhost:3000/api/attractions
```

You should see a JSON response like `{ "data": [] }`. The empty array is expected if no attraction data has been added yet.

---

## 7. Available Routes

| URL | Description |
|---|---|
| `http://localhost:3000/` | Home page |
| `http://localhost:3000/attractions` | Attractions list page |
| `http://localhost:3000/attractions/[id]` | Single attraction detail page |
| `http://localhost:3000/itinerary` | Itinerary builder page |
| `http://localhost:3000/cultural` | Cultural guide page |
| `http://localhost:3000/profile` | User profile and saved spots |
| `http://localhost:3000/api/attractions` | API — get all attractions |
| `http://localhost:3000/api/attractions/[id]` | API — get single attraction |
| `http://localhost:3000/api/itineraries` | API — get/create itineraries |
| `http://localhost:3000/api/favourites` | API — get/save favourites |
| `http://localhost:3000/api-docs` | Swagger API documentation |

---

## 8. Project Structure

```
chinascape/
├── src/
│   ├── app/
│   │   ├── api/                  ← API route handlers
│   │   │   ├── attractions/
│   │   │   ├── itineraries/
│   │   │   └── favourites/
│   │   ├── attractions/          ← Frontend pages
│   │   ├── itinerary/
│   │   ├── cultural/
│   │   ├── profile/
│   │   ├── layout.js             ← Root layout with Navbar
│   │   ├── page.js               ← Home page
│   │   └── globals.css           ← Global styles
│   ├── components/
│   │   └── Navbar.js             ← Shared navigation component
│   └── utils/
│       └── supabase/
│           └── server.js         ← Supabase client
├── .env.local                    ← Environment variables (not in git)
├── .gitignore
├── next.config.mjs
├── package.json
└── README.md
```

---

## 9. Common Issues

| Problem | Solution |
|---|---|
| `node` is not recognized | Restart your terminal or computer after installing Node.js |
| `npm install` fails with network error | Switch to a mobile hotspot and try again |
| `permission denied` on PowerShell | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `permission denied for table attraction` | Run the RLS grant statements from Step 3.3 |
| `cookieStore.getAll is not a function` | Make sure `createClient()` is called with `await` |
| Page loads but shows no data | Check that your `.env.local` credentials are correct |

---

## 10. Building for Production

To create a production build:

```bash
npm run build
npm start
```

*ChinaScape — Software Engineering Project, 2026*
