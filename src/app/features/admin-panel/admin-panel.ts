import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { CloudinaryService } from '../../services/cloudinary.service';
import { ClienteServicio } from '../../services/cliente-servicio';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {
  // Inyecciones de los servicios
  private cloudinaryService = inject(CloudinaryService);
  private clienteServicio = inject(ClienteServicio);

  // Estados reactivos para controlar la subida
  isUploading = signal<boolean>(false);
  notasIngreso = signal<string>('');

  // Turnos / Clientes para check-in
  turnos = signal<Usuario[]>([]);

  // Registro de nuevos usuarios del sistema
  nuevoCorreo = '';
  nuevaPassword = '';
  nuevoRol = 'usuario'; // por defecto

  errorMsj = '';
  exitoMsj = '';
  cargando = false;

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.clienteServicio.getClientes().subscribe({
      next: (clientes) => {
        this.turnos.set(clientes);
      },
      error: (err) => {
        console.error('Error al cargar turnos:', err);
      }
    });
  }

  /**
   * Se ejecuta al elegir una foto. Sube a Cloudinary y luego a Firebase.
   */
  onFileSelected(event: any, turno: Usuario) {
    if (!turno.id) return;
    
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading.set(true); // Mostramos estado de carga
      
      this.cloudinaryService.subirImagenVehiculo(file).subscribe({
        next: (urlSegura) => {
          this.isUploading.set(false); // Ocultamos estado de carga
          this.guardarReporteIngreso(turno, urlSegura, this.notasIngreso());
        },
        error: (err) => {
          console.error('Error al subir la imagen:', err);
          this.isUploading.set(false);
          alert('Hubo un error al subir la imagen.');
        }
      });
    }
  }

  /**
   * Actualiza el turno en Firebase con la nueva URL y notas
   */
  guardarReporteIngreso(turno: Usuario, urlFoto: string, notas: string) {
    // Actualizamos el objeto turno con el nuevo estadoIngreso
    const turnoActualizado: Usuario = {
      ...turno,
      estadoIngreso: {
        fechaRegistro: new Date().toISOString(),
        fotosUrls: [urlFoto],
        notas: notas
      }
    };
    
    // Lo guardamos en Firebase usando tu servicio existente
    if (turno.id) {
      this.clienteServicio.putCliente(turno.id, turnoActualizado).subscribe(() => {
        alert('Check-in del vehículo registrado con éxito.');
        this.notasIngreso.set(''); // Limpiamos el campo
      });
    }
  }

  crearUsuario() {
    if (!this.nuevoCorreo || !this.nuevaPassword) {
      this.errorMsj = 'Correo y contraseña obligatorios';
      return;
    }
    this.cargando = true;
    this.errorMsj = '';
    this.exitoMsj = '';

    const auth = getAuth();
    const db = getDatabase();

    createUserWithEmailAndPassword(auth, this.nuevoCorreo, this.nuevaPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Guardar el rol en Realtime Database
        const userRef = ref(db, `usuarios/${user.uid}`);
        set(userRef, { rol: this.nuevoRol })
          .then(() => {
            this.exitoMsj = `Usuario creado exitosamente con el rol de ${this.nuevoRol}.`;
            this.nuevoCorreo = '';
            this.nuevaPassword = '';
            this.nuevoRol = 'usuario';
          })
          .catch((err) => {
            console.error("Error guardando rol: ", err);
            this.errorMsj = "Usuario creado, pero hubo un error al asignar rol.";
          }).finally(() => {
            this.cargando = false;
          });
      })
      .catch((error) => {
        console.error("Error creando usuario: ", error);
        this.errorMsj = "Hubo un error al crear el usuario. Verifica que la contraseña sea mayor a 6 caracteres y el correo tenga un formato válido.";
        this.cargando = false;
      });
  }
}

// Alias de compatibilidad
export { AdminPanel as AdminPanelComponent };
