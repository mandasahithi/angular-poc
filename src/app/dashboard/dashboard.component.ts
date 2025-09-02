import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

export class User {
  constructor(
    public userID: number = 0,
    public firstName: string = '',
    public lastName: string = '',
    public username: string = '',
    public city: string = '',
    public state: string = '',
    public zipCode: number = 0,
    public agree: boolean = false
  ) {}
}

@Component({
  selector: 'app-dashboard',
  standalone: true, // <-- added
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  users: User[] = [];
  storageKey = 'dashboard_users';
  currentUser: User = this.emptyUser();
  showForm = false;
  isEditMode = false;
  formSubmitted = false;

  ngOnInit(): void {
    this.loadFromStorage();
  }

  // helper to return an empty user
  emptyUser(): User {
    return new User(0, '', '', '', '', '', 0,false);
  }

  // localStorage helpers
  private loadFromStorage(): void {
    if (!isPlatformBrowser(this.platformId)) {
      // server: keep empty list
      this.users = [];
      return;
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as User[];
        this.users = parsed.map(u => new User(u.userID, u.firstName, u.lastName, u.username, u.city, u.state, u.zipCode, !!u.agree));
      } else {
        this.users = [];
      }
    } catch {
      this.users = [];
    }
  }

  private writeToStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.users));
    } catch {
      // ignore write errors (e.g. storage quota)
    }
  }

  // UI toggles
  addNew(): void {
    console.log('Add New User');
    this.currentUser = this.emptyUser();
    this.isEditMode = false;
    this.showForm = true;
    this.formSubmitted = false;
  }

  cancel(): void {
    this.showForm = false;
    this.currentUser = this.emptyUser();
    this.formSubmitted = false;
  }

  // CRUD
  saveUser(form: NgForm): void {
    this.formSubmitted = true;
    if (form.invalid) return;

    const nextId = this.nextId();
    this.currentUser.userID = nextId;
    this.users.push(new User(
      this.currentUser.userID,
      this.currentUser.firstName,
      this.currentUser.lastName,
      this.currentUser.username,
      this.currentUser.city,
      this.currentUser.state,
      this.currentUser.zipCode,
      this.currentUser.agree
    ));
    this.writeToStorage();
    form.resetForm();
    this.showForm = false;
    this.formSubmitted = false;
  }

  editUser(user: User): void {
    // clone to avoid two-way binding directly on list
    this.currentUser = new User(user.userID, user.firstName, user.lastName, user.username, user.city, user.state, user.zipCode, user.agree);
    this.isEditMode = true;
    this.showForm = true;
    this.formSubmitted = false;
  }

  updateUser(form: NgForm): void {
    this.formSubmitted = true;
    if (form.invalid) return;

    const idx = this.users.findIndex(u => u.userID === this.currentUser.userID);
    if (idx > -1) {
      this.users[idx] = new User(
        this.currentUser.userID,
        this.currentUser.firstName,
        this.currentUser.lastName,
        this.currentUser.username,
        this.currentUser.city,
        this.currentUser.state,
        this.currentUser.zipCode,
        this.currentUser.agree
      );
      this.writeToStorage();
    }
    form.resetForm();
    this.showForm = false;
    this.isEditMode = false;
    this.formSubmitted = false;
  }

  deleteUser(user: User): void {
    const ok = confirm(`Delete user "${user.firstName} ${user.lastName}"?`);
    if (!ok) return;
    this.users = this.users.filter(u => u.userID !== user.userID);
    this.writeToStorage();
  }

  // utility
  private nextId(): number {
    if (!this.users || this.users.length === 0) return 1;
    return Math.max(...this.users.map(u => u.userID)) + 1;
  }

  fullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }
}

