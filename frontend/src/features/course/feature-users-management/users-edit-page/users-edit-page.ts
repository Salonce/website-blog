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

  getRoleBadgeClass(role: Role): string {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
    
    switch(role) {
      case Role.ADMIN:
        return `${baseClasses} bg-red-100 text-red-800`;
      case Role.MODERATOR:
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case Role.EDITOR:
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case Role.USER:
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  }

  getActiveRoleButtonClass(role: Role): string {
    const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 border-2';
    
    switch(role) {
      case Role.ADMIN:
        return `${baseClasses} bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700`;
      case Role.MODERATOR:
        return `${baseClasses} bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600`;
      case Role.EDITOR:
        return `${baseClasses} bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700`;
      case Role.USER:
        return `${baseClasses} bg-gray-600 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-700`;
      default:
        return `${baseClasses} bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700`;
    }
  }

  getInactiveRoleButtonClass(role: Role): string {
    const baseClasses = 'inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 border-2 bg-white';
    
    switch(role) {
      case Role.ADMIN:
        return `${baseClasses} text-red-600 border-red-300 hover:bg-red-50 hover:border-red-500`;
      case Role.MODERATOR:
        return `${baseClasses} text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:border-yellow-500`;
      case Role.EDITOR:
        return `${baseClasses} text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-500`;
      case Role.USER:
        return `${baseClasses} text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-500`;
      default:
        return `${baseClasses} text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-500`;
    }
  }
}