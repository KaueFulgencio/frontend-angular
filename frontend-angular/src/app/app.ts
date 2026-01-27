import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


import { MapaOnibusComponent } from './components/mapa-onibus/mapa-onibus.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MapaOnibusComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('frontend-angular');
}
