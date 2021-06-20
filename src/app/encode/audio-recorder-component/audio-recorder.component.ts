import { Component, OnInit } from '@angular/core';
import { AudioRecorderService } from '../services/AudioRecorderService';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['../encode.component.scss']
})
export class AudioRecorderComponent implements OnInit {

  private _navigator: Navigator = navigator;

  constructor(private _recorderService: AudioRecorderService) 
  {
  }

  ngOnInit(): void 
  {
    this._recorderService.audioListChanged$.subscribe(
      { 
        next: () => {
          this._updateRecorderState();
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

  private _updateRecorderState(): void
  {
    console.log("updating recorder state");
  }

}
