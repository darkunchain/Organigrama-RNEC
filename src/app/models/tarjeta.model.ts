export interface Tarjeta {
  id: number; // Identificador único de la tarjeta
  titulo: string; // Título de la tarjeta
  subtitulo: string; // Subtítulo o puesto
  texto: string; // Descripción o contenido de la tarjeta
  imagen: string; // URL de la imagen de la tarjeta
  parentId?: number; // ID de la tarjeta padre (opcional)
}
