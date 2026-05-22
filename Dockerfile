FROM node:22-slim

WORKDIR /app

# Instalar Python (necesario para predicciones)
RUN apt-get update && apt-get install -y python3 python3-pip && rm -rf /var/lib/apt/lists/*

# Copiar archivos
COPY package.json package-lock.json ./
COPY backend ./backend
COPY frontend ./frontend
COPY predecir.py ./
COPY modelo_neumonia_deeplearning.keras ./

# Instalar dependencias root
RUN npm install

# Instalar dependencias backend
WORKDIR /app/backend
RUN npm install

# Volver a raíz e instalar frontend deps
WORKDIR /app/frontend
RUN npm install && npm run build

# Volver a raíz
WORKDIR /app

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "backend/server-unified.js"]
