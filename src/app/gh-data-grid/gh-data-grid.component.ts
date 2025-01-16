import { Component, effect, inject, input, output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import type { IDatasource, IServerSideDatasource, PaginationChangedEvent } from 'ag-grid-community';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { Commit, Issue, Org, Pull } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { flatten } from 'flat';
import { GhIntegrationService, PaginatedResponse } from '../core/services/gh-integration.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export type GridData = Org | Commit | Issue | Pull;
export type CollectionType = 'Organizations' | 'Repos' | 'Repo Commits' | 'Repo Issues' | 'Repo Pull Requests';

@Component( {
  selector: 'app-gh-data-grid',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule, MatPaginatorModule ], // Add Angular Data Grid Component
  templateUrl: './gh-data-grid.component.html',
  styleUrl: './gh-data-grid.component.scss',
} )
export class GhDataGridComponent {

  data = input.required<PaginatedResponse<any>>();
  collectionName = input.required<CollectionType>();
  pageSize = input.required<number>();

  pageChange = output<PageEvent>();

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };

  constructor() {
    effect( () => {
      if (this.data()?.data) {
        this.colDefs = this.getColDefs( this.data().data );
      }
    } );
  }

  getColDefs( data: GridData[] ) {
    const flattenedData = data.map( ( item ) => flatten( item ) ) as object[];
    if ( flattenedData.length ) {

      return Object.keys( flattenedData[ 0 ] ).map( ( key ) => {
        return {
          field: key,
          headerName: key,
          filter: 'agTextColumnFilter',
        };
      } );
    }

    return [];
  }

  onGridReady(params: GridReadyEvent<GridData>) {
  }

  paginationChangedEvent( paginationChangedEvent: PaginationChangedEvent<any> ) {
    console.log( 'paginationChangedEvent', paginationChangedEvent );
  }

  handlePageEvent( pageEvent: PageEvent ) {
    this.pageChange.emit(pageEvent);
  }
}
