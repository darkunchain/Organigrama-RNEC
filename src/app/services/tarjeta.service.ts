import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarjeta } from '../models/tarjeta.model';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {
  private apiUrl = 'http://localhost:3000/funcionarios'; // URL de tu backend

  constructor(private http: HttpClient) {}

  getTarjetas(): Observable<Tarjeta[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<Tarjeta[]>('http://localhost:3000/funcionarios', { headers });
  }

  editTarjeta(id:number): Observable<Tarjeta[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.put<Tarjeta[]>('http://localhost:3000/funcionarios/:'+{id}, { headers });
  }

  getTarjetaId(id:number): Observable<Tarjeta[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<Tarjeta[]>('http://localhost:3000/funcionarios/:'+{id}, { headers });
  }

}
