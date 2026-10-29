import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClienteServicio } from '../../services/cliente-servicio';
import { Usuario } from '../../model/usuario';

// Bloques horarios disponibles cada 2 horas
const HORAS_BASE = ['08:00', '10:00', '12:00', '14:00', '16:00'];

// Tipos de servicio de instalación (bloquean el día completo)
const TIPO_INSTALACION = 'Instalación 5ta Generación';

@Component({
  selector: 'app-formulario-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reserva.html',
  styleUrls: ['./formulario-reserva.css']
})
export class FormularioReserva implements OnInit {

  private clienteServicio = inject(ClienteServicio);
  private activatedRoute = inject(ActivatedRoute);

  listaClientes = signal<Usuario[]>([]);

  editando = false;
  rolActual = 'usuario';
  isAdmin = false;

  // Estado de disponibilidad
  verificandoFecha = false;
  diaCompleto = false;       // El día está bloqueado por una instalación
  horasDisponibles: string[] = [...HORAS_BASE];
  mensajeDisponibilidad = '';

  // Fecha mínima = hoy
  fechaMinima = new Date().toISOString().split('T')[0];

  nuevoCliente: Usuario = {
    nombre: '',
    telefono: '',
    placaVehiculo: '',
    tipoServicio: '',
    estado: 'en curso',
    fecha: '',
    hora: '',
    repuesto: ''
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.rolActual = localStorage.getItem('userRole') || 'usuario';
      this.isAdmin = this.rolActual === 'admin';
    }
    this.obtenerClientes();

    // Pre-rellenar repuesto si viene como query param
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['repuesto']) {
        this.nuevoCliente.repuesto = params['repuesto'];
      }
    });
  }

  obtenerClientes(): void {
    this.clienteServicio.getClientes().subscribe(datos => {
      this.listaClientes.set(datos);
    });
  }

  /** Cuando el usuario cambia la fecha, validar disponibilidad */
  onFechaChange(): void {
    const fecha = this.nuevoCliente.fecha;
    if (!fecha) return;

    this.verificandoFecha = true;
    this.diaCompleto = false;
    this.mensajeDisponibilidad = '';
    this.nuevoCliente.hora = '';

    this.clienteServicio.getClientesPorFecha(fecha).subscribe(turnosDia => {
      this.verificandoFecha = false;

      // ¿Hay alguna instalación ese día?
      const tieneInstalacion = turnosDia.some(t => t.tipoServicio === TIPO_INSTALACION);
      if (tieneInstalacion) {
        this.diaCompleto = true;
        this.horasDisponibles = [];
        this.mensajeDisponibilidad = '⚠️ Este día no tiene disponibilidad: hay una instalación agendada.';
        return;
      }

      // ¿El servicio que quiere el cliente es instalación?
      if (this.nuevoCliente.tipoServicio === TIPO_INSTALACION && turnosDia.length > 0) {
        this.diaCompleto = true;
        this.horasDisponibles = [];
        this.mensajeDisponibilidad = '⚠️ Para instalar necesitas un día sin ningún otro turno. Elige otra fecha.';
        return;
      }

      // Calcular horas ocupadas por mantenimientos (bloque de 2h)
      const horasOcupadas = new Set<string>();
      turnosDia.forEach(t => {
        if (t.hora) horasOcupadas.add(t.hora);
      });

      this.horasDisponibles = HORAS_BASE.filter(h => !horasOcupadas.has(h));

      if (this.horasDisponibles.length === 0) {
        this.mensajeDisponibilidad = '⚠️ No hay bloques disponibles este día. Elige otra fecha.';
      } else {
        this.mensajeDisponibilidad = `✅ ${this.horasDisponibles.length} bloque(s) disponible(s).`;
      }
    });
  }

  /** Si cambia el tipo de servicio también re-validamos la fecha */
  onServicioChange(): void {
    if (this.nuevoCliente.fecha) {
      this.onFechaChange();
    }
  }

  registrarCliente(): void {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.placaVehiculo) {
      alert('Por favor llena los datos requeridos (Nombre y Placa).');
      return;
    }
    if (!this.nuevoCliente.fecha || !this.nuevoCliente.hora) {
      alert('Por favor selecciona una fecha y hora disponible.');
      return;
    }
    if (this.diaCompleto) {
      alert('El día seleccionado no tiene disponibilidad. Elige otra fecha.');
      return;
    }

    if (!this.nuevoCliente.estado) {
      this.nuevoCliente.estado = 'en curso';
    }

    // Limpiar repuesto vacío
    if (!this.nuevoCliente.repuesto) {
      delete this.nuevoCliente.repuesto;
    }

    if (this.editando && this.nuevoCliente.id) {
      this.clienteServicio.putCliente(this.nuevoCliente.id, this.nuevoCliente).subscribe(() => {
        this.limpiarFormulario();
        alert('¡Agendamiento actualizado con éxito!');
      });
    } else {
      this.clienteServicio.postCliente(this.nuevoCliente).subscribe(() => {
        this.limpiarFormulario();
        alert('¡Agendamiento enviado con éxito!');
      });
    }
  }

  marcarComoFinalizado(cliente: Usuario): void {
    if (cliente.id) {
      const clienteActualizado = { ...cliente, estado: 'finalizado' };
      this.clienteServicio.putCliente(cliente.id, clienteActualizado).subscribe(() => { });
    }
  }

  eliminarCliente(id: string | undefined): void {
    if (id && confirm('¿Desea eliminar este agendamiento de la cola?')) {
      this.clienteServicio.deleteCliente(id).subscribe(() => { });
    }
  }

  editarCliente(cliente: Usuario): void {
    this.editando = true;
    this.nuevoCliente = { ...cliente };
    if (this.nuevoCliente.fecha) {
      this.onFechaChange();
    }
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.diaCompleto = false;
    this.mensajeDisponibilidad = '';
    this.horasDisponibles = [...HORAS_BASE];
    this.nuevoCliente = {
      nombre: '', telefono: '', placaVehiculo: '',
      tipoServicio: '', estado: 'en curso', fecha: '', hora: '', repuesto: ''
    };
  }
}