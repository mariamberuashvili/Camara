import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlumnoService } from '../../services/alumnoservices';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-upload',
  imports: [CommonModule],
  templateUrl: './admin-upload.html',
  styleUrls: ['./admin-upload.css']
})
export class AdminUpload {

  selectedFile: File | null = null;
  uploading: boolean = false;

  constructor(
    private router: Router,
    private alumnoService: AlumnoService,
    private adminService: AdminService
  ) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert("Por favor selecciona un archivo");
      return;
    }

    this.uploading = true;

    this.alumnoService.subirExcel(this.selectedFile).subscribe({
      next: (res) => {
        console.log('✅ Respuesta del servidor:', res);
        if (res.status === 'ok') {
          alert(`✅ Importación completada\nInsertados: ${res.insertados}\nActualizados: ${res.actualizados}`);
        } else {
          alert(`❌ Error: ${res.message}`);
        }
        this.uploading = false;
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('❌ Error HTTP:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          error: err.error
        });
        alert(`❌ Error al subir archivo: ${err.error?.message || err.message || 'Error desconocido'}`);
        this.uploading = false;
      }
    });
  }

  logout() {
    this.adminService.logout();
    this.router.navigate(['/admin-login']);
  }
}