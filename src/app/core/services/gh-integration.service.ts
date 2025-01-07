import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commits, IGithubIntegration, Issues, Orgs } from '../models/integration.model';
import { ServerResponse } from '../models/server-response';
import { SessionService } from './session-service.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GhIntegrationService {

  #http = inject(HttpClient);
  #sessionService = inject(SessionService);

  readonly urls = {
    login: 'gh-integration/callback',
    logout: 'gh-integration/logout',
    healthCheck: '/healthCheck',
    organizations: 'gh-integration/organizations',
    repos: 'gh-integration/repos',
    commits: 'gh-integration/commits',
    issues: 'gh-integration/issues',
    pulls: 'gh-integration/pulls',
    commitsTextSearch: 'gh-integration/commitsTextSearch',
    issuesTextSearch: 'gh-integration/issuesTextSearch',
    orgsTextSearch: 'gh-integration/orgsTextSearch',
    reposTextSearch: 'gh-integration/reposTextSearch',
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
    return this.#http.get<void>(this.urls.logout, {
      params: {
        userId: this.#sessionService.getUser().userId
      }
    }).pipe(
      tap(() => {
        this.#sessionService.clearSession();
      })
    );
  }

  getAllOrganizations() {
    return this.#http.get<any>(this.urls.organizations);
  }

  getAllRepos() {
    return this.#http.get<any>(this.urls.repos);
  }

  getAllCommits() {
    return this.#http.get<any>(this.urls.commits);
  }

  getAllIssues() {
    return this.#http.get<any>(this.urls.issues);
  }

  getAllPulls() {
    return this.#http.get<any>(this.urls.pulls);
  }

  commitsTextSearch( text: string) {
    return this.#http.get<{ results: Commits }>(this.urls.commitsTextSearch, {
      params: {
        text
      }
    });
  }

  issuesTextSearch( text: string) {
    return this.#http.get<{ results: Issues }>(this.urls.issuesTextSearch, {
      params: {
        text
      }
    });
  }
}
