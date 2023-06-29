import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError, map, of, tap } from 'rxjs';

import { environments } from 'src/app/environments/environments';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User; //es private porque no queremos que de ninguna manera, fuera de este servicio, vaya a ser modificado o manipulado

  constructor(private http: HttpClient) { }

  get currentUser():User|undefined {
    if ( !this.user ) return undefined;
    return structuredClone( this.user ); //hace un deep clone
  }


  //metodo de autenticación
  login(email: string, password: string):Observable<User> {

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        tap( user => localStorage.setItem('token', 'ljsdhfkjsf.kjsdhgf.khf' )),
      );
  }

  checkAuthentication(): Observable<boolean> | boolean {

    if ( !localStorage.getItem('token') ) return false;

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( err => of(false) )
      )

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }

}
