FROM node:16 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances avec l'option --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier tout le reste du code source
COPY . .

# Construire l'application pour la production
RUN npm run build --prod

# Étape 2 : Créer l'image finale avec l'application Angular prête à être servie
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire public de nginx
COPY --from=build /app/dist/* /usr/share/nginx/html

# Exposer le port 80 (port par défaut pour nginx)
EXPOSE 80

# Démarrer nginx
CMD ["nginx", "-g", "daemon off;"]
