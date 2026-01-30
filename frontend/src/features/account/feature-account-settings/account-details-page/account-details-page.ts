import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account-service/account-service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-details-page',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './account-details-page.html',
  styleUrl: './account-details-page.css'
})
export class AccountDetailsPage implements OnInit {
  account: Account | null = null;
  draftAccount: Partial<Account> = {};
  
  editingFields: { [key in keyof Partial<Account>]: boolean } = {
    name: false,
    email: false,
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccount().subscribe({
      next: (data: Account) => this.account = data,
      error: (err: any) => console.error('Failed to fetch account', err)
    });
  }

  toggleEdit<K extends keyof Account>(field: K, state: boolean): void {
    this.editingFields[field] = state;
    if (state && this.account) {
      this.draftAccount[field] = this.account[field];
    }
  }

  saveField<K extends keyof Account>(field: K): void {
    if (!this.account) return;
    
    const value = this.draftAccount[field];
    if (value === undefined || value === this.account[field]) {
      this.toggleEdit(field, false);
      return;
    }

    this.accountService.patchAccount({ [field]: value }).subscribe({
      next: (updated: Account) => {
        this.account = updated;
        this.draftAccount = {};
        this.toggleEdit(field, false);
      },
      error: (err: any) => {
        console.error('PATCH failed:', err);
        console.error('Status:', err.status);
        console.error('Error body:', err.error);
      }
    });
  }
}