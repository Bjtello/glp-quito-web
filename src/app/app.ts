import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from './shared/nav/nav';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Nav, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'glp-quito-web';
}