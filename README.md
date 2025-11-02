
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

## Schermate principali
- LoginScreen: registrazione e accesso via email/password.
- HomeScreen: visualizza l'email dell'utente e consente il logout.
