import { Component } from '@angular/core';

import { BehaviorSubject, finalize, lastValueFrom, Observable, tap } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { SessionsEnum } from '../../constants';
import { IEncodeAudio } from '../../models/IEncodeAudio';
import { IEncodeInMemoryAudio } from '../../models/IEncodeInMemoryAudio';
import { AudioRecorderService } from '../../services/AudioRecorderService';
import { EncodeUserService } from '../../services/EncodeUserService';

@Component({
    selector: 'app-encode-audio-list',
    templateUrl: './audio-list.component.html',
    styleUrls: ['audio-list.component.scss','../../encode.component.scss']
})
export class EncodeAudioListComponent {

  public audios: Array<IEncodeAudio>;
  public isUploadingNewAudio$: BehaviorSubject<boolean>;

  constructor(private _recorderService: AudioRecorderService, private _bdService: DataDbService, private _userService: EncodeUserService) 
  {
    this.audios = new Array<IEncodeAudio>();
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: this._newAudioObserver
      }
    );
    
    this.isUploadingNewAudio$ = new BehaviorSubject(false);
  }

  private _newAudioObserver = async (newAudio: IEncodeInMemoryAudio) => {
    this.isUploadingNewAudio$.next(true);
    let sessionId = this._userService.session.valueOf();
    if (sessionId == SessionsEnum.SessionOne) {
      sessionId = "session-1";
    } else if (sessionId == SessionsEnum.SessionTwo) {
      sessionId = "session-2";
    }
    newAudio.id = sessionId + '_' + newAudio.id ;
    newAudio.downloadURL = await this._storeAudioInFirebase(newAudio);
    this._storeAudioInUser(newAudio);
    this.audios.push(newAudio);
    this.isUploadingNewAudio$.next(false);
  }

  private async _storeAudioInFirebase(newAudio: IEncodeInMemoryAudio): Promise<any> 
  {
    const filePath = this._createAudioFilePath(newAudio.id);
    const fileRef = this._bdService.getCloudStorageFileRef(filePath);
    const uploadTask = this._bdService.uploadFileToCloudStorage(filePath, newAudio.rawData);
    
    let url$: Observable<any>;
    const task$ = uploadTask.snapshotChanges().pipe(
      finalize(() => url$ = fileRef.getDownloadURL())
    );

    await lastValueFrom(task$);
    const downloadURL = await lastValueFrom(url$);
    
    return downloadURL;
  }

  private _createAudioFilePath(audioFileName: string) {
    const userId = this._userService.user.uid;
    const sessionId = this._userService.session.valueOf();
    return `encode-audios/${userId}/${sessionId}/${audioFileName}`;
  }

  private _storeAudioInUser(newAudio: IEncodeInMemoryAudio): void {
    const audioDbData: IEncodeAudio = { id: newAudio.id, downloadURL: newAudio.downloadURL };
    
    if (this._userService.session == SessionsEnum.SessionTwo) 
    {
      if (this._userService.user.sessionTwo.audios == null)
      {
        this._userService.user.sessionTwo.audios = new Array<IEncodeAudio>();
      }
  
      this._userService.user.sessionTwo.audios.push(audioDbData);
      return;
    } 
    
    if (this._userService.session == SessionsEnum.SessionOne) {
      if (this._userService.user.sessionOne.audios == null)
      {
        this._userService.user.sessionOne.audios = new Array<IEncodeAudio>();
      }
  
      this._userService.user.sessionOne.audios.push(audioDbData);
      return;
    }
  }

}
