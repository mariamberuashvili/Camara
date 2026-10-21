import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  standalone: true,
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  password: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  onLogin() {
    if (!this.password.trim()) {
      this.error = 'Por favor ingresa una contraseña';
      return;
    }

    this.loading = true;
    this.error = '';

    this.adminService.validateAdminPassword(this.password).subscribe({
      next: (res) => {
        if (res.valid && res.token) {
          this.adminService.setAdminToken(res.token);
          this.router.navigate(['/admin-upload']);
        } else {
          this.error = 'Contraseña incorrecta';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = err.error?.message || 'Error al validar contraseña';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
