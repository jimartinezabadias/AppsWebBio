import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-full-image',
    templateUrl: './full-image.component.html',
    styleUrls: ['full-image.component.scss']
})
export class EncodeFullImageComponent {

  @Input() 
  public imageUrl: string;

  constructor(public dialogRef: MatDialogRef<EncodeFullImageComponent>)
  {
  }

}
