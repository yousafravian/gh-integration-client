import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGithubIntegration } from '../models/integration.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  setToken( token: string) {
    localStorage.setItem('token', token);
  }

  setUser( user: IGithubIntegration) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') ?? '') as IGithubIntegration;
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
