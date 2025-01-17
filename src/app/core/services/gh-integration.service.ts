import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Commit, Commits, IGithubIntegration, Issue, Issues, Org, Pull, Repo } from '../models/integration.model';
import { ServerResponse } from '../models/server-response';
import { SessionService } from './session-service.service';
import { Observable, tap } from 'rxjs';
import { CollectionType, GridData } from '../../gh-data-grid/gh-data-grid.component';



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

export type DataFetchHandler = ( sortColumn: string, sortDirection: 'asc' | 'desc', pageIndex: number, pageSize: number, filterModel: object ) => Observable<PaginatedResponse<GridData>>;

@Injectable( {
  providedIn: 'root',
} )
export class GhIntegrationService {

  #http = inject( HttpClient );
  #sessionService = inject( SessionService );

  readonly urls = {
    login: 'integration/',
    checkSyncStatus: 'integration/checkSyncStatus',
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
    window.location.assign( `https://github.com/login/oauth/authorize?client_id=Ov23liED2YOJyCBH9HOg&scope=repo,org,read:user` )
  }

  login( code: string ) {
    return this.#http.get<ServerResponse<IGithubIntegration>>( this.urls.login, {
      params: {
        code
      }
    } );
  }

  checkSyncStatus( userId: string ) {
    // poll to server every 2 second until abort signal
    return new Observable<ServerResponse<IGithubIntegration>>( subscriber => {
      const interval = setInterval( () => {
        this.#http.get<ServerResponse<IGithubIntegration>>( this.urls.checkSyncStatus, {
          params: {
            userId
          }
        } ).subscribe( {
          next: ( res ) => {
            subscriber.next( res );
            if ( !res || res?.payload?.isProc === 0 ) {
              clearInterval( interval );
              subscriber.complete();
            }
          },
          error: ( e ) => {
            clearInterval( interval );
            subscriber.error( e );
          }
        } );
      }, 2000 );
    } );
  }

  logout() {
    return this.#http.get<void>( this.urls.logout, {
      params: {
        userId: this.#sessionService.getUser()!.userId
      }
    } ).pipe(
      tap( () => {
        this.#sessionService.clearSession();
      } )
    );
  }

  getAllOrganizations( sortColumn: string, sortDirection: 'asc' | 'desc' = 'asc', pageIndex: number = 1, pageSize: number = 10, filterModel: object ) {
    return this.#http.get<PaginatedResponse<Org>>( `${ this.urls.organizations }`, {
      params: {
        page: pageIndex.toString(),
        limit: pageSize.toString(),
        sortColumn,
        sortDirection,
        filterModel: JSON.stringify( filterModel )
      }
    } );
  }

  getAllRepos( sortColumn: string, sortDirection: 'asc' | 'desc' = 'asc', pageIndex: number = 1, pageSize: number = 10, filterModel: object ) {
    return this.#http.get<PaginatedResponse<Repo>>( `${ this.urls.repos }`, {
      params: {
        page: pageIndex.toString(),
        limit: pageSize.toString(),
        sortColumn,
        sortDirection,
        filterModel: JSON.stringify( filterModel )
      }
    } );
  }

  getAllCommits( sortColumn: string, sortDirection: 'asc' | 'desc' = 'asc', pageIndex: number = 1, pageSize: number = 10, filterModel: object ) {
    return this.#http.get<PaginatedResponse<Commit>>( `${ this.urls.commits }`, {
      params: {
        page: pageIndex.toString(),
        limit: pageSize.toString(),
        sortColumn,
        sortDirection,
        filterModel: JSON.stringify( filterModel )
      }
    } );
  }

  getAllIssues( sortColumn: string, sortDirection: 'asc' | 'desc' = 'asc', pageIndex: number = 1, pageSize: number = 10, filterModel: object ) {
    return this.#http.get<PaginatedResponse<Issue>>( `${ this.urls.issues }`, {
      params: {
        page: pageIndex.toString(),
        limit: pageSize.toString(),
        sortColumn,
        sortDirection,
        filterModel: JSON.stringify( filterModel )
      }
    } );
  }

  getAllPulls( sortColumn: string, sortDirection: 'asc' | 'desc' = 'asc', pageIndex: number = 1, pageSize: number = 10, filterModel: object ) {
    return this.#http.get<PaginatedResponse<Pull>>( `${ this.urls.pulls }`, {
      params: {
        page: pageIndex.toString(),
        limit: pageSize.toString(),
        sortColumn,
        sortDirection,
        filterModel: JSON.stringify( filterModel )
      }
    } );
  }

  commitsTextSearch( text: string ) {
    return this.#http.get<{ results: Commits }>( this.urls.commitsTextSearch, {
      params: {
        text
      }
    } );
  }

  issuesTextSearch( text: string ) {
    return this.#http.get<{ results: Issues }>( this.urls.issuesTextSearch, {
      params: {
        text
      }
    } );
  }

  getDataHandler( collection: CollectionType ): DataFetchHandler | undefined {
    switch ( collection ) {
      case "Organizations":
        return this.getAllOrganizations.bind( this );
      case "Repos":
        return this.getAllRepos.bind( this );
      case "Repo Commits":
        return this.getAllCommits.bind( this );
      case "Repo Issues":
        return this.getAllIssues.bind( this );
      case "Repo Pull Requests":
        return this.getAllPulls.bind( this );
    }
    return undefined;

  }
}
