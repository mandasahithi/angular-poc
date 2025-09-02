import { CommonModule } from '@angular/common';
import { Component, Inject, PLATFORM_ID, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],  // ✅ add modules here
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = signal('Login Page'); // data binding with signal
  paragraph = 'Please enter your credentials to log in.'; // data binding without signals
  username  = '';
  password = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Reset error on initialization
    console.log('LoginComponent initialized');
    this.error = ' ';
    // Auto-login if username & password are present in query params
    this.route.queryParamMap.subscribe(params => {
      const u = params.get('username');
      const p = params.get('password');
      if (u && p) {
        this.tryLogin(u, p);
      }
    });
  }

  tryLogin(username: string, password: string): void {
    // Replace this with your real auth call
    if (username === 'admin' && password === 'password' ) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('auth_token', 'FAKE_TOKEN'); // store real token in production
      }
      // this.router.navigate(['/dashboard']);
       this.router.navigate(['/users']);
      return;
    }
    this.error = 'Invalid credentials';
  }

  onLogin() {
    if(this.username === 'admin' && this.password === 'password'){
      // store a fake token in local storage
      localStorage.setItem('auth_token','dummy-jwt-token'); // <-- fix key here
      // this.router.navigate(['/dashboard']);
       this.router.navigate(['/users']);
    }else{
      this.error = 'Invalid credentials';
    }
  }

  onSubmit(): void {
    // after successful auth response:
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('auth_token', 'FAKE_TOKEN'); // replace with real token
    }
    // this.router.navigate(['/dashboard']);
      this.router.navigate(['/users']);
  }
}
