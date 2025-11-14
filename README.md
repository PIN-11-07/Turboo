# Turboo

## 1. Introduzione al Progetto
**Nome del progetto:** Turboo

**Scopo e funzionalità principali:** marketplace mobile per la pubblicazione e la consultazione di annunci automobilistici; gli utenti possono autenticarsi con Supabase, sfogliare il feed, pubblicare veicoli e gestire il proprio profilo.

**Stack tecnologico:**
- React Native 0.81 + React 19 tramite Expo 54
- Supabase (Auth email/password + Postgres + storage JSON per immagini)
- React Navigation 7 (bottom tab + stack nativi)
- AsyncStorage per la persistenza della sessione + plugin Expo Secure Store
- Docker (immagine Node 20) per l’ambiente di sviluppo containerizzato

**Prerequisiti generali:**
- Docker e Docker Compose installati
- Account Supabase con progetto esistente (URL + chiave anonima)
- App Expo Go su dispositivo fisico se si vuole testare tramite QR code

---

## 2. Avvio del Progetto in Locale con Docker

1. Clona il repository e entra nella cartella:
```bash
git clone https://github.com/PIN-11-07/Turboo.git
cd Turboo
```

2. Variabili d'ambiente  
Aggiungi le chiavi in `.env` (non fare commit del file):
- SUPABASE_URL
- ANON_KEY

Per recuperare le chiavi del progetto (Anon/public key) accedi al dashboard Supabase:
https://supabase.com/dashboard/project/jmkgjqutxrtrmvoeesim

3. Costruisci l'immagine Docker (installa dipendenze nel container):
```bash
docker compose build
```

4. Avvia i servizi in background:
```bash
docker compose up -d
```

5. Entra nel container `expo` per l'ambiente di sviluppo:
```bash
docker compose exec expo bash
```

6. All'interno del container:
```bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

**Variabili d’ambiente richieste:**
- `EXPO_PUBLIC_SUPABASE_URL` – URL del progetto Supabase.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` – chiave anonima con accesso pubblico alle tabelle `profiles` e `listings`.

**Come accedere all’app (URL o QR code Expo):**

2. Avviare il dev server: `npx expo start --tunnel`.
3. Aprire http://localhost:<8081-8090> per Expo DevTools oppure scansionare il QR code generato nel terminale con l’app Expo Go per eseguire la build in tempo reale.

---

## 3. Struttura del Progetto
**Albero delle cartelle principali:**
```text
Turboo/
├── Docker-compose.yml
├── Dockerfile
├── README.md
└── expo_app/
    ├── App.js
    ├── app/
    │   ├── components/
    │   │   └── PlaceHolder.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── PlaceHolder.js
    │   ├── navigation/
    │   │   ├── AppNavigator.js
    │   │   ├── AuthNavigator.js
    │   │   └── RootNavigator.js
    │   ├── pages
    │   │   ├── auth/
    │   │   │   ├── AuthNavigator.js
    │   │   │   ├── AuthStyles.js
    │   │   │   ├── components/
    │   │   │   └── screens/
    │   │   │       └── LoginScreen.js
    │   │   ├── home/
    │   │   │   ├── HomeNavigator.js
    │   │   │   ├── HomeStyles.js
    │   │   │   ├── components/
    │   │   │   └── screens/
    │   │   │       ├── HomeListingDetailScreen.js
    │   │   │       └── HomeScreen.js
    │   │   ├── profile/
    │   │   │   ├── ProfileNavigator.js
    │   │   │   ├── components/
    │   │   │   ├── profileStyles.js
    │   │   │   └── screens/
    │   │   │       ├── ProfileListingDetailScreen.js
    │   │   │       └── ProfileScreen.js
    │   │   └── publish
    │   │       ├── PublishNavigator.js
    │   │       ├── PublishStyles.js
    │   │       ├── components/
    │   │       └── screens/
    │   │           └── PublishScreen.js
    │   ├── services/
    │   │   └── PlaceHolder.js
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

**Spiegazione delle cartelle principali:**
- `app/components`: componenti UI riutilizzabili.
- `app/context`: provider globali; `AuthContext` incapsula il client Supabase e la sessione.
- `app/navigation`: configurazioni di React Navigation (`RootNavigator`, `AppNavigator`, `AuthNavigator`.
- `app/pages/<feature>`: struttura modulare per feature; ogni cartella contiene `screens`, `components` e file di stile (`FeatureStyles.js`).
- `app/services`: wrapper condivisi per chiamate o utilità lato dati (es. `placeholderService`).
- `app/theme`: token di design condivisi, come la palette cromatica.
- `app/util`: helper infrastrutturali (`supabase.js` crea il client con AsyncStorage).
- `assets`: icone, splash e favicon usati da Expo (`app.json` ne definisce l’uso).
- `Dockerfile` / `Docker-compose.yml`: definiscono il container Node/Expo e la mappa delle porte.

**Regole architetturali o convenzioni adottate:**
- Ogni feature (`auth`, `home`, `publish`, `profile`) mantiene navigator, schermate e stili dedicati sotto `app/pages/<feature>`.
- I navigator nativi vivono accanto alle feature, mentre la scelta tra stack di autenticazione e app avviene in `RootNavigator`.
- I file di stile aggregano gli StyleSheet per ridurre logica inline nelle schermate.
- Il client Supabase è centralizzato per condividere configurazioni di storage e auto-refresh dei token.

**File critici:**
- `app.json` – configurazione Expo (icone, orientamento, plugin Secure Store).
- `Dockerfile` e `Docker-compose.yml` – infrastruttura Docker per lo sviluppo Dev/Tunnel.
- `app/util/supabase.js` – inizializzazione del client e gestione della sessione.
- `app/navigation/RootNavigator.js` – punto d’ingresso della navigazione e guardia di autenticazione.

---

## 4. Funzionalità dell’Applicazione
### a) Autenticazione
- **Flusso di login/signup:** l’utente usa `LoginScreen` per autenticarsi o registrarsi con email/password; la registrazione accetta opzionalmente il nome completo e richiede conferma email.
- **Tecnologie usate:** Supabase Auth (`@supabase/supabase-js`), React Context (`AuthContext`), `expo-linear-gradient` per l’interfaccia.
- **Gestione token e persistenza:** Supabase salva sessioni e refresh token in `AsyncStorage`, abilitando `autoRefreshToken` e `persistSession`; il client evita di rilevare sessioni in URL (`detectSessionInUrl: false`).
- **Middleware o guardie:** `RootNavigator` seleziona automaticamente `AuthNavigator` (schermate di login) o `AppNavigator` (tabs principali) in base alla presenza dell’utente nel contesto.

### b) Navigazione
- **Libreria:** React Navigation 7 (`@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`).
- **Struttura dei navigator:** un `NavigationContainer` tematizzato (palette custom) avvolge `AppNavigator` (tab per Home, Publish, Profile) e i rispettivi stack dedicati (`HomeNavigator`, `PublishNavigator`, `ProfileNavigator`).
- **Regole di routing:** ogni feature ha un proprio stack con header coerenti; `Home` e `Profile` espongono schermate di dettaglio degli annunci (`ListingDetail` / `ProfileListingDetail`).
- **Deep linking:** non configurato; l’accesso avviene tramite routing interno React Navigation.

### c) Altre funzionalità chiave
#### Feed annunci (Home)
- **Descrizione:** `HomeScreen` mostra un feed di annunci attivi filtrati/tagliati via Supabase, con ricerca client-side, pull-to-refresh, endless scroll e stato di caricamento compatibile con errori.
- **Componenti principali:** `app/pages/home/screens/HomeScreen.js`, `HomeListingDetailScreen.js`, stili in `HomeStyles.js`.
- **API utilizzate:** Supabase `listings` (`select`, `eq('is_active', true)`, ordinamenti multipli e paginazione con cursore di `created_at` + `id`), `FlatList` per l’infinite scroll.
- **Limiti/note tecniche:** il feed mostra solo la prima immagine disponibile; se l’array immagini è stringificato viene normalizzato nella schermata di dettaglio.

#### Pubblicazione annunci
- **Descrizione:** `PublishScreen` offre un form validato per creare annunci (campi obbligatori, sanificazione numerica, picker per marche/combustibili/cambio) e salva su Supabase.
- **Componenti principali:** `app/pages/publish/screens/PublishScreen.js`, `PublishStyles.js`.
- **API utilizzate:** `supabase.from('listings').insert`, helper di validazione custom e selettori in memoria.
- **Limiti/note tecniche:** non c’è upload di immagini o gestione multimediale; i campi `images` devono essere gestiti manualmente (non esiste UI per caricarle).

#### Profilo e gestione annunci
- **Descrizione:** `ProfileScreen` recupera dati utente (`auth.getUser`, tabella `profiles` per l’avatar) e lista gli annunci pubblicati, permettendo la navigazione verso il dettaglio interno per ogni annuncio.
- **Componenti principali:** `app/pages/profile/screens/ProfileScreen.js`, `ProfileListingDetailScreen.js`, `profileStyles.js`.
- **API utilizzate:** Supabase `profiles` (avatar) e `listings` filtrati per `user_id`, oltre a Supabase Auth per ottenere metadata (nome, email).
- **Limiti/note tecniche:** assenza di editing del profilo e di gestione immagini dal client; il logout invoca direttamente `supabase.auth.signOut`.

---

## 5. Struttura del Database
**Elenco delle tabelle:**
- `auth.users` (gestita da Supabase, contiene credenziali e metadata)
- `public.listings`
- `public.profiles`

**Tabella `public.listings`:**
| Campo | Tipo (Supabase) | Descrizione |
| --- | --- | --- |
| `id` | `uuid` PK | Identificativo dell’annuncio. |
| `user_id` | `uuid` FK | Riferimento a `auth.users.id`, proprietario dell’annuncio. |
| `title` | `text` | Titolo commerciale mostrato nel feed. |
| `description` | `text` | Descrizione estesa del veicolo. |
| `price` | `numeric` | Prezzo in euro; viene formattato lato client. |
| `make` | `text` | Marca (valori da `MAKE_OPTIONS`). |
| `model` | `text` | Modello specifico. |
| `year` | `int4` | Anno del veicolo. |
| `mileage` | `int4` | Chilometraggio totale. |
| `fuel_type` | `text` | Tipo di carburante (es. `Gasolina`, `Diesel`). |
| `transmission` | `text` | Cambio (Manual, Automatica, ecc.). |
| `doors` | `int2` | Numero di porte. |
| `color` | `text` | Colore dichiarato. |
| `location` | `text` | Città o provincia dell’annuncio. |
| `images` | `jsonb` | Array di URL/URI delle immagini; può arrivare come JSON stringificato. |
| `is_active` | `boolean` | Flag per rendere l’annuncio visibile nel feed. |
| `created_at` | `timestamptz` | Timestamp di creazione usato per l’ordinamento/paginazione. |

**Tabella `public.profiles`:**
| Campo | Tipo (Supabase) | Descrizione |
| --- | --- | --- |
| `id` | `uuid` PK | Allineato con `auth.users.id`. |
| `profile_image_url` | `text` | URL opzionale dell’avatar mostrato in `ProfileScreen`. |

**Relazioni:**
- `listings.user_id` → `auth.users.id` (relazione 1:N, un utente può avere più annunci).
- `profiles.id` ↔ `auth.users.id` (relazione 1:1 per informazioni aggiuntive sull’utente).
- `profiles.id` ↔ `listings.user_id` (relazione 1:N indiretta, usata per mostrare i propri annunci).

**Diagramma ER:**

**Collegamenti DB → feature dell’app:**
- `listings` alimenta il feed Home, i dettagli degli annunci e la lista nel profilo.
- `profiles` fornisce gli avatar nella schermata Profilo.
- `auth.users` è usato per autenticazione, estrazione del nome completo e email.

Link per le chiavi del progetto Supabase (anon/public key):  
https://supabase.com/dashboard/project/jmkgjqutxrtrmvoeesim  (Project → Settings → API)

---

## 6. Comandi Utili
**Comandi Docker:**
- `docker compose build expo` – build dell’immagine Expo basata su Node 20.
- `docker compose up -d expo` – avvio del container in background.
- `docker compose exec -it expo bash` – shell interattiva per lanciare Expo o altri script.
- `docker compose logs -f expo` – log in streaming del dev server.
- `docker compose down` – arresto e rimozione dei container.

**Comandi Expo:**
- `npx expo start --tunnel` – avvia il dev server e genera il QR code accessibile anche da reti diverse.
- `npx expo start --localhost --android/ios/web` – avvio mirato verso il target desiderato dal container o dalla macchina host.

**Script npm rilevanti (`expo_app/package.json`):**
- `npm run start` – alias di `expo start`.
- `npm run android` – avvia Metro e lancia l’app su un emulatore/dispositivo Android.
- `npm run ios` – avvia l’app su simulatore iOS.
- `npm run web` – esegue la build web via Expo.

**Comandi di migrazione DB:**

