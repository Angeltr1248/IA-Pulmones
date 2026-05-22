const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const __dirname = __dirname || path.dirname(require.main.filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Configurar multer
const upload = multer({ dest: 'uploads/' });

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
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
    fs.unlink(imagePath, () => {});

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
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ App running on port ${PORT}`);
});
