import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit, Commits, IGithubIntegration, Issue, Issues, Org, Orgs, Pull, Repo } from '../models/integration.model';
import { ServerResponse } from '../models/server-response';
import { SessionService } from './session-service.service';
import { tap } from 'rxjs';


export interface PaginatedResponse<T> {
  data: T[]; // Array of data items of generic type T
  meta: {
    totalDocs: number; // Total number of documents
    totalPages: number; // Total number of pages
    page: number; // Current page number
    limit: number; // Number of items per page
    hasNextPage: boolean; // Indicates if there is a next page
    hasPrevPage: boolean; // Indicates if there is a previous page
    nextPage: number | null; // Next page number (null if none)
    prevPage: number | null; // Previous page number (null if none)
  };
}

@Injectable({
  providedIn: 'root',
})
export class GhIntegrationService {

  #http = inject(HttpClient);
  #sessionService = inject(SessionService);

  readonly urls = {
    login: 'integration/',
    logout: 'integration/logout',
    organizations: 'organizations',
    repos: 'repos',
    commits: 'commits',
    issues: 'issues',
    pulls: 'pulls',
    commitsTextSearch: 'commits/textSearch',
    issuesTextSearch: 'issues/textSearch',
    orgsTextSearch: 'orgs/textSearch',
    reposTextSearch: 'repos/textSearch',
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

  getAllOrganizations(pageIndex: number = 1, pageSize: number = 10) {
    return this.#http.get<PaginatedResponse<Org>>(`${this.urls.organizations}?page=${pageIndex}&limit=${pageSize}`);
  }

  getAllRepos(pageIndex: number = 1, pageSize: number = 10) {
    return this.#http.get<PaginatedResponse<Repo>>(`${this.urls.repos}?page=${pageIndex}&limit=${pageSize}`);
  }

  getAllCommits(pageIndex: number = 1, pageSize: number = 10) {
    return this.#http.get<PaginatedResponse<Commit>>(`${this.urls.commits}?page=${pageIndex}&limit=${pageSize}`);
  }

  getAllIssues(pageIndex: number = 1, pageSize: number = 10) {
    return this.#http.get<PaginatedResponse<Issue>>(`${this.urls.issues}?page=${pageIndex}&limit=${pageSize}`);
  }

  getAllPulls(pageIndex: number = 1, pageSize: number = 10) {
    return this.#http.get<PaginatedResponse<Pull>>(`${this.urls.pulls}?page=${pageIndex}&limit=${pageSize}`);
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
