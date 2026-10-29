import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
            this.router.navigate(['/usuarios']);
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

  recuperarContrasena() {
    const correoActual = this.email.trim();

    if (!correoActual) {
      alert('Por favor, ingresa tu correo electrónico en el campo superior y presiona este botón nuevamente.');
      return;
    }

    const auth = getAuth();

    sendPasswordResetEmail(auth, correoActual)
      .then(() => {
        alert(`Te hemos enviado un correo a ${correoActual} con las instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada o carpeta de Spam.`);
      })
      .catch((error) => {
        console.error('Error al enviar correo de recuperación:', error);
        
        // Manejo de errores comunes
        if (error.code === 'auth/invalid-email') {
          alert('El formato del correo es inválido.');
        } else if (error.code === 'auth/user-not-found') {
          alert('No existe ninguna cuenta registrada con este correo.');
        } else {
          alert('Hubo un error al intentar enviar el correo. Verifica los datos.');
        }
      });
  }
}

// Alias de compatibilidad
export { Login as LoginComponent };
