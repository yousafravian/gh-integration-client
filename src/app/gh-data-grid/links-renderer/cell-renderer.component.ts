import { Component, inject, Inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { MatButtonModule } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';

@Component( {
  selector: 'grid-cell-renderer',
  imports: [
    MatButtonModule,
    NgOptimizedImage,
    MatIcon,
  ],
  template: `
    <div class="cell-renderer">
      @if (isLink( cellValue )) {
        <button mat-icon-button (click)="openLink(cellValue)">
          <mat-icon>open_in_new</mat-icon>
        </button>
      } @else if (isImage( cellValue )) {
        <img [ngSrc]="cellValue" [width]="40" [height]="40" (click)="openImageDialog(cellValue)" alt="img">
      } @else {
        {{ cellValue }}
      }
    </div>
  `,
  styles: `

  `
} )
export class CellRendererComponent implements ICellRendererAngularComp {
  cellValue = '';

  dialog = inject( MatDialog );

  isImage( value: string | number | boolean ): boolean {
    return typeof value === 'string' && value.includes( 'avatar' );
  }

  isLink( value: string | number | boolean ): boolean {
    return typeof value === 'string' && value.startsWith( 'http' ) && !this.isImage( value );
  }

  agInit( params: ICellRendererParams<any, any, any> ): void {
    this.cellValue = params.value;
  }

  refresh( params: ICellRendererParams<any, any, any> ): boolean {
    this.cellValue = params.value;
    return true;
  }

  openLink( cellValue: string ) {
    window.open( cellValue, '_blank' );
  }

  openImageDialog( imageUrl: string ) {
    this.dialog.open( ImageViewerComponent, {
      data: {
        url: imageUrl
      }
    } )
  }
}
