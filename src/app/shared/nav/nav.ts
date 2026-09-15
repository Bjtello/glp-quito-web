import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css']
})
export class Nav implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isMenuOpen = false;
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Verificamos al iniciar si hay una sesión, polling básico u oyendo eventos si fuera necesario
  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && window.localStorage) {
      this.isLoggedIn = !!localStorage.getItem("userRole");
      this.isAdmin = localStorage.getItem("userRole") === 'admin';

      // Polling sencillo simulando escucha para Reactividad si se cambia de cuenta
      setInterval(() => {
        this.isLoggedIn = !!localStorage.getItem("userRole");
        this.isAdmin = localStorage.getItem("userRole") === 'admin';
      }, 1000);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  cerrarSesion() {
    const auth = getAuth();
    signOut(auth).then(() => {
      localStorage.removeItem("userRole");
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }).catch(err => {
      console.error(err);
      localStorage.removeItem("userRole");
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    });
  }
}