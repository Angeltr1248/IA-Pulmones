import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processImage(files[0]);
    }
  };

  const processImage = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    setImage(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePredict = async () => {
    if (!image) {
      setError('Por favor selecciona una imagen');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error en la predicción. Intenta de nuevo.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🫁 Detector de Neumonía</h1>
        <p className="subtitle">Arrastra una radiografía de tórax para detectar neumonía</p>

        <div className="content">
          <div className="left-section">
            <div
              className="drop-zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {preview ? (
                <div className="preview-container">
                  <img src={preview} alt="Preview" className="preview-image" />
                </div>
              ) : (
                <div className="drop-content">
                  <p className="drop-icon">📤</p>
                  <p className="drop-text">Arrastra una imagen aquí</p>
                  <p className="drop-or">o</p>
                  <label className="file-input-label">
                    Selecciona un archivo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="file-input"
                    />
                  </label>
                </div>
              )}
            </div>

            {preview && (
              <div className="button-group">
                <button
                  className="btn btn-primary"
                  onClick={handlePredict}
                  disabled={loading}
                >
                  {loading ? '⏳ Analizando...' : '🔍 Analizar'}
                </button>
                <button className="btn btn-secondary" onClick={handleClear}>
                  🔄 Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="right-section">
            {error && <div className="error-message">❌ {error}</div>}

            {result && (
              <div className="result-container">
                <h2>Resultado del Análisis</h2>

                <div className="diagnosis-box">
                  <p className="diagnosis-label">Diagnóstico:</p>
                  <p className="diagnosis-value">
                    {result.diagnostico === 'NORMAL'
                      ? '✅ NORMAL'
                      : result.diagnostico === 'COVID19'
                      ? '⚠️ COVID-19'
                      : '⚠️ OTRAS ENFERMEDADES'}
                  </p>
                </div>

                <div className="confidence-box">
                  <p className="confidence-label">Confianza:</p>
                  <p className="confidence-value">{result.confianza}%</p>
                  <div className="confidence-bar">
                    <div
                      className="confidence-fill"
                      style={{ width: `${result.confianza}%` }}
                    ></div>
                  </div>
                </div>

                <div className="probabilities-box">
                  <p className="probabilities-title">Probabilidades por clase:</p>
                  <div className="probability-items">
                    {Object.entries(result.probabilidades).map(([clase, prob]) => (
                      <div key={clase} className="probability-item">
                        <span className="probability-label">{clase}</span>
                        <div className="probability-bar">
                          <div
                            className="probability-fill"
                            style={{ width: `${prob}%` }}
                          ></div>
                        </div>
                        <span className="probability-value">{prob}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="info-box">
                  <p>
                    <strong>Nota:</strong> Este diagnóstico es asistencial. Consulta con
                    un médico profesional para un diagnóstico definitivo.
                  </p>
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="info-section">
                <h3>Instrucciones</h3>
                <ul>
                  <li>Selecciona o arrastra una radiografía de tórax</li>
                  <li>Haz clic en "Analizar" para procesar la imagen</li>
                  <li>Obtén el diagnóstico con porcentajes de confianza</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
