import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AudioRecorderService } from '../services/AudioRecorderService';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['../encode.component.scss']
})
export class AudioRecorderComponent implements OnInit {

  private _navigator: Navigator = navigator;

  audios: Array<SafeResourceUrl>;

  constructor(private _recorderService: AudioRecorderService,
              private _sanitizer: DomSanitizer) 
  {
  }

  ngOnInit(): void 
  {
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: () => {
          this._updateAudioList();
        } 
      });
    
  }

  public async onRec(): Promise<void>
  {
    if (!this._recorderService.isRecording)
    {
      try {
        const stream = await this._navigator.mediaDevices.getUserMedia({audio: true, video: false});
        this._recorderService.record(stream);
      } catch (error) {
        console.log("error al acceder al microfono");
        console.log(error);
      }
    }
  }
  
  public onStop(): void
  {
    if (this._recorderService.isRecording)
    {
      this._recorderService.stopRecording();
    }
  }

  private _updateAudioList()
  {
    console.log("updating audio list in recorder");
    this.audios = this._recorderService.getAudios().map((audioData) => {
      return this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(audioData));
    });
    console.log(this.audios);
  }

}
