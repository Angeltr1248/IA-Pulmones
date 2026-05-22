import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import os
import sys

# Configuración
base_dir = "/home/angeltr/Escritorio/IA_Pulmones/dataset"
train_dir = os.path.join(base_dir, "train")

# Verificar que el directorio del dataset existe
if not os.path.exists(train_dir):
    print(f"Error: El directorio {train_dir} no existe.")
    sys.exit(1)

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 40

# Carga de datos
try:
    train_dataset = keras.utils.image_dataset_from_directory(
        train_dir, validation_split=0.2, subset="training", seed=123, image_size=IMG_SIZE, batch_size=BATCH_SIZE
    )
    val_dataset = keras.utils.image_dataset_from_directory(
        train_dir, validation_split=0.2, subset="validation", seed=123, image_size=IMG_SIZE, batch_size=BATCH_SIZE
    )
except Exception as e:
    print(f"Error cargando el dataset: {e}")
    sys.exit(1)

# Pipeline de datos
AUTOTUNE = tf.data.AUTOTUNE
train_dataset = train_dataset.prefetch(buffer_size=AUTOTUNE)
val_dataset = val_dataset.prefetch(buffer_size=AUTOTUNE)

# Data Augmentation
data_augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.12),
    layers.RandomZoom(0.1),
])

# Modelo
base_model = keras.applications.MobileNetV2(input_shape=(224, 224, 3), include_top=False)
base_model.trainable = False

inputs = keras.Input(shape=(224, 224, 3))
x = data_augmentation(inputs)
x = keras.applications.mobilenet_v2.preprocess_input(x)
x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dropout(0.3)(x)
outputs = layers.Dense(3, activation='softmax')(x)

model = keras.Model(inputs, outputs)
model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Vigilante automático
early_stopping = keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

# Entrenamiento
try:
    print(f"Iniciando entrenamiento por {EPOCHS} épocas...")
    model.fit(train_dataset, validation_data=val_dataset, epochs=EPOCHS, callbacks=[early_stopping])

    model.save('modelo_neumonia_deeplearning.keras')
    print("Modelo guardado como 'modelo_neumonia_deeplearning.keras'")
except Exception as e:
    print(f"Error durante el entrenamiento: {e}")
    sys.exit(1)