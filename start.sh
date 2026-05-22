#!/bin/bash

echo "🚀 Iniciando Detector de Neumonía..."
echo ""

# Verificar que exista el modelo
if [ ! -f "modelo_neumonia_deeplearning.keras" ]; then
    echo "⚠️  Modelo no encontrado. Ejecutando entrenar_modelo.py..."
    source venv/bin/activate
    python entrenar_modelo.py
    if [ $? -ne 0 ]; then
        echo "❌ Error en el entrenamiento"
        exit 1
    fi
fi

echo "✓ Modelo encontrado"
echo ""

# Instalar dependencias backend si no existen
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    cd backend
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando backend"
        exit 1
    fi
fi

# Instalar dependencias frontend si no existen
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd frontend
    npm install
    cd ..
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando frontend"
        exit 1
    fi
fi

echo ""
echo "✅ Todo listo para empezar"
echo ""
echo "📝 Ejecuta estos comandos en 3 terminales diferentes:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Terminal 3 (Monitoreo - opcional):"
echo "  python evaluar_metricas.py"
echo ""
echo "🌐 Accede a http://localhost:3000"
echo ""
