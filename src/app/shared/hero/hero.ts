import { Component, Input } from '@angular/core'; // 1. Agregamos Input aquí
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.css']
})
export class Hero {
  // 2. Declaramos las variables para recibir los textos desde home.html
  @Input() titulo: string = '';
  @Input() contenido: string = '';
  @Input() textoBoton: string = '';

  // Solo tus 4 URLs de Postimages
  imagenes: string[] = [
    'https://i.postimg.cc/BZPV5vKv/Gemini-Generated-Image-z4ywvoz4ywvoz4yw.png',
    'https://i.postimg.cc/T31mmKyd/MOTOR-CON-GAS-GLP.webp',
    'https://i.postimg.cc/QtTHm5DQ/SD126P-COMPLET-KIT-800x729.jpg',
    'https://i.postimg.cc/0QwbnmvD/images-(1).jpg'
  ];

  imagenActual: number = 0;

  cambiarImagen(indice: number): void {
    this.imagenActual = indice;
  }
}