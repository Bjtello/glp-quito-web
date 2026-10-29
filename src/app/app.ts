import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Nav } from './shared/nav/nav';
import { Footer } from './shared/footer/footer';
import { filter } from 'rxjs/operators';

const SHELL_HIDDEN_ROUTES = ['/login', '/registro'];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, Nav, Footer],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'glp-quito-web';
  showShell = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.urlAfterRedirects.split('?')[0];
        this.showShell.set(!SHELL_HIDDEN_ROUTES.includes(url));
      });
  }
}