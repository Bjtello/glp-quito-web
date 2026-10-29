import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';
import { getDatabase, ref, push, set, remove, update, onValue, get, child } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class ClienteServicio {

  // Guardar un nuevo agendamiento (POST)
  postCliente(cliente: Usuario): Observable<Usuario> {
    return new Observable(observer => {
      const db = getDatabase();
      const clientesRef = ref(db, 'clientes');
      const nuevoRef = push(clientesRef);
      set(nuevoRef, cliente).then(() => {
        observer.next({ ...cliente, id: nuevoRef.key as string });
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  // Obtener todos los clientes (GET) -> Realtime
  getClientes(): Observable<Usuario[]> {
    return new Observable(observer => {
      const db = getDatabase();
      const clientesRef = ref(db, 'clientes');
      onValue(clientesRef, (snapshot) => {
        const datos = snapshot.val();
        if (!datos) {
          observer.next([]);
        } else {
          const arr = Object.keys(datos).map(id => ({
            ...datos[id],
            id: id
          }));
          observer.next(arr);
        }
      }, (error) => {
        observer.error(error);
      });
    });
  }

  // Buscar agendamiento por ID
  getClienteById(id: string): Observable<Usuario> {
    return new Observable(observer => {
      const db = getDatabase();
      get(child(ref(db), `clientes/${id}`)).then(snapshot => {
        if (snapshot.exists()) {
          observer.next({ ...snapshot.val(), id });
        } else {
          observer.error("Not found");
        }
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  // Actualizar datos de un cliente (PUT)
  putCliente(id: string, cliente: Usuario): Observable<Usuario> {
    return new Observable(observer => {
      const db = getDatabase();
      update(ref(db, `clientes/${id}`), cliente).then(() => {
        observer.next(cliente);
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  // Eliminar un agendamiento (DELETE)
  deleteCliente(id: string): Observable<void> {
    return new Observable(observer => {
      const db = getDatabase();
      remove(ref(db, `clientes/${id}`)).then(() => {
        observer.next();
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }

  // Obtener clientes de una fecha específica (para validar disponibilidad)
  getClientesPorFecha(fecha: string): Observable<Usuario[]> {
    return new Observable(observer => {
      const db = getDatabase();
      const clientesRef = ref(db, 'clientes');
      get(clientesRef).then(snapshot => {
        const datos = snapshot.val();
        if (!datos) {
          observer.next([]);
        } else {
          const arr: Usuario[] = Object.keys(datos)
            .map(id => ({ ...datos[id], id }))
            .filter((c: Usuario) => c.fecha === fecha);
          observer.next(arr);
        }
        observer.complete();
      }).catch(err => observer.error(err));
    });
  }
}