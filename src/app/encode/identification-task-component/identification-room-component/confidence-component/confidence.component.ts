import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confidende-dialog',
    templateUrl: './confidence.component.html',
    styleUrls: ['confidence.component.scss', '../../../encode.component.scss']
})
export class ConfidenceDialogComponent {

  constructor(public dialogRef: MatDialogRef<ConfidenceDialogComponent>) 
  {
  }

  submitResponse(result: number): void {
    this.dialogRef.close(result);
  }

}
