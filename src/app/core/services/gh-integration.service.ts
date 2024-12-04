import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IGithubIntegration } from '../models/integration.model';
import { ServerResponse } from '../models/server-response';
import { SessionService } from './session-service.service';

@Injectable({
  providedIn: 'root',
})
export class GhIntegrationService {

  #http = inject(HttpClient);
  #sessionService = inject(SessionService);

  readonly urls = {
    login: 'gh-integration/callback',
    healthCheck: '/healthCheck',
  }

  /**
   * Redirect the user to GitHub for authentication.
   */
  getCode() {
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=Ov23liED2YOJyCBH9HOg&scope=repo,org,read:user`)
  }

  login(code: string) {
    return this.#http.get<ServerResponse<IGithubIntegration>>(this.urls.login, {
      params: {
        code
      }
    });
  }

  logout() {
    this.#sessionService.clearSession();
  }

}
