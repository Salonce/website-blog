import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../core/account-service/account-service';
import { Account } from '../../../../core/models/account';
@Component({
  selector: 'app-account-edit-page',
  imports: [FormsModule],
  templateUrl: './account-edit-page.html',
  styleUrl: './account-edit-page.css'
})
export class AccountEditPage {

  originalAccount: Account | null = null;
  account = { name: '', email: '' };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAccount().subscribe({
      next: (data) => this.originalAccount = data,
      error: (err) => console.error('Failed to fetch accounts', err)
    });
  }

  onSave() {
    console.log(this.account);
  }

  onCancel() {
    if (this.originalAccount) {
      this.account = { ...this.originalAccount };
    }
  }
}
