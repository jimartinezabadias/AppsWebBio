import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-audio-disclaimer',
    templateUrl: './audio-disclaimer.component.html',
    styleUrls: ['../../encode.component.scss']
})
export class AudioDisclaimerComponent {

  constructor(public dialogRef: MatDialogRef<AudioDisclaimerComponent>) 
  {
  }

  onClose(result: boolean): void {
    this.dialogRef.close(result);
  }

}
