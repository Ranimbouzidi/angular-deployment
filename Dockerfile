# Étape 1 : Build l'application Angular
FROM node:16 AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances Node.js (cela va créer un dossier node_modules)
RUN npm install

# Copier tout le reste du code source (ton projet Angular)
COPY . .

# Construire l'application Angular pour la production (cela génère dist/nobleui-angular)
RUN npm run build --prod

# Étape 2 : Créer l'image finale avec l'application prête à être servie via nginx
FROM nginx:alpine

# Copier les fichiers construits depuis l'étape 1 vers le dossier public de nginx
COPY --from=build /app/dist/nobleui-angular /usr/share/nginx/html

# Exposer le port 80 (par défaut pour nginx)
EXPOSE 80

# Lancer nginx en mode premier plan
CMD ["nginx", "-g", "daemon off;"]
