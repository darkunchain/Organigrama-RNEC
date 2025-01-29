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



  construirOrganigrama(tarjetas: Tarjeta[]): Tarjeta[][] {
    const levels: Tarjeta[][] = [];
  
    // Paso 1: Encontrar las tarjetas raíz (las que no tienen parentId)
    const rootTarjetas = tarjetas.filter(tarjeta => !tarjeta.parentId);
    levels.push(rootTarjetas);
  
    // Paso 2: Construir los niveles subordinados
    let currentLevel = rootTarjetas;
    while (currentLevel.length > 0) {
      const nextLevel: Tarjeta[] = [];
      currentLevel.forEach(tarjeta => {
        const subordinates = tarjetas.filter(t => t.parentId === tarjeta.id);
        nextLevel.push(...subordinates);
      });
      if (nextLevel.length > 0) {
        levels.push(nextLevel);
      }
      currentLevel = nextLevel;
    }
  
    return levels;
  }


  updateConnectionLines(): void {
    this.connectionLines = []; // Reinicia las líneas de conexión
  
    // Recorre cada nivel y dibuja las líneas
    for (let i = 0; i < this.levels.length - 1; i++) {
      const currentLevel = this.levels[i];
      const nextLevel = this.levels[i + 1];
  
      currentLevel.forEach(tarjeta => {
        const tarjetaElement = document.getElementById(`tarjeta-${tarjeta.id}`);
        if (tarjetaElement) {
          const subordinates = nextLevel.filter(t => t.parentId === tarjeta.id);
          subordinates.forEach(subordinate => {
            const subordinateElement = document.getElementById(`tarjeta-${subordinate.id}`);
            if (subordinateElement) {
              // Calcula las posiciones de las tarjetas
              const startX = tarjetaElement.offsetLeft + tarjetaElement.offsetWidth / 2;
              const startY = tarjetaElement.offsetTop + tarjetaElement.offsetHeight;
              const endX = subordinateElement.offsetLeft + subordinateElement.offsetWidth / 2;
              const endY = subordinateElement.offsetTop;
  
              // Almacena la línea de conexión
              this.connectionLines.push({ startX, startY, endX, endY });
            }
          });
        }
      });
    }
  }
}
