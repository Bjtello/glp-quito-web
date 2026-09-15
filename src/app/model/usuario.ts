export interface Usuario {
  id?: string;
  nombre: string;
  telefono: string;
  placaVehiculo: string;
  tipoServicio: string;
  estado?: string; // 'en curso' | 'finalizado'
}