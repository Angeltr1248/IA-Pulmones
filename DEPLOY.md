# 🚀 Deploy a Glitch (MUY RÁPIDO)

## Opción 1: Glitch (Recomendado - 2 minutos)

1. Ve a https://glitch.com
2. Haz login o crea cuenta
3. Clic en **"New Project"** → **"Import from GitHub"**
4. Pega: `https://github.com/Angeltr1248/IA-Pulmones.git`
5. ¡Espera 2 minutos a que compile y despliegue!
6. Tu link será: `https://[proyecto-aleatorio].glitch.me`

## Opción 2: Replit (1 minuto)

1. Ve a https://replit.com
2. Clic en **"Create"** → **"Import from GitHub"**
3. Pega: `https://github.com/Angeltr1248/IA-Pulmones.git`
4. Automáticamente despliega
5. Abre el link público en la esquina superior derecha

## Opción 3: Railway (Más profesional)

1. Ve a https://railway.app
2. Conecta GitHub
3. Selecciona el repo `IA-Pulmones`
4. Despliega automáticamente

---

## ⚠️ IMPORTANTE ANTES DE DESPLEGAR

El servidor necesita **Python + TensorFlow** para las predicciones.

### Opción A: Desplegar sin dataset (RECOMENDADO)
- El modelo ya está entrenado
- Solo necesitas el archivo `modelo_neumonia_deeplearning.keras`
- El dataset NO necesita estar en el servidor

### Opción B: Incluir dataset (más pesado)
- Incluye la carpeta `dataset/` en el deploy
- Ocupa más espacio
- Solo si quieres reentrenar en el servidor

---

## 🔧 Variables de Entorno (si es necesario)

Agrega en el panel del hosting:

```
PORT=3000
NODE_ENV=production
```

---

## ✅ Verificar que funciona

Una vez desplegado:

1. Abre el link del proyecto
2. Deberías ver la interfaz del detector
3. Cargador de imágenes debe estar visible
4. Arrastra una imagen y analiza

---

## 📊 Logs en caso de error

- **Glitch**: Abre la terminal → `npm start`
- **Replit**: Ver output en la consola
- **Railway**: Dashboard → Logs

Si hay error de Python, probablemente necesites instalar TensorFlow en el servidor.
