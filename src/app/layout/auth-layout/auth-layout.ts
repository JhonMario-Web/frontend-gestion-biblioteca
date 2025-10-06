import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-auth-layout',
	standalone: true,
	imports: [RouterOutlet, RouterLink, MatButtonModule, MatIconModule],
	templateUrl: './auth-layout.html',
	styleUrl: './auth-layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayout {

}
