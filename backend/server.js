import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Configurar multer para guardar imágenes
const upload = multer({ dest: 'uploads/' });

// Crear carpeta de uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Ruta para hacer predicciones
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

app.listen(PORT, () => {
  console.log(`✓ Backend running on http://localhost:${PORT}`);
});
