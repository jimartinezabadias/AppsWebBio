import { Component, OnInit } from '@angular/core';
import { RecorderStatus } from '../constants';
import { AudioRecorderService } from '../services/AudioRecorderService';
import { AudioDisclaimerComponent } from './audio-disclaimer-component/audio-disclaimer.component';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';

@Component({
    selector: 'app-audio-recorder',
    templateUrl: './audio-recorder.component.html',
    styleUrls: ['audio-recorder.component.scss','../encode.component.scss']
})
export class AudioRecorderComponent implements OnInit {

  private _navigator: Navigator;
  private _stream: MediaStream;
  private _disclaimerDialog: MatDialogRef<AudioDisclaimerComponent>;

  status: RecorderStatus;
  recorderService: AudioRecorderService;

  constructor(recorder: AudioRecorderService, public dialog: MatDialog) 
  {
    this._navigator = navigator;
    this.recorderService = recorder;
    this.status = RecorderStatus.Ready;
  }

  ngOnInit(): void 
  {
  }

  private _openDialog(): void {
    this._disclaimerDialog = this.dialog.open(AudioDisclaimerComponent, {
      width: '580px'
    });
  }

  public async onRec(): Promise<void>
  {
    if (!this.recorderService.isRecording)
    {
      try {
        this._openDialog();
        this._stream = await this._navigator.mediaDevices.getUserMedia({audio: true, video: false});
        if (this._disclaimerDialog.getState() === MatDialogState.OPEN){
          this._disclaimerDialog.close();
        }
        this.recorderService.record(this._stream);
        this.status = RecorderStatus.Recording;
      } catch (error) {
        if (this._disclaimerDialog.getState() === MatDialogState.CLOSED){
          this._openDialog();
        }
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
      this._stream.getTracks().forEach( track => track.stop() );
      this.status = RecorderStatus.Ready;
    }
  }

}
