import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service/user-service';
import { Role, UserResponse } from '../../dtos/user-response';

@Component({
  selector: 'app-users-edit-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-edit-page.html',
  styleUrl: './users-edit-page.css'
})
export class UsersEditPage implements OnInit {
  users: UserResponse[] = [];
  isLoading = true;
  error: string | null = null;
  
  // Only toggleable roles (excluding ADMIN)
  availableRoles: Role[] = [Role.MODERATOR, Role.EDITOR, Role.USER];
  
  // Expose Role enum to template
  Role = Role;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.isLoading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  hasRole(user: UserResponse, role: Role): boolean {
    return user.roles.includes(role);
  }

  toggleRole(user: UserResponse, role: Role): void {
    if (this.hasRole(user, role)) {
      this.removeRole(user, role);
    } else {
      this.addRole(user, role);
    }
  }

  private addRole(user: UserResponse, role: Role): void {
    this.userService.addRole(user.id, role).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => {
        console.error('Error adding role:', err);
        this.error = `Failed to add ${role} role to ${user.name}`;
      }
    });
  }

  private removeRole(user: UserResponse, role: Role): void {
    this.userService.removeRole(user.id, role).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => {
        console.error('Error removing role:', err);
        this.error = `Failed to remove ${role} role from ${user.name}`;
      }
    });
  }
}