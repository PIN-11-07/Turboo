
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
|   ├─ context/      — Provider e contesti (es. AuthContext)
|   ├─ lib/          — Librerie interne e integrazioni (es. client Supabase)
|   ├─ services/     — Logica per chiamate API e integrazioni backend
|   ├─ screens/      — Schermate principali (Home, Login, Profile, ...)
|   └─ navigation/   — Configurazioni di routing (React Navigation)
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

## Autenticazione con Supabase
- Librerie installate:
    - @supabase/supabase-js
    - @react-native-async-storage/async-storage (salvataggio sessione sul dispositivo)
- Client Supabase:
    - Creato in `app/lib/supabase.js` usando le variabili d'ambiente.
    - È configurato per salvare/ripristinare la sessione tramite AsyncStorage.
- AuthContext:
    - Definito in `app/context/AuthContext.js`.
    - Tiene traccia di sessione e user; espone metodi per login, register e logout.
    - Si sottoscrive ai cambiamenti di sessione e aggiorna lo stato automaticamente.
- Integrazione:
    - In `App.js` l'app è avvolta da `<AuthProvider>` per rendere lo stato auth accessibile globalmente.
    - La navigazione mostra la schermata Home se l'utente è autenticato, altrimenti la Login.

## Schermata di login
- LoginScreen: registrazione e accesso via email/password.

## 🧭 Struttura generale della navigazione

1. **RootNavigator** → decide quale parte dell’app mostrare (login o area privata)
2. **AuthNavigator** → gestisce le schermate pubbliche (login, signup)
3. **AppNavigator** → gestisce le schermate private accessibili dopo il login

---

## 🗂️ Struttura delle cartelle per la navigazione

```
app/
├── navigation/
│   ├── AuthNavigator.js        # Stack pubblico (Login, Signup)
│   ├── AppNavigator.js         # Navigatore privato (Home, Profilo, Settings)
│   └── RootNavigator.js        # Router principale che decide quale usare
├── screens/
│   ├── LoginScreen.js          # Schermata di accesso
│   ├── HomeScreen.js           # Pagina principale post-login
│   ├── ProfileScreen.js        # Pagina profilo utente con logout
│   └── SettingsScreen.js       # Impostazioni utente
└── App.js                      # Punto d’ingresso, avvolge tutto con AuthProvider
```

---

## ⚙️ Funzionamento logico

### 1. `AuthContext`

Il contesto centralizza la logica di autenticazione Supabase:

* Tiene traccia di `user` e `session`
* Espone funzioni `signIn`, `signUp`, `signOut`
* Si sottoscrive automaticamente agli eventi di login/logout di Supabase
* Ripristina la sessione salvata con `AsyncStorage` (quindi il login persiste tra riavvii)

➡️ Grazie a questo, lo stato dell’utente (`user`) è disponibile globalmente.

---

### 2. `RootNavigator`

È il **router principale** dell’app.
Decide quale navigatore mostrare in base allo stato `user` del contesto:

```js
{user ? <AppNavigator /> : <AuthNavigator />}
```

* Se `user` è `null` → l’utente **non è autenticato**, quindi mostra il `AuthNavigator`
* Se `user` è valorizzato → l’utente **è autenticato**, quindi mostra il `AppNavigator`

Questo avviene automaticamente ogni volta che cambia la sessione Supabase.

---

### 3. `AuthNavigator`

È un **Stack Navigator** che contiene le schermate pubbliche:

```js
LoginScreen
```

* Usa `createNativeStackNavigator`
* Nessuna `header bar` (disattivata con `headerShown: false`)

---

### 4. `AppNavigator`

È il **navigatore privato**.
Implementa un **Bottom Tab Navigator**:

```js
HomeScreen
ProfileScreen
SettingsScreen
```

* Usa `@react-navigation/bottom-tabs`
* Mostra una barra inferiore con le tre schermate principali
* Ogni schermata può accedere al contesto utente (`useAuth`) per mostrare dati o gestire il logout

---

### 5. `App.js`

È il punto d’ingresso dell’app.
Avvolge tutto con il provider di autenticazione e il navigatore principale:

```js
<AuthProvider>
  <RootNavigator />
</AuthProvider>
```

In questo modo, **tutta la navigazione è consapevole dello stato di login**.

---

## 🔄 Flusso di navigazione completo

1. All’avvio, `AuthContext` recupera la sessione Supabase (se presente in AsyncStorage).
2. `RootNavigator` controlla `user`:

   * Se non esiste → mostra `AuthNavigator` → `LoginScreen`
   * Se esiste → mostra `AppNavigator` → `HomeScreen`
3. Dopo il login (`signIn()`), Supabase aggiorna la sessione → `user` cambia → `RootNavigator` mostra automaticamente l’area privata.
4. Da `ProfileScreen`, l’utente può fare `signOut()` → `user` diventa `null` → l’app torna automaticamente al `LoginScreen`.

