import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Account } from '../../models/account';
import { environment } from '../../../../app/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class AccountService {

    private apiUrl = environment.apiUrl;
    private accountUrl = this.apiUrl + '/account';
    private profileUrl = this.apiUrl + '/profile';

    constructor(private http: HttpClient) {}

    getAccount(): Observable<Account> {
      return this.http.get<Account>(this.accountUrl, { withCredentials: true });
    }

    patchAccount(partialAccount: Partial<Account>): Observable<Account> {
      return this.http.patch<Account>(
        this.profileUrl,
        partialAccount,
        { withCredentials: true }
      );
    }
}
