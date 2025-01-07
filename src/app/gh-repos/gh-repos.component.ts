import { Component, computed, input, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { Repos } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component( {
  selector: 'app-gh-repos',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule ], // Add Angular Data Grid Component
  templateUrl: './gh-repos.component.html',
  styleUrl: './gh-repos.component.scss',
} )
export class GhReposComponent {
  repos = input.required<Repos>();

  // Signal for search input
  searchTerm = signal( '' );

  // Computed property for transformed and filtered data
  filteredData = computed( () => {
    if (!this.repos())
      return [];

    const search = this.searchTerm().toLowerCase();

    // Filter logic
    return this.repos()!.filter( ( item ) =>
      Object.values( item ).some( ( value ) =>
        String( value ).toLowerCase().includes( search )
      )
    );
  } );

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [
    { field: 'repoId', headerName: 'Repo ID', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'name', headerName: 'Repo Name', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'description', headerName: 'Repo Description', filter: 'agTextColumnFilter', flex: 2 },
    { field: 'owner.login', headerName: 'Owner', filter: 'agTextColumnFilter', flex: 2 },
  ];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };
}
