import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get, child } from "firebase/database";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMsj = '';

  constructor(private router: Router) { }

  iniciarSesion() {
    const auth = getAuth();
    const dbRef = ref(getDatabase());

    signInWithEmailAndPassword(auth, this.email, this.password)
      .then((userCredential) => {
        const user = userCredential.user;

        get(child(dbRef, `usuarios/${user.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const datosUsuario = snapshot.val();
            console.log("Rol del usuario:", datosUsuario.rol);
            localStorage.setItem("userRole", datosUsuario.rol);
            this.router.navigate(['/usuarios']); // Según el user va a /inicio, pero dijo que va a /usuarios
          } else {
            // Default if no role is explicitly assigned
            localStorage.setItem("userRole", "usuario");
            this.router.navigate(['/usuarios']);
          }
        }).catch(err => {
          this.errorMsj = "Error al obtener datos del usuario.";
        });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión", error);
        this.errorMsj = "Correo o contraseña incorrectos.";
      });
  }
}
