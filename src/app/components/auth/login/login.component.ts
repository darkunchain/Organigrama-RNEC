import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isRegistering = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(): Promise<void> {
    if (this.isRegistering) {
      // Registrar el nuevo usuario
      const isRegistered = await this.authService.register(this.username, this.password);
      if (isRegistered) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'User already exists';
      }
    } else {
      // Intentar iniciar sesión
      await this.authService.loadUsers();
      const isAuthenticated = await this.authService.login(this.username, this.password);

      if (isAuthenticated) {
        this.router.navigate(['/home']);
      } else {
        this.errorMessage = 'Invalid username or password';
      }
    }
  }
  toggleRegister() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = ''; // Limpiar el mensaje de error al cambiar entre login y registro
  }
}
