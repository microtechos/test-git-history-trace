import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', isActive: true, createdAt: new Date('2024-01-15') },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'editor', isActive: true, createdAt: new Date('2024-03-20') },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', isActive: false, createdAt: new Date('2024-06-10') },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'editor', isActive: true, createdAt: new Date('2024-09-05') },
  ]);

  readonly allUsers = this.users.asReadonly();
  readonly activeUsers = computed(() => this.users().filter(u => u.isActive));
  readonly userCount = computed(() => this.users().length);

  getUserById(id: number): User | undefined {
    return this.users().find(u => u.id === id);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newUser: User = {
      ...user,
      id: Math.max(...this.users().map(u => u.id)) + 1,
      createdAt: new Date(),
    };
    this.users.update(users => [...users, newUser]);
  }

  removeUser(id: number): void {
    this.users.update(users => users.filter(u => u.id !== id));
  }

  toggleUserStatus(id: number): void {
    this.users.update(users =>
      users.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u)
    );
  }
}
