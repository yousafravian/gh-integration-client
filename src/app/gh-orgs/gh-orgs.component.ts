import { Component, computed, input, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { Orgs } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gh-orgs',
  imports: [ AgGridAngular, MatFormFieldModule, FormsModule ], // Add Angular Data Grid Component
  templateUrl: './gh-orgs.component.html',
  styleUrl: './gh-orgs.component.scss',
})
export class GhOrgsComponent {
  organizations = input.required<Orgs>();

  // Computed property for transformed and filtered data
  filteredData = computed(() => {
    // return this.transformDataForGrid(this.ghIntegration());

    if (!this.organizations())
      return [];

    // Filter logic
    return this.organizations()!.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes('')
      )
    );
  });

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [
    { field: 'login', headerName: 'Organization Name', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'description', headerName: 'Organization Descriptino', filter: 'agTextColumnFilter', flex: 1 },
  ];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };
}
