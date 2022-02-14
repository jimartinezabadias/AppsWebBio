import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
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
    newAudio.downloadURL = await this._storeAudioInFirebase(newAudio);
    this._storeAudioInUser(newAudio);
    this.audios.push(newAudio);
    this.isUploadingNewAudio$.next(false);
  }

  private async _storeAudioInFirebase(newAudio: IEncodeInMemoryAudio): Promise<string> 
  {
    const filePath = `encode-audios/${this._userService.user.uid}/${newAudio.id}`;
    const fileRef = this._bdService.getCloudStorageFileRef(filePath);
    const uploadTask = this._bdService.uploadFileToCloudStorage(filePath, newAudio.rawData);
    
    let url$: Promise<string>;
    await uploadTask.snapshotChanges().pipe(
      finalize(() => url$ = fileRef.getDownloadURL().toPromise<string>() )
    ).toPromise();
    
    return url$;
  }

  private _storeAudioInUser(newAudio: IEncodeInMemoryAudio) {
    const audioDbData: IEncodeAudio = { id: newAudio.id, downloadURL: newAudio.downloadURL };
    if (this._userService.user.sessionOne.audios == null)
    {
      this._userService.user.sessionOne.audios = new Array<IEncodeAudio>();
    }

    this._userService.user.sessionOne.audios.push(audioDbData);
  }

}
