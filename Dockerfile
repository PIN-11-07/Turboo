FROM node:20

WORKDIR /usr/src/expo_app

# Copia il resto dei file del progetto
COPY expo_app .

# Espone le porte del Dev Server e Metro
EXPOSE 8081-8090

# Usa lo script start definito nel package.json
CMD ["bash"]
