import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatRadioButton, MatRadioChange } from '@angular/material/radio';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeSuspect } from 'src/app/encode/models/IEncodeSuspect';

@Component({
  selector: 'app-encode-suspect',
  templateUrl: './suspect.component.html',
  styleUrls: ['./suspect.component.scss','../../../encode.component.scss']
})
export class EncodeSuspect implements AfterViewInit{
  
  private _suspect: IEncodeSuspect;
  private _isSelected: boolean;
  
  @ViewChild('suspectSelectButton') 
  private _selectedRadioButton: MatRadioButton;
  
  public suspectImageUrl: string;
  private _suspectIndex: number;
  
  @Input() 
  set suspect(suspect: IEncodeSuspect) {
    this._suspect = suspect;
  };

  @Input() 
  set suspectIndex(index: number) {
    this._suspectIndex = index;
  };
  
  @Input() 
  set isSelected(isSelected: boolean) {
    this._isSelected = isSelected;
  };

  get suspectIndex(): number {
    return this._suspectIndex;
  }
  
  @Output() public selectSuspectEvent = new EventEmitter();
  
  constructor(private _dbService: DataDbService) 
  {
  }
  
  async ngAfterViewInit(): Promise<void> {
    this.suspectImageUrl = await this._dbService.getCloudStorageFileRef(this._suspect.photoStorageRef).getDownloadURL().toPromise<string>();
    this._selectedRadioButton.change.subscribe(this.selectSuspect);
  }

  public selectSuspect = () => {
    this._isSelected = true;
    this.selectSuspectEvent.emit(this._suspect.id);
  }

}
