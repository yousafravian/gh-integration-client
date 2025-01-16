import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { SessionService } from '../core/services/session-service.service';
import { MatOption, MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { debounceTime, distinctUntilChanged, filter, finalize, forkJoin, Subscription, switchMap, tap } from 'rxjs';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { Commit, Issue } from '../core/models/integration.model';
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
export class GhIntegrationComponent {
  #ghIntegrationService = inject( GhIntegrationService );
  sessionService = inject( SessionService );

  searchModel = viewChild<NgModel>( 'searchModel' );
  searchField = viewChild<ElementRef<HTMLInputElement>>( 'searchField' );

  sub?: Subscription;

  constructor() {
    effect( () => {
      if ( !this.searchModel()?.control ) {
        return;
      }
      if ( this.sub ) {
        this.sub.unsubscribe();
        this.sub = undefined;
      }

      this.sub = this.searchModel()!.control.valueChanges
        .pipe(
          debounceTime( 500 ),
          tap( val => {
            if ( val?.length === 0 || !val ) {
              this.issuesSearchResult = [];
              this.commitsSearchResult = [];
              this.commitsSearchResult = [];
            }
          } ),
          filter( v => !!v ),
          distinctUntilChanged(),
          tap( () => {
            this.loadingSearchResults = true;
          } ),
          switchMap( ( value ) => forkJoin( {
            commits: this.#ghIntegrationService.commitsTextSearch( value ),
            issues: this.#ghIntegrationService.issuesTextSearch( value ),
          } ) ),
          finalize( () => {
            setTimeout( () => {
              this.searchField()?.nativeElement.focus();
            }, 1000 );
          } ),
        )
        .subscribe( ( response ) => {
          this.loadingSearchResults = false;
          this.commitsSearchResult = response.commits.results;
          this.issuesSearchResult = response.issues.results;
        } )
    } );
  }

  // Signal for search input
  searchTerm = signal( '' );
  integration = signal( 'github' );
  loadingSearchResults = false

  commitsSearchResult: Commit[] = [];
  issuesSearchResult: Issue[] = [];

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
}
