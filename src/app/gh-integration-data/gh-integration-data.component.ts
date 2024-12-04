import { Component, computed, input, signal } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { ColDef } from 'ag-grid-community';
import { IGithubIntegration } from '../core/models/integration.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-gh-integration-data',
  imports: [ AgGridAngular, MatFormFieldModule, MatInput, FormsModule, MatSelect, MatOption ], // Add Angular Data Grid Component
  templateUrl: './gh-integration-data.component.html',
  styleUrl: './gh-integration-data.component.scss',
})
export class GhIntegrationDataComponent {
  ghIntegration = input.required<IGithubIntegration>();

  // Signal for search input
  searchTerm = signal('');

  // Computed property for transformed and filtered data
  filteredData = computed(() => {
    // return this.transformDataForGrid(this.ghIntegration());
    const data = this.transformDataForGrid(this.ghIntegration());
    const search = this.searchTerm().toLowerCase();

    // Filter logic
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search)
      )
    );
  });

  // Column definitions with flex property for full-width distribution
  colDefs: ColDef[] = [
    { field: 'orgName', headerName: 'Organization Name', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'repoName', headerName: 'Repository Name', filter: 'agTextColumnFilter', flex: 1 },
    { field: 'type', headerName: 'Type', filter: 'agSetColumnFilter', flex: 1 },
    { field: 'details', headerName: 'Details', filter: 'agTextColumnFilter', flex: 2 },
  ];

  // Default column definition (applied to all columns if not overridden)
  defaultColDef: ColDef = {
    sortable: true,
    filter: true, // Enable filtering globally
    resizable: true,
  };

  // Transform data for the grid
  transformDataForGrid(integration: IGithubIntegration): Array<{
    orgName: string;
    repoName: string;
    type: string;
    details: string;
  }> {
    const gridData: Array<{
      orgName: string;
      repoName: string;
      type: string;
      details: string;
    }> = [];

    integration.organizations?.forEach((org) => {
      org.repositories.forEach((repo) => {
        // Add commits
        repo.commits.forEach((commit) => {
          gridData.push({
            orgName: org.organization,
            repoName: repo.repoName,
            type: 'Commit',
            details: commit.commit?.message || 'No commit message',
          });
        });

        // Add pull requests
        repo.pulls.forEach((pull) => {
          gridData.push({
            orgName: org.organization,
            repoName: repo.repoName,
            type: 'Pull Request',
            details: pull.title || 'No pull request title',
          });
        });

        // Add issues
        repo.issues.forEach((issue) => {
          gridData.push({
            orgName: org.organization,
            repoName: repo.repoName,
            type: 'Issue',
            details: issue.title || 'No issue title',
          });
        });
      });
    });

    return gridData;
  }

  // Handle global search input
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }
}
