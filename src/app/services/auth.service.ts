import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersFile = '../../assets/datos.json';

  constructor() {}

  // Función para obtener los usuarios del archivo datos.json
  private async getUsers(): Promise<any[]> {
    //try {
      console.log('usersFile: ',this.usersFile)
      const response = await fetch(this.usersFile);
      console.log('response: ',response)
      const users = await response.json();
      console.log('users: ',users)
      return users;
    //} catch (error) {
      //console.error('Error al obtener usuarios:', error);
      //return [];
    //}
  }

  // Función para guardar usuarios en datos.json
  private async saveUsers(users: any[]): Promise<void> {
    try {
      const usersJson = JSON.stringify(users);
      // Usar un servicio de backend para almacenar este archivo, por ahora se emula en el cliente
      localStorage.setItem(this.usersFile, usersJson);
    } catch (error) {
      console.error('Error al guardar usuarios:', error);
    }
  }

  // Registro de usuario con contraseña encriptada y bandera permitido
  async register(username: string, password: string): Promise<boolean> {
    const users = await this.getUsers();
    const existingUser = users.find((user) => user.valor === username); // Buscar por el nombre de usuario

    if (existingUser) {
      return false; // El usuario ya existe
    }

    // Encriptar la contraseña
    const saltUser = await bcrypt.genSalt(10);
    const hashedUser = await bcrypt.hash(username, saltUser);
    // Encriptar la contraseña
    const saltPass = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltPass);

    // Crear el nuevo usuario con la bandera permitido en false
    users.push({ clave: hashedUser, valor: hashedPassword, permitido: false });
    await this.saveUsers(users);

    return true;
  }

  // Verificación de inicio de sesión
  async login(username: string, password: string): Promise<boolean> {
    const users = await this.getUsers();
    const user = users.find((u) => u.valor === username); // Buscar por el nombre de usuario

    if (!user || !user.permitido) {
      return false; // El usuario no existe o no tiene permiso para ingresar
    }

    // Comparar la contraseña ingresada con la encriptada en 'clave'
    const isMatch = await bcrypt.compare(password, user.clave);
    return isMatch;
  }

  // Activar la bandera de permitido para un usuario
  async activateUser(username: string): Promise<void> {
    const users = await this.getUsers();
    const user = users.find((u) => u.valor === username);
    if (user) {
      user.permitido = true;
      await this.saveUsers(users);
    }
  }
}
