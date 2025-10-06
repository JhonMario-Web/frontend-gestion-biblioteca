import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend-gestion-biblioteca');

  // Nuevo método agregado por el patch
  getWelcomeMessage(): string {
    return 'Bienvenido a la gestión de biblioteca';
  }
}
