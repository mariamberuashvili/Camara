import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Valida la contraseña de administrador contra el servidor
   * La contraseña se valida en el backend, no en el cliente
   */
  validateAdminPassword(password: string): Observable<{ valid: boolean; token?: string }> {
    return this.http.post<{ valid: boolean; token?: string }>(
      `${this.baseUrl}/validate-admin.php`,
      { password },
      { responseType: 'json' }
    );
  }

  /**
   * Obtiene el token de admin de sessionStorage
   */
  getAdminToken(): string | null {
    return sessionStorage.getItem('adminToken');
  }

  /**
   * Guarda el token de admin en sessionStorage
   */
  setAdminToken(token: string): void {
    sessionStorage.setItem('adminToken', token);
  }

  /**
   * Limpia la sesión de admin
   */
  logout(): void {
    sessionStorage.removeItem('adminToken');
  }

  /**
   * Verifica si hay sesión de admin activa
   */
  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }
}
