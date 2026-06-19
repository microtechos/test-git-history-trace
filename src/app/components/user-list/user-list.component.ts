import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  imports: [FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private userService = inject(UserService);

  users = this.userService.allUsers;
  activeUsers = this.userService.activeUsers;
  userCount = this.userService.userCount;
  adminCount = this.userService.adminCount;

  showActiveOnly = false;
  searchQuery = '';
  selectedRole: 'all' | 'admin' | 'editor' | 'viewer' = 'all';

  get displayedUsers() {
    let result = this.showActiveOnly ? this.activeUsers() : this.users();

    if (this.searchQuery.trim()) {
      result = this.userService.searchUsers(this.searchQuery);
    }

    if (this.selectedRole !== 'all') {
      result = result.filter(u => u.role === this.selectedRole);
    }

    return result;
  }

  onToggleStatus(userId: number): void {
    this.userService.toggleUserStatus(userId);
  }

  onRemoveUser(userId: number): void {
    this.userService.removeUser(userId);
  }

  onRoleChange(userId: number, newRole: 'admin' | 'editor' | 'viewer'): void {
    this.userService.updateUser(userId, { role: newRole });
  }
}
