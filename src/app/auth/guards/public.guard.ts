import { Injectable } from '@angular/core';
import { CanMatch, CanActivate, Router, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {
    
    constructor(
        private authService: AuthService,
        private router: Router
        ) { }
    
    //para centralizar la petición que es igual en canMatch y canActivate
    private checkAuthStatus(): boolean | Observable<boolean> {
    
        return this.authService.checkAuthentication()
            .pipe (
                tap( isAuthenticated => console.log('Authenticated', isAuthenticated) ),
                tap( isAuthenticated => {
                    if ( isAuthenticated ) {
                        this.router.navigate(['./']) //para que un user loggeado no pueda volver atrás a la página de login a menos que haga logout
                    }
                }),
                map( isAuthenticated => !isAuthenticated ) //no hace falta estar autenticado para ver el contenido de los heroes
            )
    
    }
    
    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        //console.log('Can Match');
        //console.log({ route, segments })
    
        return this.checkAuthStatus();
    }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        //console.log('Can Activate');
        //console.log({ route, state })
    
        return this.checkAuthStatus();
    }
    
}