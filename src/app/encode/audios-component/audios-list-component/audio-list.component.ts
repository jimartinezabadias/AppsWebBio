import { Component } from '@angular/core';
import { IEncodeAudio } from '../../models/IEncodeAudio';
import { AudioRecorderService } from '../../services/AudioRecorderService';

@Component({
    selector: 'app-encode-audio-list',
    templateUrl: './audio-list.component.html',
    styleUrls: ['audio-list.component.scss','../../encode.component.scss']
})
export class EncodeAudioListComponent {

  public audios: Array<IEncodeAudio>;

  constructor(private _recorderService: AudioRecorderService) 
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
    console.log("saving audio in db");
  }
  
}
