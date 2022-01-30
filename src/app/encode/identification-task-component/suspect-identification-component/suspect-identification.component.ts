import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IEncodeSuspect } from '../../models/IEncodeSuspect';

@Component({
  selector: 'app-suspect-identification',
  templateUrl: './suspect-identification.component.html',
  styleUrls: ['./suspect-identification.component.scss']
})
export class EncodeSuspectIdentification {
  
  @Input() 
  set lineup(lineup: Array<IEncodeSuspect>) {
    console.log('setting lineup');
    console.log(lineup);
  };

  constructor(public suspectIdentificationDialogRef: MatDialogRef<EncodeSuspectIdentification>) 
  {
  }

}
