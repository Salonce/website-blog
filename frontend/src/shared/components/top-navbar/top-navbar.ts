import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../core/auth-service/auth-service';
import { Principal } from '../../../core/models/principal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.css'
})
export class TopNavbar {
  isOpen = false;
  
  principal$: Observable<Principal | null>;

  constructor(private authService: AuthService){
    this.principal$ = this.authService.principal$;
  }

  onLogout() : void {
    this.authService.logout();
  }
}
