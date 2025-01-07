import { Component, computed, input, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { Commits, Issues, Repos } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';

@Component( {
  selector: 'app-gh-issues',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule ], // Add Angular Data Grid Component
  templateUrl: './gh-issues.component.html',
  styleUrl: './gh-issues.component.scss',
} )
export class GhIssuesComponent {
  issues = input.required<Issues>();

  // Signal for search input
  searchTerm = signal( '' );

  // Computed property for transformed and filtered data
  filteredData = computed( () => {
    if (!this.issues())
      return [];
    // return this.transformDataForGrid(this.ghIntegration());
    const search = this.searchTerm().toLowerCase();

    // Filter logic
    return this.issues()!.filter( ( item ) =>
      Object.values( item ).some( ( value ) =>
        String( value ).toLowerCase().includes( search )
      )
    );
  } );

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [
    { field: 'title', headerName: 'Title', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'user.login', headerName: 'Author', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'body', headerName: 'Body', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'state', headerName: 'Status', filter: 'agTextColumnFilter', flex: 1 },
  ];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };
}
