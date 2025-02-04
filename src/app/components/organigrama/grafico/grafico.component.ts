import { Component, OnInit, ElementRef, ViewChild, Input,Renderer2, HostListener, PLATFORM_ID, Inject, AfterViewChecked, AfterViewInit} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
    FormsModule,

  ]
})
export class GraficoComponent implements OnInit, AfterViewChecked,AfterViewInit
  levels: Tarjeta[][] = [];
  connectionLines: any[] = [];
  highlightedTarjetas: Tarjeta[] = [];
  tarjetaSeleccionada: Tarjeta | null = null;
  selectedTarjeta: any = { id: 0, cargo: '', vertical: '', correo: '', estado: true };
  tarjetas: Tarjeta[] = []; // Inicializa la variable
  children:any[] =[]
  isModalVisible:boolean = false
  //const elemento: HTMLElement = document.createElement('div');

  @Input() data: Tarjeta[] = [];
  @Input() parentId: number | string = '';

  @ViewChild('myModal') myModal!: ElementRef; // Referencia al modal en el HTML
  modalTitle: string = 'Detalles de la Tarjeta';
  modalContent: string = 'Aquí van los detalles adicionales de la tarjeta.';
  lineasDibujadas: any;


  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private tarjetaService: TarjetaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && !this.lineasDibujadas) {
      this.dibujarLineas();
      this.lineasDibujadas = true; // Evitar múltiples ejecuciones
    }
  }

  ngOnInit(): void {
    this.tarjetaService.getTarjetas()
    .subscribe((respuesta: Tarjeta[]) => {
        this.levels = this.construirOrganigrama(respuesta);
        this.updateConnectionLines();
        this.tarjetas = respuesta
      });

      if (isPlatformBrowser(this.platformId)) {
        // Observar cambios en el DOM
        //const observer = new MutationObserver(() => {
        //  this.dibujarLineas();
        //});
        window.addEventListener('resize', () => this.dibujarLineas());
        // Escuchar cambios en el DOM (opcional, si las tarjetas se mueven dinámicamente)
        //this.observarCambiosEnDOM();

        // Configurar el observador
        //const config = { childList: true, subtree: true };
        //observer.observe(this.el.nativeElement, config);
        // Dibujar líneas inicialmente
        //this.dibujarLineas();

        setTimeout(() => {
          this.dibujarLineas();
        }, 600);
      }



  }

  getChildren(parentId: number | string): Tarjeta[] {
    return this.levels[0].filter(persona => persona.parentId === parentId);
  }

  ngAfterViewInit(): void {
    this.updateConnectionLines();
    this.obtenerCoordenadasTarjetas();
  }

  @HostListener('window:resize')
    onResize() {
      if (isPlatformBrowser(this.platformId)) {
    this.dibujarLineas();
      }
    }



  obtenerCoordenadasTarjetas() {
    const tarjetas = this.el.nativeElement.querySelectorAll('.tarjeta');
    const coordenadasTarjetas: { id: string, coordenadas: DOMRect }[] = [];

    Array.from<HTMLElement>(tarjetas).forEach((tarjeta: HTMLElement) => {
      const coordenadas = tarjeta.getBoundingClientRect();
      coordenadasTarjetas.push({
        id: tarjeta.id,
        coordenadas: coordenadas,
      });

      // Opcional: Cambiar el estilo de la tarjeta (solo para visualización)
      this.renderer.setStyle(tarjeta, 'border', '2px solid red');
    });

    //console.log('Coordenadas de todas las tarjetas:', coordenadasTarjetas);
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
    this.isModalVisible = true;
    const modalElement = this.myModal.nativeElement;
    const modal = new bootstrap.Modal(modalElement); // Usa Bootstrap para controlar el modal
    this.selectedTarjeta = this.tarjetas.find(t => t.id === id);
    this.modalTitle = this.selectedTarjeta ? this.selectedTarjeta.cargo : 'Nuevo Registro';

    //const modal = new bootstrap.Modal(this.myModal.nativeElement);
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




    enviarCoordenadas(coordenadas: DOMRect) {
      // Aquí puedes usar HttpClient para enviar las coordenadas a tu servidor Node.js
      const coordenadasData = {
        top: coordenadas.top,
        right: coordenadas.right,
        bottom: coordenadas.bottom,
        left: coordenadas.left,
        width: coordenadas.width,
        height: coordenadas.height,
      };

    //console.log('Coordenadas a enviar:', coordenadasData);
    // Ejemplo de envío usando HttpClient (debes importar HttpClientModule en tu módulo)
    // this.http.post('http://tuservidor.com/api/coordenadas', coordenadasData).subscribe();
    }


    dibujarLineas() {
      const tarjetas = this.el.nativeElement.querySelectorAll('.tarjeta');
      const svg = this.el.nativeElement.querySelector('.lineas-contenedor');

      // Limpiar líneas anteriores
      svg.innerHTML = '';

      // Definir las conexiones que deseas dibujar
      const conexiones = [
        [0-0, 1-0], // Conectar tarjeta 0 con tarjeta 1
        [0-0, 1-1],
        [0-0, 1-2],
        [0-0, 1-3],
        // Agrega más pares según sea necesario
      ];

      // Recorrer las conexiones y dibujar las líneas
      conexiones.forEach(([inicioIdx, finIdx]) => {
        const tarjetaInicio = tarjetas[inicioIdx] as HTMLElement;
        const tarjetaFin = tarjetas[finIdx] as HTMLElement;

        if (tarjetaInicio && tarjetaFin) {
          const coordenadasInicio = tarjetaInicio.getBoundingClientRect();
          const coordenadasFin = tarjetaFin.getBoundingClientRect();


          // Calcular los puntos centrales de las tarjetas
          const x1 = coordenadasInicio.x + coordenadasInicio.width / 2;
          const y1 = coordenadasInicio.y + (coordenadasInicio.height -40)/ 2;
          const x2 = x1;
          const y2 = y1 + 40;
          //console.log('coord_inicio: ',coordenadasInicio, 'x1: ',x1,'  --- coord_fin: ', coordenadasFin.left, 'x2: ',x2)

          // Dibujar la primera línea vertical (de la tarjeta de inicio al punto intermedio)
          const lineaVertical1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineaVertical1.setAttribute('x1', x1.toString());
          lineaVertical1.setAttribute('y1', y1.toString());
          lineaVertical1.setAttribute('x2', x2.toString());
          lineaVertical1.setAttribute('y2', y2.toString());
          lineaVertical1.setAttribute('stroke', 'black');
          lineaVertical1.setAttribute('stroke-width', '2');
          svg.appendChild(lineaVertical1);

          const x3 = x2
          const y3 = y2
          const x4 = coordenadasFin.x + coordenadasFin.width / 2;
          const y4 = y2

          // Dibujar la línea horizontal (del punto intermedio al punto final en X)
          const lineaHorizontal = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineaHorizontal.setAttribute('x1', x3.toString());
          lineaHorizontal.setAttribute('y1', y3.toString());
          lineaHorizontal.setAttribute('x2', x4.toString());
          lineaHorizontal.setAttribute('y2', y4.toString());
          lineaHorizontal.setAttribute('stroke', 'blue');
          lineaHorizontal.setAttribute('stroke-width', '2');
          svg.appendChild(lineaHorizontal);

          const x5 = x4
          const y5 = y4
          const x6 = coordenadasFin.left + coordenadasFin.width / 2;
          const y6 = coordenadasFin.top - (coordenadasFin.height / 2) -20;

          // Dibujar la segunda línea vertical (del punto final en X al punto final en Y)
          const lineaVertical2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          lineaVertical2.setAttribute('x1', x5.toString());
          lineaVertical2.setAttribute('y1', y5.toString());
          lineaVertical2.setAttribute('x2', x6.toString());
          lineaVertical2.setAttribute('y2', y6.toString());
          lineaVertical2.setAttribute('stroke', 'green');
          lineaVertical2.setAttribute('stroke-width', '2');
          svg.appendChild(lineaVertical2);
        }
      });
    }

    observarCambiosEnDOM() {
      const observer = new MutationObserver(() => this.dibujarLineas());
      const config = { childList: true, subtree: true };
      observer.observe(this.el.nativeElement, config);
    }








