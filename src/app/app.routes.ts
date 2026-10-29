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
import { Repuestos } from './features/repuestos/repuestos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registro', component: RegistroCliente },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'nosotros', component: Nosotros, canActivate: [authGuard] },
  { path: 'servicios', component: Servicios, canActivate: [authGuard] },
  { path: 'repuestos', component: Repuestos, canActivate: [authGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminPanel, canActivate: [adminGuard] },
];