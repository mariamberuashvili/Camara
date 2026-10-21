import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class AlumnoService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🟢 SUBIR FOTO
  subirExpediente(nia: string, dni: string, foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('nia', nia);
    formData.append('dni', dni);
    formData.append('photo', foto);

    return this.http.post(
      `${this.baseUrl}/upload_alumno.php`,
      formData,
      { responseType: 'json' }
    );
  }

  // 🟢 SUBIR EXCEL
  subirExcel(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', archivo);

    return this.http.post(
      `${this.baseUrl}/import_alumnos.php`,
      formData,
      { responseType: 'json' }
    );
  }

  // 🟢 LOGIN
  validarLogin(nia: string, dni: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/login.php`,
      { nia, dni }
    );
  }
}