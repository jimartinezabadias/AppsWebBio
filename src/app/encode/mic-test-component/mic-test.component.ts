import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IEncodeInMemoryAudio } from '../models/IEncodeInMemoryAudio';
import { AudioRecorderService } from '../services/AudioRecorderService';
import { AudioConfirmComponent } from './audio-confirm-component/audio-confirm.component';

@Component({
    selector: 'app-encode-mic-test',
    templateUrl: './mic-test.component.html',
    styleUrls: ['mic-test.component.scss','../encode.component.scss']
})

export class EncodeMicTestComponent implements OnInit {

  private _audioUrl: SafeResourceUrl;

  constructor(private _router: Router,
              private _route: ActivatedRoute,
              private _recorderService: AudioRecorderService,
              private _sanitizer: DomSanitizer,
              public dialog: MatDialog) 
  {
  }

  ngOnInit(): void 
  {
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: (newAudio: IEncodeInMemoryAudio) => {
          if (this._recorderService.audioCount === 1)
          {
            const audioData = this._recorderService.getAudioAt(0);
            this._audioUrl = this._createAudioUrl(audioData);
            this._openDialog();
          }
        }
      });
  }

  private _createAudioUrl(audioData: IEncodeInMemoryAudio): SafeResourceUrl
  {
    const audioUrl = URL.createObjectURL(audioData.rawData);
    return this._sanitizer.bypassSecurityTrustUrl(audioUrl);
  }

  private _openDialog(): void {
    const dialogRef = this.dialog.open(AudioConfirmComponent, {
      data: this._audioUrl
    });

    dialogRef.afterClosed().subscribe(this._dialogClosedObserver);
  }

  private _dialogClosedObserver = (result: boolean) => {
    (result == true) ? this._router.navigate(["../video-test"], { relativeTo: this._route }) : this._recorderService.deleteAudioAt(0);
  }

}
