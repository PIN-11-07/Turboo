# Turboo

## 1. Project Introduction

**Purpose and main capabilities:** 
mobile marketplace used to publish and browse car listings. Users can authenticate with Supabase, scroll through the feed, publish their own vehicles and manage their profile.

**Technology stack:** 
- React Native 0.81 + React 19 via Expo 54 
- Supabase (email/password Auth + Postgres + JSON storage for images) 
- React Navigation 7 (bottom tabs + native stacks) 
- AsyncStorage for session persistence + Expo Secure Store plugin 
- Docker (Node 20 image) for the containerized development environment

**General prerequisites:** 
- Docker and Docker Compose installed 
- Supabase account with an existing project (URL + anon key) 
- Expo Go app on a physical device if you want to test through the QR code
- Google AI Studio API key if you want AI auto-fill (`EXPO_PUBLIC_GEMINI_API_KEY`)
## 2. Run the Project Locally with Docker

> [!NOTE]
> **Windows only:** open WSL from PowerShell or CMD:
> ```powershell
> wsl
> ```

1. Clone the repository and change into the folder:
    ```bash
    git clone https://github.com/PIN-11-07/Turboo.git
    cd Turboo
    ```
2. Build the Docker image:
    ```bash
    docker compose build
    ```
3. Start the services:
    ```bash
    docker compose up -d
    ```
4. Enter the `expo` container:
    ```bash
    docker compose exec expo bash
    ```
5. Inside the container run:
    ```bash
    npm i
    apt-get update -y && apt-get upgrade -y
    npx expo start --tunnel
    ```

## 3. Workflow for New Features

1. **Sync Main Branch**  
   - Run `git checkout main && git pull origin main` to ensure you start from the latest code.  
   - Resolve local changes first so future merges stay clean.

2. **Create a Dedicated Branch**  

3. **Publish the Branch Early**  

4. **Assess Supabase Configuration Impact**  
   - List every dashboard change you expect: database schema, RLS policies, triggers, functions, storage buckets, authentication settings, or Edge Functions.  
   - Prepare SQL snippets or detailed UI steps for each change and save them under `SQL → Shared snippets` so they are reproducible by the team; add comments in the snippet description if future runs require manual tweaks or additional context.
   - When updating an existing table choose one of these approaches and save the snippet accordingly:
     1. Re-create the table from scratch and store the new SQL using the same command name as the original plus a version suffix (e.g., `listings table 2`). Expect to re-run every SQL snippet in order afterward, effectively rebuilding the full database.
     2. Change an existing table with an SQL snippet, then update the original creation snippet so that, if executed today, it would build the table exactly as it currently exists, even if that was not the command originally executed.

5. **Document Database Structure Changes**  
   - After editing Supabase, update Section “Database Structure” for each touched entity.  
   - Refresh the Markdown table (fields, types, constraints, descriptions), rewrite the **Functions & triggers** subsection, and update the **RLS policies** list with the exact rules now in place.  
   - Amend the Relationships list whenever foreign keys change, and never leave placeholder rows—use the same formatting seen in the existing tables.

6. **Scaffold New App Pages (or Shared Components)**  
   - When a feature introduces a page, create `app/pages/<feature>/` with:
     ```text
     app/pages/<feature>/
     ├── <Feature>Navigator.js
     ├── <Feature>Styles.js
     └── <Feature>Screen.js
     ```
   - When you only need a reusable UI element, place it under `app/components/` (e.g., `app/components/<ComponentName>.js` . Keep shared components free of feature-specific dependencies so they stay portable across pages.

7. **Write the Code with Approved Assistants**  
   - Prefer the Codex extension inside VS Code: it usually follow all the proyect rules.
   - If you consult an external AI attach the README.

8. **Describe the Feature in the README**  
   - Add a block under “Application Features” describing the new feature.

9. **Update the TO DO List**  
   - Mark items as complete.

10. **Open the Pull Request**  
    - Open a PR summarizing the changes.

## 4. Project Structure
**Main folder tree:**
```text
Turboo/
├── Docker-compose.yml
├── Dockerfile
├── README.md
└── expo_app/
    ├── App.js
    ├── app/
    │   ├── components/
    │   │   └── FavoriteButton.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── ...
    │   ├── navigation/
    │   │   ├── AppNavigator.js
    │   │   ├── AuthNavigator.js
    │   │   └── RootNavigator.js
    │   ├── pages
    │   │   ├── auth/
    │   │   │   ├── AuthNavigator.js
    │   │   │   ├── AuthStyles.js
    │   │   │   └── LoginScreen.js
    │   │   ├── home/
    │   │   │   ├── HomeNavigator.js
    │   │   │   ├── HomeStyles.js
    │   │   │   └── HomeScreen.js
    │   │   ├── listingDetails/
    │   │   │   ├── ListingDetailStyles.js
    │   │   │   └── ListingDetailScreen.js
    │   │   ├── profile/
    │   │   │   ├── ProfileNavigator.js
    │   │   │   ├── profileStyles.js
    │   │   │   └── ProfileScreen.js
    │   │   └── publish
    │   │       ├── PublishNavigator.js
    │   │       ├── PublishStyles.js
    │   │       └── PublishScreen.js
    │   ├── services/
    │   │   └── ...
    │   ├── theme/
    │   │   └── palette.js
    │   └── util/
    │       └── supabase.js
    ├── app.json
    ├── assets/
    │   ├── adaptive-icon.png
    │   ├── favicon.png
    │   ├── icon.png
    │   └── splash-icon.png
    ├── node_modules/
    │   └── ...
    ├── index.js
    ├── package-lock.json
    └── package.json
```

**Explanation of the key folders:**
- `app/components`: reusable UI components.
- `app/context`: global providers; `AuthContext` wraps the Supabase client and exposes the session.
- `app/navigation`: React Navigation configuration (`RootNavigator`, `AppNavigator`, `AuthNavigator`).
- `app/pages/<page>`: feature-based structure; every folder groups `screens` and a style file (`<Page>Styles.js`).
- `app/theme`: shared design tokens such as the color palette.
- `app/util`: infrastructure helpers (`supabase.js` instantiates the client with AsyncStorage).
- `assets`: icons, splash art and favicons used by Expo (`app.json` describes how they are used).
- `Dockerfile` / `Docker-compose.yml`: define the Node/Expo container and port mapping.

**Architecture rules and conventions:**
- Each feature (`auth`, `home`, `publish`, `profile`) keeps its own navigator, screens and dedicated styles inside `app/pages/<feature>`.
- Native navigators live next to their feature, while `RootNavigator` decides whether to render the auth stack or the main app based on the session.
- Style files aggregate StyleSheet definitions to avoid inline logic inside the screens.
- The Supabase client is centralized to share storage configuration and token auto-refresh.

**Critical files:**
- `app.json` – Expo configuration (icons, orientation, Secure Store plugin).
- `Dockerfile` and `Docker-compose.yml` – Docker infrastructure for the Dev/Tunnel workflow.
- `app/util/supabase.js` – client initialization and session management.
- `app/navigation/RootNavigator.js` – navigation entry point and authentication guard.

## 5. Application Features

### a) Authentication
- **Login/signup flow:** users authenticate or register from `LoginScreen` with email/password; sign-up optionally accepts a full name and requires email confirmation.
- **Technologies:** Supabase Auth (`@supabase/supabase-js`), React Context (`AuthContext`), `expo-linear-gradient` for the UI.
- **Token handling & persistence:** Supabase stores sessions and refresh tokens in `AsyncStorage`, enabling `autoRefreshToken` and `persistSession`; the client skips session detection via URL (`detectSessionInUrl: false`).
- **Middleware/guards:** `RootNavigator` automatically chooses `AuthNavigator` (login screens) or `AppNavigator` (main tabs) based on the user object coming from context.

### b) Navigation
- **Library:** React Navigation 7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`).
- **Navigator structure:** a themed `NavigationContainer` (custom palette) wraps `AppNavigator` (tabs for Home, Publish, Profile) and the related stacks (`HomeNavigator`, `PublishNavigator`, `ProfileNavigator`).
- **Routing rules:** every feature exposes its own stack with consistent headers; `Home` e `Profile` aprono la stessa schermata di dettaglio (`ListingDetail`) ospitata in `app/pages/listingDetails`.
- **Deep linking:** not configured; navigation happens through internal React Navigation routes.

### c) Listings feed (Home)
- **Description:** `HomeScreen` shows a feed of active listings fetched from Supabase, with client-side search, pull-to-refresh, endless scroll and resilient loading/error states.
- **APIs used:** Supabase `listings` (`select`, `eq('is_active', true)`, sorting/pagination with `created_at` + `id` cursors) and `FlatList` for infinite scroll.
- **Limitations/notes:** the feed shows only the first available image; if the images array is stringified it gets normalized in the detail screen.

### d) Listing publication
- **Description:** `PublishScreen` offers a validated form for creating listings (required fields, numeric sanitization, brand/fuel/transmission pickers) and writes them to Supabase. An “Remplir avec l'IA” button analyses the selected car photo with Gemini and auto-remplishes make/model/year/color/description when the image is already chosen.
- **APIs used:** `supabase.from('listings').insert`, custom validation helpers and in-memory selectors, Gemini image+text generation (requires `EXPO_PUBLIC_GEMINI_API_KEY` from Google AI Studio).
- **Limitations/notes:** no media upload to Supabase (images stay local in the form); AI analysis needs a valid Gemini key (billing activated but free quota available).

### e) Profile and listing management
- **Description:** `ProfileScreen` fetches user data (`auth.getUser`, `profiles` table for avatars) and lists published listings, allowing navigation to the shared detail screen. La scheda `ListingDetail` mostra anche nome e immagine del venditore pescandoli dalla tabella `profiles`, ora leggibile da tutti per poter esporre questi metadati.
- **APIs used:** Supabase `profiles` (avatar) and `listings` filtered by `user_id`, plus Supabase Auth to fetch metadata (name, email).
- **Limitations/notes:** no profile editing or media management on the client. Logging out calls `supabase.auth.signOut` directly.

### f) Favorites
- **Description:** Users can mark any listing with a heart icon from the feed, detail views or the *Tus favoritos* section; the choice is stored in the `public.favorites` table and follows the user across sessions.
- **UX details:** buttons show a spinner while the Supabase mutation runs, disable automatically when the session is missing and stay in sync when navigating between tabs.
- **Data flow:** all screens rely on a shared cache that mirrors `favorites` so toggling one heart immediately updates the other mounted buttons without extra API calls.

### g) Wallet & purchase simulation
- **Balance:** each profile has a `saldo` field surfaced in the Profile page so users can see their available wallet balance.
- **Flow:** from the vehicle detail page a “Comprar” CTA opens a dedicated checkout screen where the buyer fills card data, confirms, and the app transfers the amount to the seller’s balance while applying a 5% platform fee.
- **Guards:** buyers cannot purchase their own listing and the flow checks for sufficient balance before applying the simulated transfer.

### h) AI auto-fill (publish)
- **Description:** `ImageAnalisisButton` reads the already-selected car photo, sends it to Gemini, and fills publish fields plus generates a sales description.
- **Config:** set `EXPO_PUBLIC_GEMINI_API_KEY` in `.env` (Google AI Studio key; billing enabled but free tier covers tests).
- **UX:** shows loading state; if no image is selected, prompts the user to add one first.

### i) AI image search (Home)
- **Description:** Users can pick or take a photo directly from the `Home` screen. The selected image is analyzed using the same Gemini-based pipeline (`CarAnalysisService` + `ImageAnalisisButton`) used for publish autofill.
- **What the AI applies:** to keep search recall high the AI applies a minimal set of filters only: **brand (make)**, **color**, and a **price range (±20%)** when a price estimate is available. The detected brand is also used as the search text to improve matching.
- **Behavior & UX:** filters are applied silently (the filters panel does not open), a professional banner summarizing the applied filters is shown, and the picked image is cleared after the search is applied.
- **Rationale:** limiting the AI-applied filters reduces over-constraining and finds visually similar listings more reliably.
- **Config:** requires `EXPO_PUBLIC_GEMINI_API_KEY` in `.env` and the `ImageAnalisisButton` component to be available in the publish flow.

### j) Data generator script
- **Location:** `scripts/generate_luxury_listings.py`
- **Purpose:** generate fake luxury car listings for development/testing. Outputs SQL INSERT, JSONL (one object per line), or optionally inserts directly into Supabase via the REST API.
- **Key features:**
  - Proper SQL escaping for text fields.
  - Ensures output directories exist before writing files.
  - CLI flags: `-n/--num`, `--sql-out`, `--jsonl-out`, `--api`, `--supabase-url`, `--supabase-key`, `--prefer-return`.
  - Helpful errors when Python dependencies are missing.
- **Dependencies:** Python 3 and the `faker` and `requests` packages. Install with:

```powershell
python -m pip install faker requests
```

- **Usage examples:**

Write SQL file (safe to inspect before running against DB):
```powershell
python scripts/generate_luxury_listings.py -n 40 --sql-out tmp/luxury_insert.sql
```

Write JSONL (one JSON object per line):
```powershell
python scripts/generate_luxury_listings.py -n 40 --jsonl-out tmp/luxury.jsonl
```

Insert directly into Supabase via REST (requires a service role key):
```powershell
python scripts/generate_luxury_listings.py -n 40 --api --supabase-url "https://your-project.supabase.co" --supabase-key "SERVICE_ROLE_KEY" --prefer-return
```

- **Important:** for direct API insertion you must use a Supabase `service_role` key (or an account with write permissions). The public/anon key is likely blocked by Row Level Security for inserts. Always verify `--jsonl-out` or `--sql-out` before using `--api` in production-like environments.

### Search & filters enhancements
- The search/filter system (`useSearch` + `SearchFilters`) was extended to support additional options: **body type**, **condition**, **doors**, **fuel type** and **transmission**. These options are exposed in the `SearchFilters` component as selectable chips and sliders.


## 6. Components
### FavoriteButton (`app/components/FavoriteButton.js`)
- **Responsibility:** renders the heart icon, loads the initial favorite status, sends Supabase mutations (`insert`/`delete`) and handles optimistic updates while keeping errors isolated per button.
- **Shared cache:** keeps a `Map` keyed by listing + user; listeners subscribe/unsubscribe so every mounted button reacts instantly to status changes.
- **Variants & props:** `variant="detail\" | "overlay\" | "list\"` tweaks layout to match each screen; `initialIsFavorite`, `fetchOnMount`, `onStatusChange`, `hitSlop` and style overrides cover more advanced cases (e.g., removing an item from *Tus favoritos* when it gets unhearted).

### ImageAnalisisButton (`app/components/ImageAnalisisButton.js`)
- **Responsibility:** converts the picked image to base64, calls Gemini to extract car fields, and triggers description generation callbacks.
- **Props:** `imageUri`, `onAnalysisComplete`, `onDescriptionGenerated`, `style`.
- **Notes:** requires `EXPO_PUBLIC_GEMINI_API_KEY`; only works once an image has been chosen in the publish flow.

## 7. Database Structure

**Tables in Supabase:**

* `auth.users` (managed by Supabase Auth)
* `public.listings`
* `public.profiles`
* `public.favorites`

Row Level Security (RLS) is enabled on every public table described below.

---

### **Table `public.listings`**

| Field          | Type (Supabase) | Constraints / Default                                   | Description                                       |
| -------------- | --------------- | ------------------------------------------------------- | ------------------------------------------------- |
| `id`           | `uuid`          | PK, `default gen_random_uuid()`                         | Listing identifier.                               |
| `user_id`      | `uuid`          | FK → `auth.users.id`, `not null`, `on delete cascade`   | Owner of the listing.                             |
| `title`        | `text`          | `not null`                                              | Title shown in feed and detail.                   |
| `description`  | `text`          |                                                         | Optional long description.                        |
| `price`        | `numeric(12,2)` | `not null`, `check price >= 0`                          | Price in euro.                                    |
| `make`         | `text`          | `not null`                                              | Brand.                                            |
| `model`        | `text`          | `not null`                                              | Model.                                            |
| `year`         | `int4`          | `check year between 1900 and current year + 1`          | Model year validation.                            |
| `mileage`      | `int4`          | `check mileage >= 0`                                    | Mileage in km.                                    |
| `fuel_type`    | `text`          |                                                         | Fuel type (benzina, diesel, EV, …).               |
| `transmission` | `text`          |                                                         | Transmission (manuale/automatica).                |
| `doors`        | `int4`          |                                                         | Number of doors.                                  |
| `color`        | `text`          |                                                         | Vehicle color.                                    |
| `images`       | `jsonb`         | `default '[]'::jsonb`                                   | Array of image URLs.                              |
| `location`     | `text`          |                                                         | City/area for the vehicle.                        |
| `is_active`    | `boolean`       | `not null default true`                                 | Visibility flag; only active listings are shown.  |
| `created_at`   | `timestamptz`   | `not null default now()`                                | Creation timestamp.                               |

**RLS policies:**

1. `Read active listings` → everyone can `SELECT` only where `is_active = true`.
2. `Insert own listing` → `INSERT` allowed when `auth.uid() = user_id`.
3. `Update own listing` → `UPDATE` allowed only to owners.
4. `Delete own listing` → `DELETE` allowed only to owners.

---

### **Table `public.profiles`**

| Field               | Type          | Constraints / Default                             | Description                                    |
| ------------------- | ---------     | --------------------------------------------------| ---------------------------------------------- |
| `id`                | `uuid`        | PK, FK → `auth.users.id`, `on delete cascade`     | Mirrors the auth user ID.                      |
| `full_name`         | `text`        |                                                   | Synced from Supabase Auth metadata.            |
| `profile_image_url` | `text`        |                                                   | Avatar URL from metadata.                      |
| `saldo`             | `numeric`     | `default 0`                                       | Wallet balance used for simulated payments.    |
| `created_at`        | `timestamptz` | `default timezone('utc', now())`                  | Automatic creation timestamp.                  |
| `updated_at`        | `timestamptz` | `default timezone('utc', now())`                  | Updated by trigger on every profile change.    |

**Functions & triggers:**

* `handle_profile_timestamp` + trigger `on_profile_updated` → refreshes `updated_at` before each update.
* `handle_new_user` + trigger `on_auth_user_created` → auto-inserts a profile when a new auth user is created.
* `sync_user_name` + trigger `on_auth_user_updated` → keeps `full_name` and `profile_image_url` in sync with metadata.
* `process_vehicle_purchase(buyer_id, seller_id, price, fee_percent, listing_id)` (security definer) → transfers saldo from buyer to seller applying the platform fee y marca el anuncio como inactivo; callable via Supabase RPC.

**RLS policies:**

1. `Profiles are publicly readable` → `SELECT` allowed for anyone.
2. `Users can update their own profile` → `UPDATE` allowed only when `auth.uid() = id`.
3. `Insert only via trigger` → manual `INSERT` blocked (`WITH CHECK (false)`), so only the trigger can create rows.

---

### **Table `public.favorites`**

| Field        | Type                    | Constraints / Default                              | Description                      |
| ------------ | ----------------------- | -------------------------------------------------  | -------------------------------- |
| `id`         | `bigint`                | PK, generated identity                             | Internal identifier.             |
| `user_id`    | `uuid`                  | FK → `public.profiles.id`, `not null`, cascade     | User who favorited the listing.  |
| `listing_id` | `uuid`                  | FK → `public.listings.id`, `not null`, cascade     | Favorited listing.               |
| `created_at` | `timestamptz`           | `not null default now()`                           | Timestamp of insertion.          |

Additional constraints: `unique (user_id, listing_id)` enforces one favorite per listing per user.

**RLS policies:**

1. `Users can select their favorites` → `SELECT` only when `auth.uid() = user_id`.
2. `Users can insert their favorites` → `INSERT` allowed only for the current user.
3. `Users can delete their favorites` → `DELETE` allowed only for the owner.
4. `Disable update on favorites` → `UPDATE` explicitly disabled.

---

### Relationships

* `auth.users.id` → `public.profiles.id` (1:1, synchronized via triggers)
* `auth.users.id` → `public.listings.user_id` (1:N, cascades on delete)
* `public.profiles.id` → `public.favorites.user_id` (1:N)
* `public.listings.id` → `public.favorites.listing_id` (N:1)

### Supabase SQL (wallet transfer)
Add this function so the app can mover saldo entre usuarios respetando RLS y marcar el anuncio como vendido (`is_active = false`):

```sql
drop function if exists public.process_vehicle_purchase(uuid, uuid, numeric, numeric);

create or replace function public.process_vehicle_purchase(
  buyer_id uuid,
  seller_id uuid,
  price numeric,
  fee_percent numeric default 5,
  listing_id uuid default null
) returns table (buyer_balance numeric, seller_balance numeric, listing_inactive boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_price numeric := coalesce(price, 0);
  v_fee numeric := greatest(coalesce(fee_percent, 0), 0);
  v_payout numeric;
  v_buyer_balance numeric;
  v_seller_balance numeric;
  v_listing_deactivated boolean := false;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if auth.uid() <> buyer_id then
    raise exception 'Caller must match buyer_id';
  end if;

  if buyer_id = seller_id then
    raise exception 'Buyer and seller cannot match';
  end if;

  if v_price <= 0 then
    raise exception 'Invalid price';
  end if;

  v_payout := v_price - (v_price * v_fee / 100);
  if v_payout < 0 then
    v_payout := 0;
  end if;

  update public.profiles
  set saldo = saldo - v_price
  where id = buyer_id
  returning saldo into v_buyer_balance;

  if not found then
    raise exception 'Buyer not found';
  end if;

  if v_buyer_balance < 0 then
    update public.profiles set saldo = saldo + v_price where id = buyer_id;
    raise exception 'Insufficient balance';
  end if;

  update public.profiles
  set saldo = saldo + v_payout
  where id = seller_id
  returning saldo into v_seller_balance;

  if not found then
    update public.profiles set saldo = saldo + v_price where id = buyer_id;
    raise exception 'Seller not found';
  end if;

  if listing_id is not null then
    update public.listings
    set is_active = false
    where id = listing_id
      and user_id = seller_id
    returning true into v_listing_deactivated;
  end if;

  return query select v_buyer_balance, v_seller_balance, v_listing_deactivated;
end;
$$;

grant execute on function public.process_vehicle_purchase(uuid, uuid, numeric, numeric, uuid) to authenticated;
```

## 8. Useful Commands
**Docker commands:**
- `docker compose build expo` – builds the Expo image based on Node 20.
- `docker compose up -d expo` – starts the container in the background.
- `docker compose exec -it expo bash` – interactive shell to run Expo or custom scripts.
- `docker compose logs -f expo` – streaming logs from the dev server.
- `docker compose down` – stop and remove the containers.

**Expo commands:**
- `npx expo start --tunnel` – starts the dev server and generates a QR code reachable from different networks.
- `npx expo start --localhost --android/ios/web` – target-specific launches from the container or host machine.

## 9. TO DO
### Sprint 1
- [x] Publish vehicles  
- [x] Vehicle detail sheet  
- [x] Profile  
- [x] Login  
- [x] User registration  
- [x] Favorites
- [x] Main feed  

### Sprint 2
- [ ] Database design, implementation and seeding increment  
- [x] Buy vehicle flow  
- [x] Text search  
- [ ] Search filters  
- [x] AI auto-fill  
- [ ] Save draft  
- [ ] Vehicle matchmaking  
- [ ] Ratings  
