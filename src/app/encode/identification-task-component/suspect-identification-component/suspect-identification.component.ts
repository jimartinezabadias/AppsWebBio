import { AfterViewInit, Component, Input } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeInMemorySuspect } from '../../models/IEncodeInMemorySuspect';
import { IEncodeSuspect } from '../../models/IEncodeSuspect';

@Component({
  selector: 'app-suspect-identification',
  templateUrl: './suspect-identification.component.html',
  styleUrls: ['./suspect-identification.component.scss']
})
export class EncodeSuspectIdentification implements AfterViewInit{
  
  private _lineup: Array<IEncodeInMemorySuspect>;

  @Input() 
  set lineup(lineup: Array<IEncodeSuspect>) {
    lineup.forEach(suspect => {
      const memSuspect: IEncodeInMemorySuspect = { 
        photoStorageRef: suspect.photoStorageRef,
        photoDownloadUrl: null,
        isPerpetrator: suspect.isPerpetrator,
        suspectOfBeing: suspect.suspectOfBeing
      };

      this._lineup.push(memSuspect);
    }) 
  };

  constructor(private _dbService: DataDbService) 
  {
    this._lineup = new Array<IEncodeInMemorySuspect>();
  }

  ngAfterViewInit(): void {
    this._lineup.forEach(async suspect => {
      const suspectImageUrl = await this._dbService.getCloudStorageFileRef(suspect.photoStorageRef).getDownloadURL().toPromise<string>();
      suspect.photoDownloadUrl = suspectImageUrl;
    });
    
    console.log(this._lineup);
  }

}
