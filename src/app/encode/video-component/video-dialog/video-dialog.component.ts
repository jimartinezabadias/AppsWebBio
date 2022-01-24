import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { fromEvent, Observable } from 'rxjs';
import { VIDEO_PATH } from '../../constants';

@Component({
  selector: 'app-encode-video-player',
  templateUrl: './video-dialog.component.html',
  styleUrls: ['./video-dialog.component.scss'],
})
export class EncodeVideoPlayer implements OnInit {

  @ViewChild('video', { static: true }) private _video: ElementRef<HTMLVideoElement>;
  private _videoEnded$: Observable<Event>;

  constructor(public videoPlayerDialogRef: MatDialogRef<EncodeVideoPlayer>) 
  {
  }
  
  get videoSource(): string {
    return VIDEO_PATH;
  } 
  
  ngOnInit(): void 
  {
    this._video.nativeElement.play();
    this._video.nativeElement.volume= 0.8;
    this._videoEnded$ = fromEvent(this._video.nativeElement,'ended');
    this._videoEnded$.subscribe(this._videoEndedObserver);
  }

  private _videoEndedObserver = () => {
    this.videoPlayerDialogRef.close(true);
  };
}
