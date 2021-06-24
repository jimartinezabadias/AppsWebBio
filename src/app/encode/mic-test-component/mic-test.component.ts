import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AudioRecorderService } from '../services/AudioRecorderService';
import { EncodeUserService } from '../services/EncodeUserService';
import { AudioConfirmComponent } from './audio-confirm-component/audio-confirm.component';

@Component({
    selector: 'app-encode-mic-test',
    templateUrl: './mic-test.component.html',
    styleUrls: ['../encode.component.scss']
})

export class EncodeMicTestComponent implements OnInit {

  private _audioUrl: SafeResourceUrl;

  constructor(private _userService: EncodeUserService,
              private _recorderService: AudioRecorderService,
              private _sanitizer: DomSanitizer,
              public dialog: MatDialog) 
  {
  }

  ngOnInit(): void 
  {
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: () => {
          this._audioUrl = this._createAudioUrl();
          this._openDialog();
        } 
      });
  }

  private _createAudioUrl(): SafeResourceUrl
  {
    if (this._recorderService.audioCount === 1)
    {
      const audioData = this._recorderService.getAudioAt(0);
      const audioUrl = URL.createObjectURL(audioData);
      return this._sanitizer.bypassSecurityTrustUrl(audioUrl);
    }
  }

  private _openDialog(): void {
    const dialogRef = this.dialog.open(AudioConfirmComponent, {
      data: this._audioUrl
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        console.log("se escuchaba bien!!");
      }
      else
      {
        console.log("se escuchaba mal");
      }
    });
  }

}