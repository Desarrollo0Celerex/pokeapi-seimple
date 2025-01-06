# Usa la imagen oficial de Node.js versión 22 como base
FROM node:22

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto que tu aplicación usa (ajusta si no es el 3000)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]