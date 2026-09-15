import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Servicios } from './features/servicios/servicios';
import { Nosotros } from './features/nosotros/nosotros';
import { UsuariosComponent } from './features/usuarios/usuarios';
import { Login } from './features/login/login';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { AdminPanel } from './features/admin-panel/admin-panel';
import { RegistroCliente } from './features/registro-cliente/registro-cliente';

export const routes: Routes = [
  { path: "home", component: Home },
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "nosotros", component: Nosotros },
  { path: "servicios", component: Servicios },
  { path: "usuarios", component: UsuariosComponent, canActivate: [authGuard] },
  { path: "login", component: Login },
  { path: "admin", component: AdminPanel, canActivate: [adminGuard] },
  { path: "registro", component: RegistroCliente }
];