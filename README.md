# Ambiente di sviluppo

## Requisiti
- Docker Desktop (macOS/Windows) o Docker Engine (Linux)
- Git
- Node.js (se esegui in locale senza Docker)
- Expo Go (app mobile per test)

## Struttura del progetto
Radice principale del progetto e file/significato:

```
expo_app/
├─ App.js            — Punto d'ingresso; configura navigazione e provider globali
├─ app/
|   ├─ components/   — Componenti riutilizzabili (Button, Card, Header, ecc.)
|   ├─ context/      — Provider e contesti (es. AuthContext)
|   ├─ hooks/        — Hook personalizzati (useAuth, useFetch, ...)
|   ├─ lib/          — Librerie interne e integrazioni (es. client Supabase)
|   ├─ services/     — Logica per chiamate API e integrazioni backend
|   ├─ utils/        — Funzioni di utilità e helper
|   ├─ screens/      — Schermate principali (Home, Login, Profile, ...)
|   ├─ navigation/   — Configurazioni di routing (React Navigation)
|   └─ config/       — Costanti e configurazioni specifiche
├─ app.json          — Configurazione Expo
├─ .env              — Variabili d'ambiente (NON committare)
├─ assets/           — Immagini, icone, font
├─ index.js          — Bootstrap dell'app per Expo
└─ package.json      — Dipendenze e script
```

## Avvio rapido (sviluppo locale)

1. Clona la repository e entra nella cartella:
```bash
git clone https://github.com/PIN-11-07/Turboo.git
cd Turboo
```

2. Costruisci l'immagine Docker (installa dipendenze nel container):
```bash
docker compose build
```

3. Avvia i servizi in background:
```bash
docker compose up -d
```

4. Entra nel container `expo` per l'ambiente di sviluppo:
```bash
docker compose exec expo bash
```
All'interno del container:
```bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

5. Apri Expo Go sul dispositivo mobile e scansiona il QR code mostrato da `expo start`.

Nota: il flag `--tunnel` utilizza ngrok per esporre un URL pubblico, utile per testare da reti differenti.

## Variabili d'ambiente
Aggiungi le chiavi in `.env` (non committare il file nel VCS):
- SUPABASE_URL
- ANON_KEY


# Autenticazione

## Librerie
- @supabase/supabase-js
- @react-native-async-storage/async-storage (persistenza sessione)

## Client Supabase
- File: `app/lib/supabase.js`
- Usa variabili d’ambiente e AsyncStorage per salvare/ripristinare la sessione.

## AuthContext
- File: `app/context/AuthContext.js`
- Gestisce `user` e `session`
- Espone `signIn`, `signUp`, `signOut`
- Sottoscrizione agli eventi di Supabase e ripristino sessione via AsyncStorage

## Integrazione nell’app
- In `App.js`, l’app è avvolta da `<AuthProvider>` per stato auth globale.
- La navigazione mostra Home se autenticato, altrimenti Login.

## Schermata di login
- `LoginScreen`: registrazione e accesso via email/password.


# Navigazione

## Struttura generale
1. RootNavigator → decide se mostrare area pubblica o privata
2. AuthNavigator → schermate pubbliche (Login)
3. AppNavigator → schermate private (Home, Profile, Settings)

Snippet decisionale:
```js
{user ? <AppNavigator /> : <AuthNavigator />}
```

## Struttura cartelle navigazione
```
app/
├── navigation/
│   ├── AuthNavigator.js        # Stack pubblico (Login, Signup)
│   ├── AppNavigator.js         # Navigatore privato (Home, Profilo, Settings)
│   └── RootNavigator.js        # Router principale
├── screens/
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── ProfileScreen.js
│   └── SettingsScreen.js
└── App.js                      # Punto d’ingresso con AuthProvider
```

## Dettagli navigatori
- RootNavigator: mostra `AuthNavigator` se `user` è null, altrimenti `AppNavigator`.
- AuthNavigator: Stack senza header (`headerShown: false`), contiene Login.
- AppNavigator: Bottom Tab con `HomeScreen`, `ProfileScreen`, `SettingsScreen`. Accesso a `useAuth`.

## Ingresso app
- `App.js` avvolge tutto:
```js
<AuthProvider>
  <RootNavigator />
</AuthProvider>
```

## Flusso di navigazione
1. All’avvio, `AuthContext` recupera la sessione (AsyncStorage).
2. `RootNavigator` controlla `user`:
   - Se assente → `AuthNavigator` → `LoginScreen`
   - Se presente → `AppNavigator` → `HomeScreen`
3. Dopo `signIn()`, `user` cambia → passaggio automatico all’area privata.
4. Da `ProfileScreen`, `signOut()` → `user` null → ritorno a `LoginScreen`.


# 🧩 Tabella `listings`

La tabella `listings` rappresenta la **struttura dati principale** dell’applicazione e contiene tutti gli annunci di automobili pubblicati dagli utenti.
Ogni riga corrisponde a **un veicolo messo in vendita**, con i relativi dettagli tecnici, informazioni di localizzazione e metadati di pubblicazione.

---

### 🏗 Struttura

| Campo            | Tipo                              | Descrizione                                                                                                                               |
| ---------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **id**           | `uuid` *(PK)*                     | Identificatore univoco generato automaticamente (`gen_random_uuid()`).                                                                    |
| **user_id**      | `uuid` *(FK → auth.users.id)*     | Identificativo dell’utente proprietario dell’annuncio. È una chiave esterna che collega l’annuncio al sistema di autenticazione Supabase. |
| **title**        | `text`                            | Titolo breve dell’annuncio (es. “Fiat Panda 1.2 Easy”).                                                                                   |
| **description**  | `text`                            | Descrizione estesa del veicolo.                                                                                                           |
| **price**        | `numeric(12,2)`                   | Prezzo richiesto in euro. Controllato con vincolo `CHECK (price >= 0)`.                                                                   |
| **make**         | `text`                            | Marca del veicolo (es. Fiat, BMW, Tesla).                                                                                                 |
| **model**        | `text`                            | Modello specifico del veicolo.                                                                                                            |
| **year**         | `int`                             | Anno di immatricolazione, con vincolo di validità tra 1900 e l’anno corrente +1.                                                          |
| **mileage**      | `int`                             | Chilometraggio (km). Deve essere non negativo.                                                                                            |
| **fuel_type**    | `text`                            | Tipo di alimentazione (es. “Benzina”, “Diesel”, “Ibrida”, “Elettrica”).                                                                   |
| **transmission** | `text`                            | Tipo di cambio (es. “Manuale”, “Automatica”).                                                                                             |
| **doors**        | `int`                             | Numero di porte.                                                                                                                          |
| **color**        | `text`                            | Colore esterno del veicolo.                                                                                                               |
| **images**       | `jsonb`                           | Array JSON di URL pubblici alle immagini del veicolo, salvate nel bucket Supabase `listing-images`.                                       |
| **location**     | `text`                            | Città o zona geografica in cui si trova il veicolo.                                                                                       |
| **is_active**    | `boolean` *(default `true`)*      | Flag che indica se l’annuncio è pubblicato e visibile nel feed pubblico.                                                                  |
| **created_at**   | `timestamptz` *(default `now()`)* | Timestamp di creazione dell’annuncio, utilizzato anche per l’ordinamento cronologico nel feed.                                            |

---

### 🔐 Sicurezza e policy (RLS)

La tabella utilizza **Row Level Security (RLS)** per garantire che ogni utente possa gestire solo i propri annunci.
Le policy attive sono le seguenti:

| Nome policy              | Azione   | Regola                                                                                                        |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| **Read active listings** | `SELECT` | Consente a chiunque (pubblico) di leggere solo gli annunci dove `is_active = true`.                           |
| **Insert own listing**   | `INSERT` | Permette l’inserimento solo se `auth.uid() = user_id`, quindi un utente può creare soltanto i propri annunci. |
| **Update own listing**   | `UPDATE` | Permette la modifica solo se l’annuncio appartiene all’utente loggato (`auth.uid() = user_id`).               |
| **Delete own listing**   | `DELETE` | Permette la cancellazione solo se l’annuncio appartiene all’utente loggato (`auth.uid() = user_id`).          |

➡️  In questo modo:

* Gli utenti **autenticati** possono creare, modificare o eliminare **solo i propri** annunci.
* Tutti (anche non loggati) possono **visualizzare** gli annunci pubblici (`is_active = true`).

---

### ⚡️ Indici e performance

Per ottimizzare il caricamento del feed (ordinato per data decrescente), è presente un indice composito:

```sql
create index listings_is_active_created_id_desc
  on public.listings (is_active, created_at desc, id desc);
```

Questo indice:

* velocizza la paginazione basata su `created_at` + `id` (keyset pagination);
* migliora le performance delle query usate nel feed infinito.

---

### 🖼 Storage delle immagini

Le immagini dei veicoli sono salvate nel bucket pubblico **`listing-images`** del modulo Supabase Storage.
Le policy del bucket sono configurate in modo che:

* **chiunque** possa leggere (`SELECT`) gli oggetti, rendendo gli URL pubblicamente accessibili;
* **solo gli utenti autenticati** possano caricare (`INSERT`) nuovi file.

Ogni immagine è referenziata nel campo `images` della tabella come array JSON di stringhe (esempio):

```json
[
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda.jpg",
  "https://<project>.supabase.co/storage/v1/object/public/listing-images/panda_interni.jpg"
]
```

---

### 🔄 Utilizzo nel feed dell’app

Il feed principale dell’app Expo carica i dati da questa tabella utilizzando Supabase Client SDK.
Le query principali:

* **prima pagina:**

  ```ts
  .from('listings')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .order('id', { ascending: false })
  .limit(PAGE_SIZE)
  ```
* **paginazione (keyset):**

  ```ts
  .or(`and(created_at.eq.${cursor.created_at},id.lt.${cursor.id}),created_at.lt.${cursor.created_at}`)
  ```

L’ordinamento su `created_at DESC, id DESC` garantisce un feed **infinito, stabile e coerente**.

---

### 📦 Relazioni

* `user_id` → `auth.users.id`
  Collega ogni annuncio all’utente autenticato che lo ha pubblicato.
* Relazioni future possibili:

  * `favorites` o `saved_listings` per salvare auto nei preferiti;
  * `messages` per chat tra venditore e acquirente.

---

### 🧠 Riassunto tecnico

| Proprietà                       | Valore                                  |
| ------------------------------- | --------------------------------------- |
| **Tabella**                     | `public.listings`                       |
| **PK**                          | `id`                                    |
| **FK**                          | `user_id → auth.users.id`               |
| **RLS**                         | Attiva                                  |
| **Accesso pubblico in lettura** | Sì (`is_active = true`)                 |
| **Accesso in scrittura**        | Solo owner autenticato                  |
| **Immagini**                    | Bucket pubblico `listing-images`        |
| **Feed sorting**                | `ORDER BY created_at DESC, id DESC`     |
| **Pagination**                  | Keyset (cursor-based)                   |
| **Indice**                      | `(is_active, created_at DESC, id DESC)` |

