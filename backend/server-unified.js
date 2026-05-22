const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware para MIME types correctos
app.use((req, res, next) => {
  if (req.path.endsWith('.css')) {
    res.type('text/css');
  } else if (req.path.endsWith('.js')) {
    res.type('application/javascript');
  }
  next();
});

// Servir archivos estáticos del frontend
const distPath = path.join(__dirname, '../frontend/dist');
console.log(`📁 Buscando frontend en: ${distPath}`);
console.log(`📁 Existe: ${fs.existsSync(distPath)}`);

if (fs.existsSync(distPath)) {
  console.log(`✅ Sirviendo frontend desde: ${distPath}`);
  app.use(express.static(distPath, {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.set('Content-Type', 'text/css; charset=utf-8');
      } else if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript; charset=utf-8');
      }
    }
  }));
} else {
  console.log(`⚠️  Frontend dist no encontrado en ${distPath}`);
  console.log(`📂 Contenido de ${__dirname}:`, fs.readdirSync(__dirname));
}

// Configurar multer
const upload = multer({ dest: 'uploads/' });

// Crear carpeta uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// API de predicción
app.post('/api/predict', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const imagePath = path.join(__dirname, req.file.path);
  const pythonScriptPath = path.join(__dirname, '..', 'predecir.py');

  console.log(`🖼️  Prediciendo imagen: ${imagePath}`);
  console.log(`🐍 Script Python: ${pythonScriptPath}`);
  console.log(`✅ Script existe: ${fs.existsSync(pythonScriptPath)}`);

  if (!fs.existsSync(pythonScriptPath)) {
    try { fs.unlinkSync(imagePath); } catch (e) {}
    return res.status(500).json({
      error: 'Python script not found',
      path: pythonScriptPath
    });
  }

  const python = spawn('python3', [pythonScriptPath, imagePath]);

  let dataOutput = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    dataOutput += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('error', (err) => {
    console.error(`❌ Python error:`, err);
    try { fs.unlinkSync(imagePath); } catch (e) {}
    res.status(500).json({
      error: 'Failed to spawn Python process',
      details: err.message
    });
  });

  python.on('close', (code) => {
    // Limpiar archivo temporal
    try {
      fs.unlinkSync(imagePath);
    } catch (e) {}

    console.log(`🔍 Python exit code: ${code}`);
    console.log(`📤 Output: ${dataOutput.substring(0, 200)}`);
    console.log(`❌ Error: ${errorOutput.substring(0, 200)}`);

    if (code !== 0) {
      return res.status(500).json({
        error: 'Prediction failed',
        details: errorOutput
      });
    }

    try {
      const result = JSON.parse(dataOutput);
      res.json(result);
    } catch (e) {
      res.status(500).json({
        error: 'Error parsing prediction',
        details: dataOutput
      });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  const appDir = __dirname;
  const parentDir = path.join(appDir, '..');
  const pythonScriptPath = path.join(parentDir, 'predecir.py');
  const modelPath = path.join(parentDir, 'modelo_neumonia_deeplearning.keras');

  res.json({
    appDir: appDir,
    parentDir: parentDir,
    pythonScriptExists: fs.existsSync(pythonScriptPath),
    modelExists: fs.existsSync(modelPath),
    pythonScriptPath: pythonScriptPath,
    modelPath: modelPath,
    parentDirContents: fs.readdirSync(parentDir).slice(0, 20),
    nodeVersion: process.version,
    platform: process.platform
  });
});

// Servir index.html para rutas desconocidas (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../frontend/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
