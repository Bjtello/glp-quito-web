import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteServicio } from '../../services/cliente-servicio';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-formulario-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './formulario-reserva.html',
  styleUrls: ['./formulario-reserva.css']
})
export class FormularioReserva implements OnInit {
  
  // 1. Usamos inyección moderna en lugar del constructor
  private clienteServicio = inject(ClienteServicio);

  // 2. Signals para manejar la lista de clientes en tiempo real
  listaClientes = signal<Usuario[]>([]);
  
  // 3. Variable para controlar si estamos creando o actualizando
  editando = false;

  // Objeto para enlazar con el formulario
  nuevoCliente: Usuario = {
    nombre: '',
    telefono: '',
    placaVehiculo: '',
    tipoServicio: ''
  };

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteServicio.getClientes().subscribe(datos => {
      this.listaClientes.set(datos);
    });
  }

  // Método unificado para crear o editar
  registrarCliente(): void {
    // Validación básica
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.placaVehiculo) {
      alert('Por favor llena los datos requeridos (Nombre y Placa).');
      return;
    }

    if (this.editando && this.nuevoCliente.id) {
      // Si estamos editando, usamos putCliente (asegúrate de tener este método en tu servicio)
      this.clienteServicio.putCliente(this.nuevoCliente.id, this.nuevoCliente).subscribe(() => {
        this.obtenerClientes();
        this.limpiarFormulario();
        alert('¡Agendamiento actualizado con éxito!');
      });
    } else {
      // Si es un registro nuevo, usamos postCliente
      this.clienteServicio.postCliente(this.nuevoCliente).subscribe(() => {
        this.obtenerClientes();
        this.limpiarFormulario();
        alert('¡Agendamiento enviado con éxito a la base de datos!');
      });
    }
  }

  eliminarCliente(id: string | undefined): void {
    if (id && confirm('¿Desea eliminar este agendamiento de la cola?')) {
      this.clienteServicio.deleteCliente(id).subscribe(() => {
        // Actualizamos el signal directamente para que desaparezca al instante en pantalla
        this.listaClientes.update(clientes => clientes.filter(c => c.id !== id));
      });
    }
  }

  editarCliente(cliente: Usuario): void {
    this.editando = true;
    this.nuevoCliente = { ...cliente };
  }

  limpiarFormulario(): void {
    this.editando = false;
    this.nuevoCliente = { nombre: '', telefono: '', placaVehiculo: '', tipoServicio: '' };
  }
}