export interface Tarjeta {
  id: number; // Identificador único de la tarjeta
  nombre: string;
  cargo: string; // Título de la tarjeta
  vertical: string; // Subtítulo o puesto
  correo: string; // Descripción o contenido de la tarjeta
  imagen: string; // URL de la imagen de la tarjeta
  estado: boolean; //estatus del funcionario (habilitado, deshabilitado)
  parentId?: number; // ID de la tarjeta padre (opcional)
}
