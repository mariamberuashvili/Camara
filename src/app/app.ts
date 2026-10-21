import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App {

  private translate = inject(TranslateService);

  constructor() {

    this.translate.addLangs(['ca', 'es', 'en']);

    const savedLang = localStorage.getItem('lang') || 'ca';

    this.translate.setDefaultLang('ca');
    this.translate.use(savedLang);
  }
}