import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Role, UserResponse } from '../../dtos/user-response';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private readonly apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`);
  }

  addRole(userId: number, role: Role): Observable<UserResponse> {
    return this.http.post<UserResponse>(
      `${this.apiUrl}/users/${userId}/roles/${role}`,
      {}
    );
  }

  removeRole(userId: number, role: Role): Observable<UserResponse> {
    return this.http.delete<UserResponse>(
      `${this.apiUrl}/users/${userId}/roles/${role}`
    );
  }
}
