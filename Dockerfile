# ================================
# Dockerfile per Expo + Supabase
# Modalità tunnel (ngrok)
# Compatibile con macOS M1/M2, Windows e Linux
# ================================

# Usa un'immagine Node stabile e compatibile ARM
FROM node:20-bullseye

# Imposta la working directory
WORKDIR /usr/src/app

# Installa strumenti di base
RUN apt-get update && apt-get install -y \
  git \
  curl \
  watchman \
  && rm -rf /var/lib/apt/lists/*

# Installa Expo CLI e ngrok globalmente
RUN npm install -g expo

# Copia il codice del progetto (cartella app)
COPY ./app /usr/src/app

# Installa le dipendenze del progetto
RUN npm install

# Espone le porte usate da Expo e Metro
EXPOSE 19000 19001 19002 8081

# Variabili d’ambiente base
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_USE_DEV_SERVER=true

# Avvia Expo in modalità tunnel (funziona anche se non sei sulla stessa rete)
CMD ["npx", "expo", "start", "--tunnel"]
