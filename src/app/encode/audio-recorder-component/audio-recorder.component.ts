import { Component, OnInit } from '@angular/core';
import { AudioRecorderService } from '../services/AudioRecorderService';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['../encode.component.scss']
})

export class AudioRecorderComponent implements OnInit {

  // private _navigator: Navigator = navigator;

  constructor(private _recorderService: AudioRecorderService) 
  {
  }

  ngOnInit(): void 
  {
  }

  public onRec(): void
  {
    if (!this._recorderService.isRecording)
    {
      this._recorderService.record();
    }
    // this._navigator.mediaDevices.getUserMedia({audio: true, video: false})
    //   .then(() => console.log("grabando"));
  }
  
  public onStop(): void
  {
    if (this._recorderService.isRecording)
    {
      this._recorderService.stopRecording();
    }
  }

  // const handleSuccess = function(stream) {
  //   const options = {mimeType: 'audio/webm'};
  //   const recordedChunks = [];
  //   const mediaRecorder = new MediaRecorder(stream, options);

  //   mediaRecorder.addEventListener('dataavailable', function(e) {
  //     if (e.data.size > 0) {
  //       recordedChunks.push(e.data);
  //     }

  //     if(shouldStop === true && stopped === false) {
  //       mediaRecorder.stop();
  //       stopped = true;
  //     }
  //   });

  //   mediaRecorder.addEventListener('stop', function() {
  //     downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
  //     downloadLink.download = 'acetest.wav';
  //   });

  //   mediaRecorder.start();
  // };

}
