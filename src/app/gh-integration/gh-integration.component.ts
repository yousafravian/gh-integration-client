import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { SessionService } from '../core/services/session-service.service';
import { MatOption, MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AsyncPipe, DatePipe } from '@angular/common';
import { GhOrgsComponent } from '../gh-orgs/gh-orgs.component';
import { GhReposComponent } from '../gh-repos/gh-repos.component';
import { FormsModule, NgModel } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { GhCommitsComponent } from '../gh-commits/gh-commits.component';
import { debounceTime, distinctUntilChanged, filter, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { GhIssuesComponent } from '../gh-issues/gh-issues.component';
import { GhPullsComponent } from '../gh-pulls/gh-pulls.component';
import { Commits, Issues } from '../core/models/integration.model';

@Component( {
  selector: 'app-gh-integration',
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatRippleModule,
    MatTooltipModule,
    DatePipe,
    AsyncPipe,
    GhOrgsComponent,
    GhReposComponent,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    GhCommitsComponent,
    NgxLoaderIndicatorDirective,
    GhIssuesComponent,
    GhPullsComponent,
  ],
  templateUrl: './gh-integration.component.html',
  styleUrl: './gh-integration.component.scss'
} )
export class GhIntegrationComponent implements OnInit {
  #ghIntegrationService = inject( GhIntegrationService );
  sessionService = inject( SessionService );
  searchModel = viewChild<NgModel>( 'searchModel' );
  searchField = viewChild<ElementRef<HTMLInputElement>>( 'searchField' );


  // Signal for search input
  searchTerm = signal( '' );
  loadingSearchResults = false
  integration = signal( 'github' );

  loadingOrgs = true;
  loadingRepos = true;
  loadingCommits = true;
  loadingIssues = true;
  loadingPulls = true;
  orgs$ = this.#ghIntegrationService.getAllOrganizations().pipe( finalize(() => this.loadingOrgs = false ));
  repos$ = this.#ghIntegrationService.getAllRepos().pipe( finalize(() => this.loadingRepos = false ));
  commits$ = this.#ghIntegrationService.getAllCommits().pipe( finalize(() => this.loadingCommits = false ));
  issues$ = this.#ghIntegrationService.getAllIssues().pipe( finalize(() => this.loadingIssues = false ));
  pulls$ = this.#ghIntegrationService.getAllPulls().pipe( finalize(() => this.loadingPulls = false ));

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
          setTimeout(() => {
            this.searchField()?.nativeElement.focus();
          }, 1000);
        } ),
        switchMap( ( value ) => forkJoin({
          commits: this.#ghIntegrationService.commitsTextSearch( value ),
          issues: this.#ghIntegrationService.issuesTextSearch( value ),
        })),
      )
      .subscribe( ( response ) => {
        this.loadingSearchResults = false;
        console.log(response);
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

  getOrganizations() {
    return this.#ghIntegrationService.getAllOrganizations();
  }
}
