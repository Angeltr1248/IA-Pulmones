FROM node:22-slim

WORKDIR /app

# Instalar Python y dependencias (necesario para predicciones)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Instalar TensorFlow y dependencias de Python
RUN pip3 install --no-cache-dir tensorflow keras numpy pillow

# Copiar archivos
COPY package.json ./
COPY backend ./backend
COPY frontend ./frontend
COPY predecir.py ./
COPY modelo_neumonia_deeplearning.keras ./

# Instalar dependencias root
RUN npm install --omit=dev

# Instalar dependencias backend
WORKDIR /app/backend
RUN npm install --omit=dev

# Instalar y compilar frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Volver a raíz
WORKDIR /app

# Exponer puerto
EXPOSE 3000

# Comando de inicio
CMD ["node", "backend/server-unified.js"]
