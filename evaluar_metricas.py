import os
import numpy as np
import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

test_dir = "/home/angeltr/Escritorio/IA_Pulmones/dataset/test"
model = keras.models.load_model('modelo_neumonia_deeplearning.keras')

test_dataset = keras.utils.image_dataset_from_directory(test_dir, image_size=(224, 224), batch_size=32, shuffle=False)
class_names = test_dataset.class_names

y_true = np.concatenate([y for x, y in test_dataset], axis=0)
predicciones = model.predict(test_dataset)
y_pred = np.argmax(predicciones, axis=1)

print(classification_report(y_true, y_pred, target_names=class_names))

cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
plt.savefig('grafica_matriz_confusion.png')
print("Gráfica guardada como 'grafica_matriz_confusion.png'")