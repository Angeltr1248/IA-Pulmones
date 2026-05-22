import os
import random

# Ruta principal de tu dataset
base_dir = "/home/angeltr/Escritorio/IA_Pulmones/dataset"
train_dir = os.path.join(base_dir, "train")
test_dir = os.path.join(base_dir, "test")

# Definir los topes exactos de tu carpeta COVID19
train_limit = 1010
test_limit = 50

def balance_folder(folder_path, limit):
    if not os.path.exists(folder_path):
        print(f"[-] La ruta no existe: {folder_path}")
        return

    # Obtener todos los archivos en la carpeta
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    current_count = len(files)

    if current_count <= limit:
        print(f"[OK] {folder_path} tiene {current_count} imágenes. No supera el límite.")
        return

    # Calcular cuántos sobran
    excess = current_count - limit
    print(f"[PROCESANDO] {folder_path}: Tiene {current_count} imágenes. Eliminando {excess} de forma aleatoria...")

    # Mezclar aleatoriamente la lista de archivos para no borrar en orden alfabético
    random.shuffle(files)

    # Seleccionar los archivos que sobran después de tu límite
    files_to_delete = files[limit:]

    # Eliminar los archivos sobrantes
    deleted_count = 0
    for file in files_to_delete:
        file_path = os.path.join(folder_path, file)
        try:
            os.remove(file_path)
            deleted_count += 1
        except Exception as e:
            print(f"Error al borrar {file_path}: {e}")

    print(f"[LISTO] Se eliminaron {deleted_count} imágenes. Total actual en la carpeta: {limit}.\n")

# --- EJECUCIÓN ---
print("=== INICIANDO BALANCEO DE TRAIN ===")
balance_folder(os.path.join(train_dir, "NORMAL"), train_limit)
balance_folder(os.path.join(train_dir, "OTRAS_ENFERMEDADES"), train_limit)

print("=== INICIANDO BALANCEO DE TEST ===")
balance_folder(os.path.join(test_dir, "NORMAL"), test_limit)
balance_folder(os.path.join(test_dir, "OTRAS_ENFERMEDADES"), test_limit)

print("¡Balanceo completado con éxito! Todas las clases están niveladas.")