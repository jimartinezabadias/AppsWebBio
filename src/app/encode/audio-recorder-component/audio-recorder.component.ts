import { Component, OnInit } from '@angular/core';
import { RecorderStatus } from '../constants';
import { AudioRecorderService } from '../services/AudioRecorderService';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['../encode.component.scss']
})
export class AudioRecorderComponent implements OnInit {

  private _navigator: Navigator;

  status: RecorderStatus;
  recorderService: AudioRecorderService;

  constructor(recorder: AudioRecorderService) 
  {
    this._navigator = navigator;
    this.recorderService = recorder;
    this.status = RecorderStatus.Ready;
  }

  ngOnInit(): void 
  {
  }

  public async onRec(): Promise<void>
  {
    if (!this.recorderService.isRecording)
    {
      try {
        const stream = await this._navigator.mediaDevices.getUserMedia({audio: true, video: false});
        this.recorderService.record(stream);
        this.status = RecorderStatus.Recording;
      } catch (error) {
        console.log("error al acceder al microfono");
        console.log(error);
      }
    }
  }
  
  public onStop(): void
  {
    if (this.recorderService.isRecording)
    {
      this.recorderService.stopRecording();
      this.status = RecorderStatus.Ready;
    }
  }

}
