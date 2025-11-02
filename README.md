
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
turboo/
├── Dockerfile           # Dockerfile per l'immagine di sviluppo (Node + Expo)
├── docker-compose.yml   # Definisce i servizi di sviluppo (expo, db, ecc.)
└── expo_app/            # Codice sorgente dell'app Expo (JavaScript + React Native)
	├── components/      # Componenti UI riutilizzabili (bottoni, card, layout)
	├── context/         # Context e provider React per stato globale (Auth, Theme, ecc.)
	├── hooks/           # Custom hooks riutilizzabili (useAuth, useFetch, ecc.)
	├── lib/             # Librerie e configurazioni di basso livello (es. `supabase.js`)
	├── services/        # Integrazione con API esterne e logica di rete
	└──  utils/           # Helper e funzioni utilitarie (formati, validazioni)
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

Nota: il flag `--tunnel` usa ngrok per creare un URL pubblico. Questo ti permette di connetterti anche da reti diverse.
