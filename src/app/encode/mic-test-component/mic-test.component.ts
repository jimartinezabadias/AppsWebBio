import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AudioRecorderService } from '../services/AudioRecorderService';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-mic-test',
    templateUrl: './mic-test.component.html',
    styleUrls: ['../encode.component.scss']
})

export class EncodeMicTestComponent implements OnInit {

  audioUrl: SafeResourceUrl;

  constructor(private _userService: EncodeUserService,
              private _recorderService: AudioRecorderService,
              private _sanitizer: DomSanitizer) 
  {
    
  }

  ngOnInit(): void 
  {
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: () => {
          this._createAudioUrl();
        } 
      });
  }

  private _createAudioUrl()
  {
    if (this._recorderService.audioCount === 1)
    {
      const audioData = this._recorderService.getAudioAt(0);
      const audioUrl = URL.createObjectURL(audioData);
      this.audioUrl = this._sanitizer.bypassSecurityTrustUrl(audioUrl);
    }
  }

}
