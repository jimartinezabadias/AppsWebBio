import { Component } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeAudio } from '../../models/IEncodeAudio';
import { AudioRecorderService } from '../../services/AudioRecorderService';
import { EncodeUserService } from '../../services/EncodeUserService';

@Component({
    selector: 'app-encode-audio-list',
    templateUrl: './audio-list.component.html',
    styleUrls: ['audio-list.component.scss','../../encode.component.scss']
})
export class EncodeAudioListComponent {

  public audios: Array<IEncodeAudio>;

  constructor(private _recorderService: AudioRecorderService, private _bdService: DataDbService, private _userService: EncodeUserService) 
  {
    this.audios = new Array<IEncodeAudio>();
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: this._newAudioObserver
      }
    );
  }

  private _newAudioObserver = (newAudio: IEncodeAudio) => {
    this._storeAudioInFirebase(newAudio);
    this.audios.push(newAudio);
  }

  private _storeAudioInFirebase(newAudio: IEncodeAudio): void 
  {
    const filePath = `encode-audios/${this._userService.user().uid}/${newAudio.id}`;
    this._bdService.uploadFileToFirestore(filePath, newAudio.rawData);
  }
  
}
