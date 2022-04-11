import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-encode-video-test',
    templateUrl: './video-test.component.html',
    styleUrls: ['video-test.component.scss','../encode.component.scss']
})
export class EncodeVideoTestComponent {

  public isVideoPlaying: boolean = false;
  public isVideoGood: boolean = true;
  public isAudioGood: boolean = true;

  @ViewChild('videoPlayer', { static: true }) private _video: ElementRef<HTMLVideoElement>;

  constructor() 
  {
  }

  ngOnInit(): void 
  {
    this._video.nativeElement.volume= 0.8;
    this.playVideo();
  }
  
  public playVideo(): void {
    this._video.nativeElement.play();
    this.isVideoPlaying = true;
  }
  
  public pauseVideo(): void {
    this._video.nativeElement.pause();
    this.isVideoPlaying = false;
  }

}
