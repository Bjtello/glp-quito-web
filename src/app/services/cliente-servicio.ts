import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class ClienteServicio {

  private http = inject(HttpClient);

  // Aquí está tu URL exacta con el endpoint /clientes.json
  private API_CLIENTES = 'https://glp-quito-db-default-rtdb.firebaseio.com/clientes.json';
  
  // Base para peticiones con ID específico (PUT y DELETE)
  private API_BASE = 'https://glp-quito-db-default-rtdb.firebaseio.com/clientes';

  // Guardar un nuevo agendamiento (POST)
  postCliente(cliente: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_CLIENTES, cliente);
  }

  // Obtener todos los clientes (GET)
  getClientes(): Observable<Usuario[]> {
    return this.http
      .get<{ [key: string]: Usuario }>(this.API_CLIENTES)
      .pipe(
        map(datos => {
          if (!datos) {
            return [];
          }
          return Object.keys(datos).map(id => ({
            ...datos[id],
            id: id
          }));
        })
      );
  }

  // Buscar agendamiento por ID
  getClienteById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_BASE}/${id}.json`);
  }

  // Actualizar datos de un cliente (PUT)
  putCliente(id: string, cliente: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_BASE}/${id}.json`, cliente);
  }

  // Eliminar un agendamiento (DELETE)
  deleteCliente(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE}/${id}.json`);
  }
}