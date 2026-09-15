import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro-cliente.html',
  styleUrl: './registro-cliente.css'
})
export class RegistroCliente {
  nuevoCorreo = '';
  nuevaPassword = '';

  errorMsj = '';
  cargando = false;

  constructor(private router: Router) { }

  registrarCliente() {
    if (!this.nuevoCorreo || !this.nuevaPassword) {
      this.errorMsj = 'Correo y contraseña son obligatorios';
      return;
    }

    this.cargando = true;
    this.errorMsj = '';

    const auth = getAuth();
    const db = getDatabase();

    createUserWithEmailAndPassword(auth, this.nuevoCorreo, this.nuevaPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Guardar automáticamente el rol como 'usuario'
        const userRef = ref(db, `usuarios/${user.uid}`);
        set(userRef, { rol: 'usuario' })
          .then(() => {
            // Guardar localmente para mantener la sesión
            localStorage.setItem("userRole", "usuario");
            // Redirigir a vista de clientes
            this.router.navigate(['/usuarios']).then(() => {
              window.location.reload(); // Asegurar refresco de NAV
            });
          })
          .catch((err) => {
            console.error("Error guardando rol: ", err);
            this.errorMsj = "Usuario creado, pero hubo un error al asignar permisos.";
            this.cargando = false;
          });
      })
      .catch((error) => {
        console.error("Error creando usuario: ", error);
        this.errorMsj = "Hubo un error al crear tu cuenta. Verifica que la contraseña sea mayor a 6 caracteres y el correo sea válido.";
        this.cargando = false;
      });
  }
}
