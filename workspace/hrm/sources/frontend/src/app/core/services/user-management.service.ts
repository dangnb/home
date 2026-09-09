import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ManagedUser, UserRole } from '../models/user-management.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private usersState = signal<ManagedUser[]>([
    {
      id: '1',
      name: 'Emma Smith',
      email: 'smith@kpmg.com',
      avatar: 'assets/media/avatars/300-6.jpg',
      role: 'Administrator',
      twoStep: true,
      lastLogin: 'Yesterday',
      joinedDate: '25 Jul 2022, 5:20 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '2',
      name: 'Melody Macy',
      email: 'melody@altbox.com',
      initials: 'M',
      initialsColor: 'danger',
      role: 'Analyst',
      twoStep: true,
      lastLogin: '20 mins ago',
      joinedDate: '25 Oct 2022, 9:23 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '3',
      name: 'Max Smith',
      email: 'max@kt.com',
      avatar: 'assets/media/avatars/300-1.jpg',
      role: 'Developer',
      twoStep: false,
      lastLogin: '3 days ago',
      joinedDate: '15 Apr 2022, 11:05 am',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '4',
      name: 'Sean Bean',
      email: 'sean@dellito.com',
      avatar: 'assets/media/avatars/300-5.jpg',
      role: 'Support',
      twoStep: true,
      lastLogin: '5 hours ago',
      joinedDate: '10 Mar 2022, 6:05 pm',
      status: 'Suspended',
      statusColor: 'danger'
    },
    {
      id: '5',
      name: 'Brian Cox',
      email: 'brian@exchange.com',
      avatar: 'assets/media/avatars/300-25.jpg',
      role: 'Developer',
      twoStep: true,
      lastLogin: '2 days ago',
      joinedDate: '19 Aug 2022, 6:05 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '6',
      name: 'Mikaela Collins',
      email: 'mik@pex.com',
      initials: 'C',
      initialsColor: 'warning',
      role: 'Administrator',
      twoStep: false,
      lastLogin: '5 days ago',
      joinedDate: '20 Jun 2022, 8:43 pm',
      status: 'Pending',
      statusColor: 'warning'
    },
    {
      id: '7',
      name: 'Francis Mitcham',
      email: 'f.mit@kpmg.com',
      avatar: 'assets/media/avatars/300-9.jpg',
      role: 'Trial',
      twoStep: false,
      lastLogin: '3 weeks ago',
      joinedDate: '15 Apr 2022, 5:30 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '8',
      name: 'Olivia Wild',
      email: 'olivia@corpmail.com',
      initials: 'O',
      initialsColor: 'danger',
      role: 'Administrator',
      twoStep: false,
      lastLogin: 'Yesterday',
      joinedDate: '20 Jun 2022, 11:30 am',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '9',
      name: 'Neil Owen',
      email: 'owen.neil@gmail.com',
      initials: 'N',
      initialsColor: 'primary',
      role: 'Analyst',
      twoStep: true,
      lastLogin: '20 mins ago',
      joinedDate: '24 Jun 2022, 9:23 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '10',
      name: 'Dan Wilson',
      email: 'dam@consilting.com',
      avatar: 'assets/media/avatars/300-23.jpg',
      role: 'Developer',
      twoStep: false,
      lastLogin: '3 days ago',
      joinedDate: '20 Jun 2022, 8:43 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '11',
      name: 'Emma Bold',
      email: 'emma@intenso.com',
      initials: 'E',
      initialsColor: 'danger',
      role: 'Support',
      twoStep: true,
      lastLogin: '5 hours ago',
      joinedDate: '22 Sep 2022, 8:43 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '12',
      name: 'John Miller',
      email: 'miller@mapple.com',
      avatar: 'assets/media/avatars/300-13.jpg',
      role: 'Trial',
      twoStep: false,
      lastLogin: '3 weeks ago',
      joinedDate: '21 Feb 2022, 5:20 pm',
      status: 'Active',
      statusColor: 'success'
    },
    {
      id: '13',
      name: 'Lucy Kunic',
      email: 'lucy.m@fentech.com',
      initials: 'L',
      initialsColor: 'success',
      role: 'Administrator',
      twoStep: false,
      lastLogin: 'Yesterday',
      joinedDate: '21 Feb 2022, 9:23 pm',
      status: 'Active',
      statusColor: 'success'
    }
  ]);

  readonly users = this.usersState.asReadonly();

  private rolesState = signal<UserRole[]>([
    {
      id: '1',
      name: 'Administrator',
      description: 'Full access to manage all system settings, users, and financials.',
      totalUsers: 5,
      users: [
        { name: 'Emma', avatar: 'assets/media/avatars/300-6.jpg' },
        { name: 'Max', avatar: 'assets/media/avatars/300-3.jpg' },
        { name: 'Sean', avatar: 'assets/media/avatars/300-5.jpg' }
      ],
      permissions: ['All Admin Controls', 'User Management', 'Financial Reports', 'Audit Logs']
    },
    {
      id: '2',
      name: 'Developer',
      description: 'Access to developer tools, APIs, webhooks and sandbox environments.',
      totalUsers: 14,
      users: [
        { name: 'Max', avatar: 'assets/media/avatars/300-3.jpg' },
        { name: 'Brian', avatar: 'assets/media/avatars/300-25.jpg' }
      ],
      permissions: ['API Keys', 'Webhook Config', 'Sandbox Testing', 'Database Read']
    },
    {
      id: '3',
      name: 'Analyst',
      description: 'Can view analytics, reporting metrics and download data exports.',
      totalUsers: 8,
      users: [
        { name: 'Melody', avatar: 'assets/media/avatars/300-1.jpg' }
      ],
      permissions: ['Dashboard View', 'Data Export', 'Sales Reports']
    },
    {
      id: '4',
      name: 'Support',
      description: 'Can respond to customer tickets, view user status and reset passwords.',
      totalUsers: 3,
      users: [
        { name: 'Sean', avatar: 'assets/media/avatars/300-5.jpg' }
      ],
      permissions: ['Ticket Desk', 'User Profile Read', 'Password Reset']
    }
  ]);

  getUsers(): Observable<ManagedUser[]> {
    return of(this.usersState());
  }

  getUserById(id: string): ManagedUser | undefined {
    return this.usersState().find(u => u.id === id);
  }

  getRoles(): Observable<UserRole[]> {
    return of(this.rolesState());
  }

  addUser(user: Omit<ManagedUser, 'id' | 'joinedDate' | 'statusColor' | 'lastLogin'>): void {
    const newUser: ManagedUser = {
      ...user,
      id: (this.usersState().length + 1).toString(),
      lastLogin: 'Just now',
      joinedDate: 'Just now',
      statusColor: user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'
    };
    this.usersState.update(list => [newUser, ...list]);
  }

  updateUser(id: string, updates: Partial<ManagedUser>): void {
    this.usersState.update(list => list.map(u => {
      if (u.id === id) {
        return { ...u, ...updates };
      }
      return u;
    }));
  }

  deleteUser(id: string): void {
    this.usersState.update(list => list.filter(u => u.id !== id));
  }

  deleteUsers(ids: string[]): void {
    const set = new Set(ids);
    this.usersState.update(list => list.filter(u => !set.has(u.id)));
  }
}

