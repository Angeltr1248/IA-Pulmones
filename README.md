# 🫁 Detector de COVID con Deep Learning

Sistema completo de detección de COVID usando radiografías de tórax con:
- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **ML**: Modelo Keras/TensorFlow (MobileNetV2)

## 📋 Requisitos

- Python 3.8+
- Node.js 16+
- npm

## 🚀 Instalación

### 1. Entorno Virtual Python (si aún no existe)

```bash
python3 -m venv venv
source venv/bin/activate
pip install tensorflow keras
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
```

### 3. Frontend (React)

```bash
cd frontend
npm install
```

## 🎯 Ejecución

Abre **3 terminales** diferentes en el directorio raíz del proyecto:

### Terminal 1: Activar entorno Python (si es necesario)
```bash
source venv/bin/activate
```

### Terminal 2: Iniciar Backend
```bash
cd backend
npm start
# Backend en http://localhost:3001
```

### Terminal 3: Iniciar Frontend
```bash
cd frontend
npm run dev
# Frontend en http://localhost:3000
```

Luego abre http://localhost:3000 en tu navegador.

## 📊 Flujo Completo

### 1. **Entrenar el Modelo** (Una sola vez)
```bash
cd .. # volver a la carpeta raíz
source venv/bin/activate
python entrenar_modelo.py
```

### 2. **Generar Gráficas de Métricas**
```bash
python evaluar_metricas.py
```

### 3. **Usar la Aplicación Web**
- Abre http://localhost:3000
- Arrastra una imagen de radiografía de tórax
- Haz clic en "Analizar"
- Obtén el diagnóstico con porcentajes

## 📁 Estructura del Proyecto

```
IA_Pulmones/
├── entrenar_modelo.py       # Entrenar el modelo
├── evaluar_metricas.py      # Generar gráficas
├── predecir.py              # Script de predicción (usado por backend)
├── backend/
│   ├── package.json
│   ├── server.js            # Servidor Express
│   └── uploads/             # Imágenes temporales
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          # Componente principal
│       └── App.css
├── dataset/
│   └── train/               # Dataset de entrenamiento
└── modelo_neumonia_deeplearning.keras  # Modelo entrenado
```

## 🎨 Características

✅ Drag & Drop de imágenes
✅ Predicción en tiempo real
✅ Visualización de probabilidades por clase
✅ Interfaz moderna y responsive
✅ Indicador de confianza
✅ Barra de progreso de análisis

## 📊 Clases de Diagnóstico

- **NORMAL**: Radiografía sin anomalías
- **COVID19**: Indicios de COVID-19
- **OTRAS_ENFERMEDADES**: Otras patologías respiratorias

## ⚠️ Nota Importante

Este sistema es **asistencial** y no reemplaza el diagnóstico de un profesional médico. Siempre consulta con un médico para un diagnóstico definitivo.

## 🛠️ Solución de Problemas

### Error: "externally-managed-environment"
```bash
python3 -m venv venv
source venv/bin/activate
```

### Backend no se conecta
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Revisa la consola para mensajes de error

### Modelo no cargado
- Asegúrate de que `modelo_neumonia_deeplearning.keras` exista
- Corre `python entrenar_modelo.py` si no existe

### Error de CORS
- Verifica que el backend tiene CORS habilitado
- Reinicia ambos servidores

## 📝 Licencia

Este proyecto es educativo y de demostración.
