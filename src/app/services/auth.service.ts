import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private saltRounds = 10;
  private users: any[] = [];

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  constructor() { }
  async loadUsers(): Promise<void> {
    const response = await fetch('assets/auth.json');
    this.users = await response.json();
  }

  async login(username: string, password: string): Promise<boolean> {
    const user = this.users.find((u) => u.username === username);

    if (!user) {
      return false; // Usuario no encontrado
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid;
  }

  async register(username: string, password: string): Promise<boolean> {
    // Verificar si el usuario ya existe
    if (this.users.find((u) => u.username === username)) {
      return false; // Usuario ya existe
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Agregar al arreglo de usuarios
    this.users.push({ username, password: hashedPassword });

    // Guardar los usuarios actualizados en el archivo JSON (simulado)
    console.log('Usuarios actualizados:', this.users); // Solo para pruebas

    return true;
  }

}
