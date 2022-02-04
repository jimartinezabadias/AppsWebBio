import { Component, Input } from '@angular/core';
import { IEncodeSuspect } from '../../models/IEncodeSuspect';
import { Room1Title, Room2Title } from '../../constants';

@Component({
  selector: 'app-encode-identification-room',
  templateUrl: './identification-room.component.html',
  styleUrls: ['./identification-room.component.scss','../../encode.component.scss']
})
export class EncodeIdentificationRoom {
  
  private _lineup: Array<IEncodeSuspect>;

  @Input() public roomTitle: typeof Room1Title| typeof Room2Title;

  @Input() 
  set lineup(lineup: Array<IEncodeSuspect>) {
    // shuffle
    lineup.sort((a, b) => 0.5 - Math.random());
    
    this._lineup = lineup;
  };

  get lineup(): Array<IEncodeSuspect> {
    return this._lineup;
  }

  constructor() 
  {
    // this._lineup = new Array<IEncodeSuspect>();
  }

  // ngAfterViewInit(): void {
  //   this._lineup.forEach(async suspect => {
  //     const suspectImageUrl = await this._dbService.getCloudStorageFileRef(suspect.photoStorageRef).getDownloadURL().toPromise<string>();
  //     suspect.photoDownloadUrl = suspectImageUrl;
  //   });
    
  //   console.log(this._lineup);
  // }

}
