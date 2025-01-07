import { Component, computed, input, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { Commits, Repos } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';

@Component( {
  selector: 'app-gh-commits',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule ], // Add Angular Data Grid Component
  templateUrl: './gh-commits.component.html',
  styleUrl: './gh-commits.component.scss',
} )
export class GhCommitsComponent {
  commits = input.required<Commits>();

  // Signal for search input
  searchTerm = signal( '' );

  // Computed property for transformed and filtered data
  filteredData = computed( () => {
    if (!this.commits())
      return [];
    // return this.transformDataForGrid(this.ghIntegration());
    const search = this.searchTerm().toLowerCase();

    // Filter logic
    return this.commits()!.filter( ( item ) =>
      Object.values( item ).some( ( value ) =>
        String( value ).toLowerCase().includes( search )
      )
    );
  } );

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [
    { field: 'sha', headerName: 'Commit Id', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'repoId', headerName: 'Repo Id', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'author.login', headerName: 'Author', filter: 'agTextColumnFilter', flex: 1.5 },
    { field: 'commit.message', headerName: 'Commit message', filter: 'agTextColumnFilter', flex: 2 },
    { field: 'commit.url', headerName: 'Commit URL', filter: 'agTextColumnFilter', flex: 2 },
  ];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };
}
