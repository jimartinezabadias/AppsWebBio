import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-extended-recall',
    templateUrl: './extended-recall.component.html',
    styleUrls: ['../../encode.component.scss', 'extended-recall.component.scss']
})
export class ExtendedRecallComponent {

  constructor(public dialogRef: MatDialogRef<ExtendedRecallComponent>) 
  {
  }

  onExtend(result: boolean): void {
    this.dialogRef.close(result);
  }

}
