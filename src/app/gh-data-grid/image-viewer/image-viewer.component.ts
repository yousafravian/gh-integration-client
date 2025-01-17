import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { NgOptimizedImage } from '@angular/common';

@Component( {
  selector: 'image-viewer-dialog',
  imports: [
    MatButtonModule,
    MatDialogContent,
    NgOptimizedImage,
  ],
  template: `
    <mat-dialog-content>
      <img [ngSrc]="data.url" [width]="500" [height]="500" alt="Image">
    </mat-dialog-content>
  `,
  styles: `

  `
} )
export class ImageViewerComponent {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject( MAT_DIALOG_DATA ) public data: { url: string } ) {}
}
