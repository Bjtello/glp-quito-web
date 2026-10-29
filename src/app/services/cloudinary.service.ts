import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // --- REEMPLAZA ESTOS VALORES CON LOS TUYOS ---
  private cloudName = 'hhrjnbhd'; // Tu Cloud Name de Cloudinary
  private uploadPreset = 'glp_vehiculos'; // El nombre exacto de tu preset Unsigned

  constructor(private http: HttpClient) {}

  /**
   * Sube un archivo de imagen a Cloudinary directamente desde el cliente.
   * @param file El archivo de imagen seleccionado por el usuario.
   * @returns Un Observable que emite la URL segura (HTTPS) de la imagen subida.
   */
  subirImagenVehiculo(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    // Endpoint de la API REST de Cloudinary para subida de imágenes
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

    return this.http.post<any>(url, formData).pipe(
      // La respuesta exitosa contiene mucha info, extraemos solo el 'secure_url'
      map(response => response.secure_url)
    );
  }
}

