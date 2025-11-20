import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'gf_birthday_logged_in';
  private readonly allowedBirthdate = '21112005'; // đúng format dd/mm/yyyy

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
