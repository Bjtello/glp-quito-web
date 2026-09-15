import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanel {
  nuevoCorreo = '';
  nuevaPassword = '';
  nuevoRol = 'usuario'; // por defecto

  errorMsj = '';
  exitoMsj = '';
  cargando = false;

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
