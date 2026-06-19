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

  showActiveOnly = false;

  get displayedUsers() {
    return this.showActiveOnly ? this.activeUsers() : this.users();
  }

  onToggleStatus(userId: number): void {
    this.userService.toggleUserStatus(userId);
  }

  onRemoveUser(userId: number): void {
    this.userService.removeUser(userId);
  }
}
