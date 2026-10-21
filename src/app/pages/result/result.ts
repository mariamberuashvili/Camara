import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import { Header } from '../../shared/components/header/header';
import { appState } from '../../state';

@Component({
  standalone: true,
  selector: 'app-result',
  imports: [CommonModule, Header, TranslatePipe],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class Result implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
   
    setTimeout(() => {
      this.limpiarSesionYSalir();
    }, 3000); 
  }

  limpiarSesionYSalir() {
    
    appState.nia.set('');
    appState.nie.set('');
    appState.birthDate.set('');
    appState.photoData.set('');
    appState.accepted.set(false);
    appState.savedUserId.set(null);

    
    this.router.navigate(['/login']);
  }
}