import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Principal } from '../../../core/models/principal';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private principalSubject = new BehaviorSubject<Principal | null>(null);
  principal$ = this.principalSubject.asObservable();

  constructor(private http: HttpClient) {}

  checkAuth() {
    this.http.get<Principal>('/api/auth', { withCredentials: true })
      .pipe(
        catchError(() => of(null)) 
      )
      .subscribe(principal => {
        this.principalSubject.next(principal);
      });
  }

  logout() {
    this.http.post('/logout', {}, { withCredentials: true })
      .subscribe({
        next: () => this.principalSubject.next(null),  
        error: () => this.principalSubject.next(null)   
      });
  }

  /* V not needed? V*/

  setAccount(principal: Principal) {
    this.principalSubject.next(principal);
  }

  isLoggedIn(): boolean {
    return this.principalSubject.value !== null;
  }
}