export interface EstadoIngreso {
  fechaRegistro: string;
  fotosUrls: string[];
  notas: string;
}

export interface Usuario {
  id?: string;
  nombre: string;
  telefono: string;
  placaVehiculo: string;
  tipoServicio: string;
  estado?: string;    // 'en curso' | 'finalizado'
  fecha?: string;     // 'YYYY-MM-DD'
  hora?: string;      // 'HH:mm'
  repuesto?: string;  // nombre del repuesto solicitado (opcional)
  estadoIngreso?: EstadoIngreso;
}
