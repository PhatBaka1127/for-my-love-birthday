import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'gf_birthday_logged_in';
  // THAY giá trị này bằng ngày sinh của bạn gái (format YYYY-MM-DD)
  private readonly allowedBirthdate = '2005-11-21';

  isAuthenticated(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  login(birthdate: string): boolean {
    if (!birthdate) return false;
    if (birthdate === this.allowedBirthdate) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
