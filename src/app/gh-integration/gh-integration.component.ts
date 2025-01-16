import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { SessionService } from '../core/services/session-service.service';
import { MatOption, MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, filter, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { Commits, Issues } from '../core/models/integration.model';
import { CollectionType, GhDataGridComponent } from '../gh-data-grid/gh-data-grid.component';
import { PageEvent } from '@angular/material/paginator';

@Component( {
  selector: 'app-gh-integration',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    DatePipe,
    AsyncPipe,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgxLoaderIndicatorDirective,
    GhDataGridComponent,
  ],
  templateUrl: './gh-integration.component.html',
  styleUrl: './gh-integration.component.scss'
} )
export class GhIntegrationComponent implements OnInit {
  #ghIntegrationService = inject( GhIntegrationService );
  sessionService = inject( SessionService );
  searchModel = viewChild<NgModel>( 'searchModel' );
  searchField = viewChild<ElementRef<HTMLInputElement>>( 'searchField' );

  readonly PageSize = 10;
  readonly PageIndex = 1;


  // Signal for search input
  searchTerm = signal( '' );
  loadingSearchResults = false
  integration = signal( 'github' );

  loadingOrgs = true;
  loadingRepos = true;
  loadingCommits = true;
  loadingIssues = true;
  loadingPulls = true;
  orgs$ = this.#ghIntegrationService.getAllOrganizations( this.PageIndex, this.PageSize ).pipe( finalize( () => this.loadingOrgs = false ) );
  repos$ = this.#ghIntegrationService.getAllRepos( this.PageIndex, this.PageSize ).pipe( finalize( () => this.loadingRepos = false ) );
  commits$ = this.#ghIntegrationService.getAllCommits( this.PageIndex, this.PageSize ).pipe( finalize( () => this.loadingCommits = false ) );
  issues$ = this.#ghIntegrationService.getAllIssues( this.PageIndex, this.PageSize ).pipe( finalize( () => this.loadingIssues = false ) );
  pulls$ = this.#ghIntegrationService.getAllPulls( this.PageIndex, this.PageSize ).pipe( finalize( () => this.loadingPulls = false ) );

  commitsSearchResult: Commits = [];
  issuesSearchResult: Issues = [];

  ngOnInit() {
    this.searchModel()?.control.valueChanges
      .pipe(
        debounceTime( 500 ),
        filter( v => !!v ),
        distinctUntilChanged(),
        tap( () => {
          this.loadingSearchResults = true;
          setTimeout( () => {
            this.searchField()?.nativeElement.focus();
          }, 1000 );
        } ),
        switchMap( ( value ) => forkJoin( {
          commits: this.#ghIntegrationService.commitsTextSearch( value ),
          issues: this.#ghIntegrationService.issuesTextSearch( value ),
        } ) ),
      )
      .subscribe( ( response ) => {
        this.loadingSearchResults = false;
        console.log( response );
        this.commitsSearchResult = response.commits.results;
        this.issuesSearchResult = response.issues.results;
      } );
  }

  onGHLogin() {
    this.#ghIntegrationService.getCode();
  }

  syncInfo( $event: MouseEvent ) {
    $event.stopImmediatePropagation();
    this.onGHLogin();
  }

  onGHLogout() {
    this.#ghIntegrationService.logout().subscribe();
  }

  handlePageChange( collection: CollectionType, pageEvent: PageEvent ) {
    console.log( 'pageEvent', pageEvent );
    console.log( 'collection', collection );
    switch ( collection ) {
      case "Organizations":
        this.loadingOrgs = true;
        this.orgs$ = this.#ghIntegrationService.getAllOrganizations( pageEvent.pageIndex + 1, pageEvent.pageSize ).pipe( finalize( () => this.loadingOrgs = false ) );
        break;
      case "Repos":
        this.loadingRepos = true;
        this.repos$ = this.#ghIntegrationService.getAllRepos( pageEvent.pageIndex + 1, pageEvent.pageSize ).pipe( finalize( () => this.loadingRepos = false ) );
        break;
      case "Repo Commits":
        this.loadingCommits = true;
        this.commits$ = this.#ghIntegrationService.getAllCommits( pageEvent.pageIndex + 1, pageEvent.pageSize ).pipe( finalize( () => this.loadingCommits = false ) );
        break;
      case "Repo Issues":
        this.loadingIssues = true;
        this.issues$ = this.#ghIntegrationService.getAllIssues( pageEvent.pageIndex + 1, pageEvent.pageSize ).pipe( finalize( () => this.loadingIssues = false ) );
        break;
      case "Repo Pull Requests":
        this.loadingPulls = true;
        this.pulls$ = this.#ghIntegrationService.getAllPulls( pageEvent.pageIndex + 1, pageEvent.pageSize ).pipe( finalize( () => this.loadingPulls = false ) );
        break;
      default:
        break;
    }
  }
}
