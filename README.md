
# Ambiente di sviluppo

## Requisiti

- Docker Desktop (macOS/Windows) o Docker Engine (Linux) — versione consigliata: 4.x o superiore
- Git

Note utili:
- macOS M1/M2: Docker Desktop supporta ARM64; non sono necessarie configurazioni speciali nella maggior parte dei casi.
- Windows: usa WSL2 nelle impostazioni di Docker Desktop.
- Linux: aggiungi il tuo utente al gruppo `docker` per evitare `sudo`.

## Struttura principale

```
expo_app/
├─ App.js            — Punto d'ingresso dell'app; configura navigazione e layout globale
├─ app/
|   ├─ components/   — Componenti riutilizzabili (bottoni, card, header, ecc.)
|   ├─ context/      — Provider e contesti per stato globale (React Context)
|   ├─ hooks/        — Hook personalizzati (es. useAuth, useFetch)
|   ├─ lib/          — Librerie interne e integrazioni (config, adapter)
|   ├─ services/     — Moduli per chiamate API e logica di backend
|   ├─ utils/        — Funzioni di utilità pure e helper
|   ├─ screens/      — Schermate principali dell'app (es. Home, Profile, Settings)
|   ├─ navigation/   — Navigatori e configurazioni di routing (React Navigation)
|   └─ config/       — Configurazioni e costanti specifiche dell'app
├─ app.json          — Configurazione Expo e metadati dell'app
├─ .env              — Variabili d'ambiente
├─ assets/           — Risorse statiche: immagini, icone, font
├─ index.js          — Bootstrap dell'app (registro dell'app per Expo)
└─ package.json      — Dipendenze, script e metadata del progetto
```

## Quick start (sviluppo locale)

1) Clona la repo e entra nella cartella:

```bash
git clone https://github.com/PIN-11-07/Turboo.git
cd Turboo
```

2) Costruisci l'immagine Docker (installa le dipendenze nel container):

```bash
docker compose build
```

3) Avvia i servizi in background:

```bash
docker compose up -d
```

4) Entra nel container `expo` per avviare lo script di sviluppo. Esegui il comando interattivo e poi lancia Expo:

```bash
docker compose exec expo bash
```
Dentro il container (prompt):
```bash
npm i
apt-get update -y && apt-get upgrade -y
npx expo start --tunnel
```

5) Apri Expo Go sul telefono e scansiona il QR code mostrato dal processo `expo start`.

Nota: il flag └── tunnel` usa ngrok per creare un URL pubblico. Questo ti permette di connetterti anche da reti diverse.
