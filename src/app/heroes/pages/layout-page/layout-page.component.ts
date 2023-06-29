import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/services/auth.service';
import { User } from 'src/app/auth/interfaces/user.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Listing', icon: 'label', url: './list' },
    { label: 'Add', icon: 'add', url: './new-hero' },
    { label: 'Search', icon: 'search', url: './search' }

  ];

  constructor( 
    private authService:AuthService,
    private router: Router
    ){}

    get user():User | undefined {
      return this.authService.currentUser;
    }

    onLogout() {
      this.authService.logout();
      this.router.navigate(['/auth/login']) //se utiliza el router para que, a través de navigate saquemos al user de nuestra web y le lleve a login
    }

}