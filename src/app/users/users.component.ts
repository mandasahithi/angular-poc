import { Component, OnInit, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

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
  imports: [CommonModule, FormsModule ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // Stats data
  get totalCitizens(): number { return this.users.length; }
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
    },
    {
      id: '7',
      name: 'kertilin Banks',
      email: 'bnb@email.com',
      phone: '09023456787',
      location: 'gumbayan',
      status: 'Inactive',
      role: 'AR'
    }
  ];

  filteredUsers: User[] = [];
  // editing state
  editingUserId: string | null = null;
  editedUser: Partial<User> = {};
  // modal form state
  showForm: boolean = false;
  isEditMode: boolean = false;
  // form submit state
  submitted: boolean = false;
  // filter state
  selectedStatus: string = '';
  selectedRole: string = '';
  // filter popover UI state
  showFilterPopover: boolean = false;
  // temporary staging selection inside popover (so Cancel can revert)
  tempSelectedStatus: string = '';

  constructor() { }

  ngOnInit(): void {
  this.filteredUsers = [...this.users];
  }

  /**
   * Toggle the filter popover. When opened, stage current selections to temp state.
   */
  toggleFilterPopover(event?: MouseEvent): void {
    if (event) { event.stopPropagation(); }
    this.showFilterPopover = !this.showFilterPopover;
    if (this.showFilterPopover) {
      this.tempSelectedStatus = this.selectedStatus;
    }
  }

  // close popover when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.showFilterPopover) { return; }
    // clicking inside popover or on the filter button stops propagation; so any document click here is outside
    this.showFilterPopover = false;
    // discard staged changes
    this.tempSelectedStatus = this.selectedStatus;
  }

  /**
   * Apply the staged filter selection and close the popover
   */
  applyFilterFromPopover(): void {
    this.selectedStatus = this.tempSelectedStatus;
    this.showFilterPopover = false;
    this.applyFilters();
  }

  /**
   * Cancel the popover and discard staged changes
   */
  cancelFilter(): void {
    this.tempSelectedStatus = this.selectedStatus;
    this.showFilterPopover = false;
  }

  /**
   * Clear filter selections (both staged and applied) and update list
   */
  clearFilterSelections(): void {
    this.tempSelectedStatus = '';
    this.selectedStatus = '';
    this.applyFilters();
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
  this.applyFilters();
  }

  /**
   * Set active tab
   */
  setActiveTab(tab: string): void {
  this.activeTab = tab;
  this.applyFilters();
  }

  /**
   * Edit user functionality
   */
  editUser(user: User): void {
  // Open dialog in edit mode
  this.editingUserId = user.id;
  this.isEditMode = true;
  this.showForm = true;
  this.editedUser = { ...user };
  }

  /**
   * Add new user functionality
   */
  addUser(): void {
    // Open dialog in create mode
    this.isEditMode = false;
    this.showForm = true;
    this.editingUserId = null;
    this.editedUser = {
      name: '',
      email: '',
      phone: '',
      location: '',
      status: 'Active',
      role: 'MS'
    };
  }

  /**
   * Get status color class
   */
  getStatusClass(status: string): string {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  }

  /**
   * Save changes made during inline edit
   */
  saveEditedUser(form?: NgForm): void {
    this.submitted = true;
    if (form && form.invalid) {
      return;
    }
    if (this.isEditMode && this.editingUserId) {
      const idx = this.users.findIndex(u => u.id === this.editingUserId);
      if (idx !== -1) {
        this.users[idx] = { ...this.users[idx], ...(this.editedUser as User) };
      }
    } else {
      // create new user
      const maxId = this.users.reduce((m, u) => Math.max(m, Number(u.id)), 0);
      const nextId = (maxId + 1).toString();
      const newUser: User = {
        id: nextId,
        name: (this.editedUser.name || 'New User') as string,
        email: (this.editedUser.email || '') as string,
        phone: (this.editedUser.phone || '') as string,
        location: (this.editedUser.location || '') as string,
        status: (this.editedUser.status || 'Active') as 'Active' | 'Inactive',
        role: (this.editedUser.role || 'MS') as 'MS' | 'JDC' | 'AR'
      };
      this.users.unshift(newUser);
    }

    // reset modal state
    this.showForm = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.editedUser = {};
    this.submitted = false;
    this.applyFilters();
  }

  /**
   * Cancel inline edit
   */
  cancelEdit(): void {
  // close dialog or cancel inline edit
  this.showForm = false;
  this.isEditMode = false;
  this.editingUserId = null;
  this.editedUser = {};
  }

  /**
   * Clear all filters and search
   */
  clearFilters(): void {
    this.selectedStatus = '';
    this.selectedRole = '';
    this.searchTerm = '';
    this.applyFilters();
  }

  /**
   * Delete a user by id
   */
  deleteUser(id: string): void {
    this.users = this.users.filter(u => u.id !== id);
    this.applyFilters();
  }

  /**
   * Apply tab + search filters and update filteredUsers
   */
  private applyFilters(): void {
    let list = [...this.users];

    // Tab filtering: map tabs to roles or special cases
    switch (this.activeTab) {
      case 'verifier':
        list = list.filter(u => u.role === 'JDC');
        break;
      case 'coordinators':
        list = list.filter(u => u.role === 'MS');
        break;
      case 'admins':
        list = list.filter(u => u.role === 'AR');
        break;
      case 'citizens':
      default:
        // citizens = all users
        break;
    }

    const search = this.searchTerm.trim().toLowerCase();
    if (search) {
      list = list.filter(user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.location.toLowerCase().includes(search) ||
        user.phone.includes(search)
      );
    }

    // apply explicit status/role filters
    if (this.selectedRole) {
      list = list.filter(u => u.role === this.selectedRole);
    }

    if (this.selectedStatus) {
      list = list.filter(u => u.status === this.selectedStatus);
    }

    this.filteredUsers = list;
  }
}
