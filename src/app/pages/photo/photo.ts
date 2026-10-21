import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { AlumnoService } from '../../services/alumnoservices';
import { appState } from '../../state';
import { Header } from '../../shared/components/header/header';

@Component({
  standalone: true,
  selector: 'app-photo',
  imports: [CommonModule, FormsModule, Header, TranslatePipe],
  templateUrl: './photo.html',
  styleUrls: ['./photo.css'],
})
export class Photo implements OnInit, OnDestroy {

  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  nia: string = '';
  dni: string = '';

  fotoCapturada: string | null = null;
  fileParaEnviar: File | null = null;

  private mediaStream: MediaStream | null = null;

  camaraActual: 'user' | 'environment' = 'environment';

  currentLang = signal('ca');

  constructor(
    private alumnoService: AlumnoService,
    private router: Router,
    private translate: TranslateService
  ) {
    // Escuchar cambios de idioma
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang.set(event.lang);
    });
  }

  ngOnInit() {
    this.iniciarCamara();
  }

  ngOnDestroy() {
    this.detenerCamara();
  }

  async iniciarCamara() {
    try {
      this.detenerCamara();

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.camaraActual },
        audio: false
      });

      this.videoElement.nativeElement.srcObject = this.mediaStream;

    } catch (err) {
      console.error("Error al iniciar cambra:", err);
    }
  }

  cambiarCamara() {
    this.camaraActual = this.camaraActual === 'environment' ? 'user' : 'environment';
    this.iniciarCamara();
  }

  capturarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    this.fotoCapturada = canvas.toDataURL('image/jpeg');

    canvas.toBlob((blob) => {
      if (blob) {
        const niaNombre = appState.nia() || this.nia || 'alumno';
        const nombre = `${niaNombre}.jpg`;

        this.fileParaEnviar = new File([blob], nombre, {
          type: 'image/jpeg'
        });

        this.detenerCamara();
      }
    }, 'image/jpeg');
  }

  detenerCamara() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
  }

  reintentar() {
    this.fotoCapturada = null;
    this.fileParaEnviar = null;
    this.iniciarCamara();
  }

  subirAlServidor() {
    if (!this.fileParaEnviar) {
      const msg = this.translate.instant('RESULT_ERROR_CAMARA_1');
      console.warn(msg);
      alert(msg);
      return;
    }

    const id = appState.nia() || appState.nie() || 'anonimo';

    this.alumnoService.subirExpediente(
      id,
      id,
      this.fileParaEnviar
    ).subscribe({
      next: (res) => {
        const msg = this.translate.instant('RESULT_CAMARA_2');
        console.log(msg, res);
        this.detenerCamara();
        this.router.navigate(['/result']);
      },
      error: (err) => {
        const errorMsg = this.translate.instant('RESULT_ERROR_CAMARA_2');
        console.error(errorMsg, err);
        const alertMsg = this.translate.instant('RESULT_ERROR_CAMARA_3');
        alert(alertMsg);
      }
    });
  }
}