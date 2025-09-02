import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
  role: 'MS' | 'JDC' | 'AR';
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // Stats data
  totalCitizens: number = 12847;
  activeCoordinators: number = 24;
  adminUsers: number = 8;

  // Search and filter
  searchTerm: string = '';
  activeTab: string = 'citizens';

  // Users data
  users: User[] = [
    {
      id: '1',
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '09123456789',
      location: 'North Bay Blvd',
      status: 'Active',
      role: 'MS'
    },
    {
      id: '2',
      name: 'Juan Dela Cruz',
      email: 'juan@email.com',
      phone: '09123456788',
      location: 'Tangos',
      status: 'Active',
      role: 'JDC'
    },
    {
      id: '3',
      name: 'Ana Rodriguez',
      email: 'ana@email.com',
      phone: '09123456787',
      location: 'Bagumbayan',
      status: 'Inactive',
      role: 'AR'
    },
    {
      id: '4',
      name: 'Steven Keaton',
      email: 'maria@email.com',
      phone: '09123456789',
      location: 'North Bay Blvd',
      status: 'Active',
      role: 'MS'
    },
    {
      id: '5',
      name: 'Geoffrey Butler',
      email: 'juan@email.com',
      phone: '09123456788',
      location: 'Tangos',
      status: 'Inactive',
      role: 'JDC'
    },
    {
      id: '6',
      name: 'Carlton Banks',
      email: 'ana@email.com',
      phone: '09123456787',
      location: 'Bagumbayan',
      status: 'Active',
      role: 'AR'
    }
  ];

  filteredUsers: User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.filteredUsers = [...this.users];
  }

  /**
   * Get user initials for avatar display
   */
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  /**
   * Handle search functionality
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers = [...this.users];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.location.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchLower)
    );
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Here you can implement different filtering based on tab selection
    // For now, we'll just update the active tab
  }

  /**
   * Edit user functionality
   */
  editUser(user: User): void {
    console.log('Editing user:', user);
    // Implement edit user logic here
    // This could open a modal or navigate to an edit page
  }

  /**
   * Add new user functionality
   */
  addUser(): void {
    console.log('Adding new user');
    // Implement add user logic here
  }

  /**
   * Get status color class
   */
  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }
}
