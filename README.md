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

---

## 2. Run the Project Locally with Docker

1.  Clone the repository and enter the folder:

``` bash
git clone https://github.com/PIN-11-07/Turboo.git
cd Turboo
```

2.  Environment variables\
    Add the keys to `.env` (do not commit this file):

-   SUPABASE_URL
-   ANON_KEY

3.  Build the Docker image:

``` bash
docker compose build
```

4.  Start the services:

``` bash
docker compose up -d
```

5.  Enter the `expo` container:

``` bash
docker compose exec expo bash
```

6.  Inside the container:

``` bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

---

## 3. Project Structure
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
    │   │   │   └── screens/
    │   │   │       └── LoginScreen.js
    │   │   ├── home/
    │   │   │   ├── HomeNavigator.js
    │   │   │   ├── HomeStyles.js
    │   │   │   └── screens/
    │   │   │       └── HomeScreen.js
    │   │   ├── listingDetails/
    │   │   │   ├── ListingDetailStyles.js
    │   │   │   └── screens/
    │   │   │       └── ListingDetailScreen.js
    │   │   ├── profile/
    │   │   │   ├── ProfileNavigator.js
    │   │   │   ├── profileStyles.js
    │   │   │   └── screens/
    │   │   │       └── ProfileScreen.js
    │   │   └── publish
    │   │       ├── PublishNavigator.js
    │   │       ├── PublishStyles.js
    │   │       └── screens/
    │   │           └── PublishScreen.js
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

---

## 4. Application Features

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
- **Main components:** `app/pages/home/screens/HomeScreen.js`, `app/pages/listingDetails/screens/ListingDetailScreen.js`, styles in `HomeStyles.js` + `ListingDetailStyles.js`.
- **APIs used:** Supabase `listings` (`select`, `eq('is_active', true)`, sorting/pagination with `created_at` + `id` cursors) and `FlatList` for infinite scroll.
- **Limitations/notes:** the feed shows only the first available image; if the images array is stringified it gets normalized in the detail screen.

## d) Listing publication
- **Description:** `PublishScreen` offers a validated form for creating listings (required fields, numeric sanitization, brand/fuel/transmission pickers) and writes them to Supabase.
- **Main components:** `app/pages/publish/screens/PublishScreen.js`, `PublishStyles.js`.
- **APIs used:** `supabase.from('listings').insert`, custom validation helpers and in-memory selectors.
- **Limitations/notes:** there is no media upload; the `images` field must be maintained manually (there is no UI to upload pictures).

### e) Profile and listing management
- **Description:** `ProfileScreen` fetches user data (`auth.getUser`, `profiles` table for avatars) and lists published listings, allowing navigation to the shared detail screen.
- **Main components:** `app/pages/profile/screens/ProfileScreen.js`, `app/pages/listingDetails/screens/ListingDetailScreen.js`, `profileStyles.js`.
- **APIs used:** Supabase `profiles` (avatar) and `listings` filtered by `user_id`, plus Supabase Auth to fetch metadata (name, email).
- **Limitations/notes:** no profile editing or media management on the client. Logging out calls `supabase.auth.signOut` directly.

### f) Favorites
- **Description:** Users can mark any listing with a heart icon from the feed, detail views or the *Tus favoritos* section; the choice is stored in the `public.favorites` table and follows the user across sessions.
- **UX details:** buttons show a spinner while the Supabase mutation runs, disable automatically when the session is missing and stay in sync when navigating between tabs.
- **Data flow:** all screens rely on a shared cache that mirrors `favorites` so toggling one heart immediately updates the other mounted buttons without extra API calls.

---

## 5. Components
### FavoriteButton (`app/components/FavoriteButton.js`)
- **Responsibility:** renders the heart icon, loads the initial favorite status, sends Supabase mutations (`insert`/`delete`) and handles optimistic updates while keeping errors isolated per button.
- **Shared cache:** keeps a `Map` keyed by listing + user; listeners subscribe/unsubscribe so every mounted button reacts instantly to status changes.
- **Variants & props:** `variant="detail\" | "overlay\" | "list\"` tweaks layout to match each screen; `initialIsFavorite`, `fetchOnMount`, `onStatusChange`, `hitSlop` and style overrides cover more advanced cases (e.g., removing an item from *Tus favoritos* when it gets unhearted).

---

## 6. Database Structure

### Tables

-   auth.users
-   public.listings
-   public.profiles
-   public.favorites

------------------------------------------------------------------------

### public.listings

  Field          Type                      Description
  -------------- ------------------------- -----------------------
  id             uuid PK                   Listing identifier
  user_id        uuid FK → auth.users.id   Owner
  title          text                      Title
  description    text                      Description
  price          numeric(12,2)             ≥ 0
  make           text                      Brand
  model          text                      Model
  year           int4                      1900 → current_year+1
  mileage        int4                      ≥ 0
  fuel_type      text                      Fuel type
  transmission   text                      Transmission
  doors          int4                      Doors
  color          text                      Color
  location       text                      Location
  images         jsonb                     Array of URLs
  is_active      boolean                   Visibility flag
  created_at     timestamptz               Timestamp

**RLS:**\
- Select allowed only when is_active = true\
- Insert / update / delete: only owner (auth.uid() = user_id)

------------------------------------------------------------------------

### public.profiles

  Field               Type      Description
  ------------------- --------- -----------------------
  id                  uuid PK   Mirrors auth.users.id
  full_name           text      Synced from metadata
  profile_image_url   text      Avatar

**Triggers:**\
- Create profile on user creation\
- Sync full_name on metadata update

**RLS:**\
- Users can view/update only their own profile

------------------------------------------------------------------------

### public.favorites

  Field        Type                    Description
  ------------ ----------------------- -------------------
  id           bigint PK               Internal id
  user_id      uuid FK → profiles.id   User
  listing_id   uuid FK → listings.id   Favorited listing
  created_at   timestamptz             Timestamp

**Properties:**\
- unique(user_id, listing_id)\
- Cascades on delete\
- RLS: users can select/insert/delete only their own favorites; update
disabled

------------------------------------------------------------------------

## Relationships

-   auth.users.id → profiles.id (1:1)\
-   auth.users.id → listings.user_id (1:N)\
-   profiles.id → favorites.user_id (1:N)\
-   listings.id → favorites.listing_id (N:1)

---

## 7. Useful Commands
**Docker commands:**
- `docker compose build expo` – builds the Expo image based on Node 20.
- `docker compose up -d expo` – starts the container in the background.
- `docker compose exec -it expo bash` – interactive shell to run Expo or custom scripts.
- `docker compose logs -f expo` – streaming logs from the dev server.
- `docker compose down` – stop and remove the containers.

**Expo commands:**
- `npx expo start --tunnel` – starts the dev server and generates a QR code reachable from different networks.
- `npx expo start --localhost --android/ios/web` – target-specific launches from the container or host machine.

**Relevant npm scripts (`expo_app/package.json`):**
- `npm run start` – alias for `expo start`.
- `npm run android` – starts Metro and launches the app on an Android emulator/device.
- `npm run ios` – launches the app on the iOS simulator.
- `npm run web` – runs the Expo web build.

**Database migration commands:**

---

## 8. TO DO
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
- [ ] Buy vehicle flow  
- [x] Text search  
- [ ] Search filters  
- [ ] AI auto-fill  
- [ ] Save draft  
- [ ] Vehicle matchmaking  
- [ ] Ratings  
