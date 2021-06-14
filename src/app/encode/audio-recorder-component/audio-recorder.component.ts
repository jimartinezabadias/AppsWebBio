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
  }

  public async onRec(): Promise<void>
  {
    if (!this._recorderService.isRecording)
    {
      const stream = await this._navigator.mediaDevices.getUserMedia({audio: true, video: false});
      this._recorderService.record(stream);
    }
  }
  
  public onStop(): void
  {
    if (this._recorderService.isRecording)
    {
      this._recorderService.stopRecording();
    }
  }

}
