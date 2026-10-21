import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { appState } from '../../state';
import { Header } from '../../shared/components/header/header';
import { AlumnoService } from '../../services/alumnoservices'; // Asegúrate de importar tu servicio

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, Header, TranslatePipe],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  nia = '';
  nie = '';
  errorKey = signal('');
  
  constructor(
    private router: Router, 
    private translate: TranslateService,
    private alumnoService: AlumnoService // Inyección del servicio
  ) {}

  submitLogin() {
    this.errorKey.set('');
    const niaValue = this.nia.trim();
    const nieValue = this.nie.trim().toUpperCase();

    if (!niaValue || !nieValue) {
      this.errorKey.set('RESULT_ERROR_LOGIN_1');
      return;
    }

    // Llamada al backend real
    this.alumnoService.validarLogin(niaValue, nieValue).subscribe({
      next: (response: any) => {
        // Asumiendo que tu backend devuelve { status: 'success', data: { id, nia, dni } }
        if (response.status === 'success') {
          appState.nia.set(response.data.nia);
          appState.nie.set(response.data.dni);
          appState.savedUserId.set(response.data.id);
          this.router.navigate(['/photo']);
        } else {
          this.errorKey.set('RESULT_ERROR_LOGIN_2');
        }
      },
      error: () => {
        this.errorKey.set('RESULT_ERROR_LOGIN_2');
      }
    });
  }
}