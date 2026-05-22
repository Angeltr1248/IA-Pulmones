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

// Servir archivos estáticos del frontend
const distPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
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

  const python = spawn('python3', [pythonScriptPath, imagePath]);

  let dataOutput = '';
  let errorOutput = '';

  python.stdout.on('data', (data) => {
    dataOutput += data.toString();
  });

  python.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  python.on('close', (code) => {
    // Limpiar archivo temporal
    try {
      fs.unlinkSync(imagePath);
    } catch (e) {}

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
