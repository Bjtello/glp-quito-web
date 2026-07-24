import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Servicios } from './features/servicios/servicios';
import { Nosotros } from './features/nosotros/nosotros';
import { UsuariosComponent } from './features/usuarios/usuarios'; 

export const routes: Routes = [
  { path: "home", component: Home },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "nosotros", component: Nosotros },
  { path: "servicios", component: Servicios }, 
  { path: "usuarios", component: UsuariosComponent } 
];