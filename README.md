
# Turboo — Ambiente di sviluppo Expo + Supabase (Docker + Tunnel)

## Cosa c'è in questa repo

- Dockerfile e docker-compose per costruire un container di sviluppo con Node, Expo e dipendenze del progetto.
- Cartella `app/` con l'app Expo (TypeScript + React Native).

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
├── Dockerfile
├── docker-compose.yml
└── app/           # codice dell'app Expo
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
docker compose exec expo sh
```
Dentro il container (prompt):
```bash
npx expo start --tunnel --dev-client
```

5) Apri Expo Go sul telefono e scansiona il QR code mostrato dal processo `expo start`.

Nota: il flag `--tunnel` usa ngrok per creare un URL pubblico. Questo ti permette di connetterti anche da reti diverse.
