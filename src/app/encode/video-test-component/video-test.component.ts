import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-video-test',
    templateUrl: './video-test.component.html',
    styleUrls: ['video-test.component.scss','../encode.component.scss']
})
export class EncodeVideoTestComponent {

    isVideoGood: boolean = true;
    isAudioGood: boolean = true;

  @ViewChild('video', { static: true }) private _video: ElementRef<HTMLVideoElement>;

  constructor(private _router: Router,
              private _route: ActivatedRoute) 
  {
  }

  ngOnInit(): void 
  {
    this._video.nativeElement.play();
    this._video.nativeElement.volume= 0.8;
  }

  onConfirm(): any 
  {
    this._router.navigate(["../consent"], { relativeTo: this._route });
  }

}
