
# Ambiente di sviluppo Expo + Supabase (Docker + Tunnel)

Questo progetto utilizza **Docker** per creare un ambiente di sviluppo identico su **macOS**, **Windows** e **Linux**, con **Expo (React Native)** e **Supabase**.

L’app viene eseguita in modalità **tunnel** grazie a **ngrok**, così puoi testarla su **Expo Go** anche se il tuo telefono non è sulla stessa rete del computer.

---

## 🧩 Prerequisiti

Assicurati di avere installato sul tuo sistema:

| Software                                                              | Versione minima            | Download                                                                                         |
| --------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Docker Desktop** (macOS / Windows) oppure **Docker Engine** (Linux) | 4.x o superiore            | [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop) |
| **Git**                                                               | Qualsiasi versione recente | [https://git-scm.com/downloads](https://git-scm.com/downloads)                                   |

> 💡 **macOS M1/M2**: non serve configurare nulla, Docker rileva automaticamente l’architettura ARM64.
> 💡 **Windows**: assicurati che Docker Desktop usi la **modalità WSL2** (Impostazioni → General → “Use the WSL 2 based engine”).
> 💡 **Linux**: aggiungi il tuo utente al gruppo `docker` per evitare di usare `sudo`.

---

## 📁 Struttura del progetto

```
turboo/
├── Dockerfile
├── docker-compose.yml
├── .gitignore
└── app/
    └── ...
```

---

## ⚙️ Clonare il progetto

Apri un terminale:

```bash
git clone https://github.com/<organizzazione>/<nome-repo>.git
cd <nome-repo>
```

---

## 🐋 Costruire l’ambiente Docker

Costruisci l’immagine con tutti i pacchetti necessari (Expo, ngrok, Supabase):

```bash
docker compose build
```

> 🔧 Questo comando crea un container basato su Node.js e installa automaticamente:
>
> * `expo-cli`
> * `@expo/ngrok` verrà installato automaticamente da Expo quando usi expo start --tunnel
> * le dipendenze del tuo progetto (`package.json`)

---

## 🚀 Avviare l’ambiente di sviluppo

Avvia Expo in modalità **tunnel**:

```bash
docker compose up
```

Aspetta che compaia qualcosa come:

```
› Metro waiting on exp://<ngrok-id>.tcp.ngrok.io
› Opening DevTools in your browser...
```

📱 Poi:

1. Apri **Expo Go** sul tuo telefono.
2. Scansiona il **QR code** mostrato nel terminale.
3. L’app si aprirà automaticamente! 🎉

> Il tunnel ngrok funziona anche se il telefono è su una rete diversa dal tuo computer.

---

## 🧰 Comandi utili

| Azione                          | Comando                           |
| ------------------------------- | --------------------------------- |
| Avvia il container              | `docker compose up`               |
| Ricostruisci l’immagine         | `docker compose build --no-cache` |
| Entra nel container (bash)      | `docker compose exec expo bash`   |
| Ferma tutto                     | `docker compose down`             |
| Visualizza i log in tempo reale | `docker compose logs -f`          |

---

## ⚠️ 7. Risoluzione problemi comuni

### ❌ “Unknown error: bad URL (exp://0.0.0.0:8081)”

→ Stai usando la modalità LAN. In Docker devi usare **tunnel**.
Verifica che nel Dockerfile il comando finale sia:

```bash
npx expo start --tunnel --dev-client
```

---

### ❌ Expo Go non si connette

* Assicurati che **@expo/ngrok** sia installato (già incluso nel Dockerfile).
* Ricostruisci l’immagine se necessario:

  ```bash
  docker compose build --no-cache
  ```
* Controlla che Docker non sia bloccato da un firewall o VPN.

---

## 🧼 8. Pulizia (opzionale)

Per liberare spazio o ripartire da zero:

```bash
docker compose down --volumes
docker system prune -f
```

---

## ✅ In sintesi

Ogni membro del team può semplicemente eseguire:

```bash
git clone https://github.com/<organizzazione>/<nome-repo>.git
cd <nome-repo>
docker compose up
```

e in pochi minuti avrà l’app Expo funzionante con tunnel ngrok, **senza configurazioni manuali**, su qualsiasi sistema operativo 💥
