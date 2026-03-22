FROM node:20-alpine

WORKDIR /app

# Copia dependencias primero (mejor cache)
COPY package*.json ./

# Instala dependencias dentro del contenedor
RUN npm install

# Copia el resto del código
COPY . .

EXPOSE 5173

# Corre Vite con host 0.0.0.0 para que sea accesible fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]