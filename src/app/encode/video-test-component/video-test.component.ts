import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-encode-video-test',
    templateUrl: './video-test.component.html',
    styleUrls: ['video-test.component.scss','../encode.component.scss']
})
export class EncodeVideoTestComponent {

    isVideoGood: boolean = true;
    isAudioGood: boolean = true;

  @ViewChild('video', { static: true }) private _video: ElementRef<HTMLVideoElement>;

  constructor() 
  {
  }

  ngOnInit(): void 
  {
    this._video.nativeElement.play();
    this._video.nativeElement.volume= 0.8;
  }

}
