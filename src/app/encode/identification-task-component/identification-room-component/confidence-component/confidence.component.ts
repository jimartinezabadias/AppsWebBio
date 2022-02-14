import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confidende-dialog',
    templateUrl: './confidence.component.html',
    styleUrls: ['confidence.component.scss', '../../../encode.component.scss']
})
export class ConfidenceDialogComponent {
  
  private _suspectPhotoUrl: string;

  get suspectPhotoUrl(): string {
    return this._suspectPhotoUrl;
  }

  @Input() 
  set suspectPhotoUrl(suspectPhotoUrl: string) {
    this._suspectPhotoUrl = suspectPhotoUrl;
  };
  
  constructor(public dialogRef: MatDialogRef<ConfidenceDialogComponent>) 
  {
  }

  submitResponse(result: number): void {
    this.dialogRef.close(result);
  }

}
