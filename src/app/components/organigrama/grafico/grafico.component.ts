import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaService } from '../../../services/tarjeta.service';
import { Tarjeta } from '../../../models/tarjeta.model';
import { FormsModule } from '@angular/forms'; // Importar FormsModule



declare var bootstrap: any; // Declara la variable global bootstrap



@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class GraficoComponent implements OnInit {  
  levels: Tarjeta[][] = [];
  connectionLines: any[] = [];
  highlightedTarjetas: Tarjeta[] = [];
  tarjetaSeleccionada: Tarjeta | null = null;
  selectedTarjeta: any = { id: 0, cargo: '', vertical: '', correo: '', estado: true };
  tarjetas: Tarjeta[] = []; // Inicializa la variable
  

  @ViewChild('myModal') myModal!: ElementRef; // Referencia al modal en el HTML
  modalTitle: string = 'Detalles de la Tarjeta';
  modalContent: string = 'Aquí van los detalles adicionales de la tarjeta.';
 
  
  constructor(private tarjetaService: TarjetaService) {}

  ngOnInit(): void {    
/*     this.tarjetaService.getTarjetas()
    .subscribe(respuesta => {
    console.log('respuesta: ',respuesta)
    this.tarjetas = respuesta;
    }); */
    this.tarjetaService.getTarjetas()
    .subscribe((respuesta: Tarjeta[]) => {
        this.levels = this.construirOrganigrama(respuesta);
        this.updateConnectionLines();
        this.tarjetas = respuesta
      });
  }

  ngAfterViewInit(): void {
    this.updateConnectionLines();
  }

  log(value: any): void {
    console.log(value);
  }


  cargarTarjetas(): void {
    this.tarjetaService.getTarjetas()
    .subscribe({
      next: (tarjetas: Tarjeta[]) => {
        this.levels = this.construirOrganigrama(tarjetas);
        this.updateConnectionLines();
      },
      error: (error) => {
        console.error('Error al cargar las tarjetas:', error);
      }
    });
  }

  guardarTarjeta(): void {
    console.log('hello world - guardar tarjetas')
  }

  obtenerTarjetas(): void {
  this.tarjetaService.getTarjetas()
  .subscribe(respuesta => {
    console.log('respuesta: ',respuesta)
  });
}

  getTarjetaID(id:number): void {
    this.tarjetaService.getTarjetaId(id)
    .subscribe(respuesta => {
      console.log('respuesta: ',respuesta)
    });
  }

  // Método para abrir el modal
  openModal(id:number) {
    //const modalElement = this.myModal.nativeElement;
    //const modal = new bootstrap.Modal(modalElement); // Usa Bootstrap para controlar el modal
    //this.selectedTarjeta = this.tarjetas.find(t => t.id === id);
    //this.modalTitle = this.selectedTarjeta ? this.selectedTarjeta.cargo : 'Nuevo Registro';

    const modal = new bootstrap.Modal(this.myModal.nativeElement);
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
    if (typeof document === 'undefined') {
      return; // Evita ejecutar el código en el servidor
    }

    this.connectionLines = []; // Reinicia las líneas de conexión

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
              const startX = tarjetaElement.offsetLeft + tarjetaElement.offsetWidth / 2;
              const startY = tarjetaElement.offsetTop + tarjetaElement.offsetHeight;
              const endX = subordinateElement.offsetLeft + subordinateElement.offsetWidth / 2;
              const endY = subordinateElement.offsetTop;

              this.connectionLines.push({ startX, startY, endX, endY });
            }
          });
        }
      });
    }
  }
}
