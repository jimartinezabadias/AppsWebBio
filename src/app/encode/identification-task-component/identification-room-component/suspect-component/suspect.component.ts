import { AfterViewInit, Component, Input } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeSuspect } from 'src/app/encode/models/IEncodeSuspect';

@Component({
  selector: 'app-encode-suspect',
  templateUrl: './suspect.component.html',
  styleUrls: ['./suspect.component.scss','../../../encode.component.scss']
})
export class EncodeSuspect implements AfterViewInit{
  
  private _suspect: IEncodeSuspect;
  
  public suspectImageUrl: string;
  
  @Input() 
  public suspectNumber: number;
  
  @Input() 
  set suspect(suspect: IEncodeSuspect) {
    this._suspect = suspect;
  };
  
  constructor(private _dbService: DataDbService) 
  {
  }

  async ngAfterViewInit(): Promise<void> {
    this.suspectImageUrl = await this._dbService.getCloudStorageFileRef(this._suspect.photoStorageRef).getDownloadURL().toPromise<string>();
  }

}
