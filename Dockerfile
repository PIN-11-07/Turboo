# ================================
# Dockerfile per Expo + Supabase
# Modalità tunnel (ngrok)
# Compatibile con macOS M1/M2, Windows e Linux
# ================================

# Usa un'immagine Node stabile e compatibile ARM
FROM node:20-bookworm

# Imposta la working directory
WORKDIR /usr/src/expo_app

# Installa strumenti di base
RUN apt-get update && apt-get install -y \
  git \
  curl \
  && rm -rf /var/lib/apt/lists/*

# Copia il codice del progetto (cartella app)
COPY ./expo_app /usr/src/expo_app

# Espone le porte usate da Expo e Metro
EXPOSE 8081

# Variabili d’ambiente base
ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV EXPO_USE_DEV_SERVER=true

# Avvia bash
CMD [ "bash" ]
