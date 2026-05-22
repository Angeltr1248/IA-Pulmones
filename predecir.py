import tensorflow as tf
from tensorflow import keras
import numpy as np
import json
import sys
import os

# Cargar el modelo
modelo = keras.models.load_model('modelo_neumonia_deeplearning.keras')
nombres_clases = ['COVID19', 'NORMAL', 'OTRAS_ENFERMEDADES']

def predecir_imagen(ruta_imagen):
    img = keras.preprocessing.image.load_img(ruta_imagen, target_size=(224, 224))
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)

    img_array = keras.applications.mobilenet_v2.preprocess_input(img_array)

    prediccion = modelo.predict(img_array, verbose=0)
    indice_clase = np.argmax(prediccion)
    confianza = float(np.max(prediccion))

    # Crear probabilidades para cada clase
    probabilidades = {
        nombres_clases[i]: float(prediccion[0][i])
        for i in range(len(nombres_clases))
    }

    resultado = {
        "diagnostico": nombres_clases[indice_clase],
        "confianza": round(confianza * 100, 2),
        "probabilidades": {
            clase: round(prob * 100, 2)
            for clase, prob in probabilidades.items()
        }
    }

    return resultado

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)

    ruta_imagen = sys.argv[1]

    if not os.path.exists(ruta_imagen):
        print(json.dumps({"error": "Image file not found"}))
        sys.exit(1)

    try:
        resultado = predecir_imagen(ruta_imagen)
        print(json.dumps(resultado))
    except Exception as e:
        print(json.dumps({"error": str(e)}))