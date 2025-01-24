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
  isLogin = true;

  constructor(private authService: AuthService, private router: Router) {}

  // Cambiar entre login y registro
  toggleTab(isLogin: boolean) {
    this.isLogin = isLogin;
    this.errorMessage = ''; // Limpiar el mensaje de error al cambiar de pestaña
  }

  async onSubmit(): Promise<void> {
    if (this.isLogin) {
      // Intentar iniciar sesión
      const isAuthenticated = await this.authService.login(this.username, this.password);
      if (isAuthenticated) {
        this.router.navigate(['/editar']);
      } else {
        this.errorMessage = 'usuario o contraseña invalida, intente registrarse';
      }
    } else {
      // Registrar el nuevo usuario
      const isRegistered = await this.authService.register(this.username, this.password);
      if (isRegistered) {
        this.router.navigate(['/grafico']);
      } else {
        this.errorMessage = 'el usuario ya existe, por favor vaya a la pestaña Login';
      }
    }
  }
}
