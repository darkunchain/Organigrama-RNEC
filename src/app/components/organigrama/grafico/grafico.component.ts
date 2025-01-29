import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http'; // Importa provideHttpClient
import { TarjetaService } from '../../../services/tarjeta.service';


declare var bootstrap: any; // Declara la variable global bootstrap
interface Tarjeta {
  id: number;
  titulo: string;
  subtitulo: string;
  texto: string;
  imagen: string;
  parentId?: number; // ID del jefe inmediato
}

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css'],
  imports: [
    CommonModule
  ]
})
export class GraficoComponent implements OnInit {
  levels: Tarjeta[][] = [];
  connectionLines: any[] = [];
  highlightedTarjetas: Tarjeta[] = [];
  tarjetaSeleccionada: Tarjeta | null = null;

  @ViewChild('myModal') myModal!: ElementRef; // Referencia al modal en el HTML
  modalTitle: string = 'Detalles de la Tarjeta';
  modalContent: string = 'Aquí van los detalles adicionales de la tarjeta.';

  constructor(private tarjetaService: TarjetaService) {}

  ngOnInit(): void {
    this.cargarTarjetas();
  }


  cargarTarjetas(): void {
    this.tarjetaService.getTarjetas().subscribe(
      (tarjetas: Tarjeta[]) => {
        this.levels = this.construirOrganigrama(tarjetas);
        this.updateConnectionLines();
      },
      (error) => {
        console.error('Error al cargar las tarjetas:', error);
      }
    );
  }

  // Método para abrir el modal
  openModal() {
    const modalElement = this.myModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement); // Usa Bootstrap para controlar el modal
    modal.show();
  }
}
