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

