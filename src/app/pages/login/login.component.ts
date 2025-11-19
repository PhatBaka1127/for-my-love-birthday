import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  birthdate: string = '';
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.errorMessage = null;
    const success = this.authService.login(this.birthdate);
    if (success) {
      this.router.navigate(['/wishes', 1]);
    } else {
      this.errorMessage = 'Sai ngày sinh rồi, thử lại nha 💙';
    }
  }
}
