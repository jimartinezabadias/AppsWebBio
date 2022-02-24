import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsEnum } from '../constants';
import { EncodeUserService } from '../services/EncodeUserService';

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
              private _route: ActivatedRoute,
              private _userService: EncodeUserService) 
  {
  }

  ngOnInit(): void 
  {
    this._video.nativeElement.play();
    this._video.nativeElement.volume= 0.8;
  }

  onConfirm(): void 
  {
    if (this._userService.session == SessionsEnum.SessionTwo) 
    {
      this._router.navigate(["../somnolence-degree"], { relativeTo: this._route });
      return;
    } 
    
    if (this._userService.session == SessionsEnum.SessionOne) 
    {
      this._router.navigate(["../consent"], { relativeTo: this._route });
      return;
    }
  }

}
