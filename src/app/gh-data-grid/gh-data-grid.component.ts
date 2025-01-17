import { Component, computed, effect, inject, input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { PaginationChangedEvent, SortChangedEvent } from 'ag-grid-community';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Commit, Issue, Org, Pull, Repo } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { flatten } from 'flat';
import { GhIntegrationService } from '../core/services/gh-integration.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxLoaderIndicatorDirective } from 'ngx-loader-indicator';
import { CellRendererComponent } from './links-renderer/cell-renderer.component';

export type GridData = Org | Commit | Issue | Pull | Repo;
export type Collection = 'Organizations' | 'Repos' | 'Repo Commits' | 'Repo Issues' | 'Repo Pull Requests';
export type CollectionType = Collection | `${ Collection } Search Results`;

@Component( {
  selector: 'app-gh-data-grid',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule, MatPaginatorModule, NgxLoaderIndicatorDirective ], // Add Angular Data Grid Component
  templateUrl: './gh-data-grid.component.html',
  styleUrl: './gh-data-grid.component.scss',
} )
export class GhDataGridComponent {

  integrationService = inject( GhIntegrationService );

  searchResults = input<GridData[]>( [] );
  searchEnabled = input<boolean>( false );
  collectionName = input.required<CollectionType>();
  serverHandler = computed( () => {
    if ( this.collectionName() ) {
      return this.integrationService.getDataHandler( this.collectionName() );
    }

    return null;
  } );

  loading = false;

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };

  dataSource = {
    getRows: ( params: any ) => {
      // sorting calc
      const sortModel = params.sortModel; // Contains sorting info
      const sortColumn = sortModel[ 0 ]?.colId || null;
      const sortDirection = sortModel[ 0 ]?.sort || null;

      // pagination calc
      const startRow = params.startRow || 0; // Start row index
      const endRow = params.endRow || 10; // End row index
      const pageSize = endRow - startRow; // Number of items per page
      const pageIndex = Math.floor( startRow / pageSize ) + 1; // Current page index

      // Fetch sorted data from server
      const handler = this.serverHandler();
      if ( handler ) {
        this.loading = true;
        handler( sortColumn, sortDirection, pageIndex, pageSize ).subscribe( ( data ) => {
          this.colDefs = this.getColDefs( data!.data );
          this.loading = false;
          params.successCallback( data.data, data.meta.totalDocs );
        } );
      }

    },
  };

  constructor() {
    effect( () => {
      if ( this.searchEnabled() ) {
        this.colDefs = this.getColDefs( this.searchResults() );
      }
    } );
  }

  getColDefs( data: GridData[] ): ColDef[] {
    const flattenedData: GridData[] = data.map( ( item ) => flatten( item ) ) as GridData[];
    if ( flattenedData.length ) {

      return Object.keys( flattenedData[ 0 ] ).map( ( key: string ) => {
        const keyVal = (flattenedData[0] as any)[key] as string | boolean | number;
        return {
          field: key,
          headerName: key,
          cellRenderer: CellRendererComponent,
          filter: 'agTextColumnFilter',
        };
      } );
    }

    return [];
  }

  onGridReady( params: GridReadyEvent<GridData> ) {
  }

  paginationChangedEvent( paginationChangedEvent: PaginationChangedEvent<any> ) {
    if ( paginationChangedEvent.newPage ) {
      paginationChangedEvent.api.purgeInfiniteCache();
    }
  }

  protected readonly length = length;

  onSortChange( $event: SortChangedEvent<any> ) {
    if ( $event.columns ) {
      $event.api.purgeInfiniteCache();
    }
  }
}
