import { Component } from '@angular/core';
// Importamos tu formulario (verifica que la ruta y el nombre de la clase sean correctos)
import { FormularioReserva } from '../../shared/formulario-reserva/formulario-reserva'; 

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormularioReserva], // Agrégalo aquí
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent { }