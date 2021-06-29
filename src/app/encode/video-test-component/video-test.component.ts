import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-video-test',
    templateUrl: './video-test.component.html',
    styleUrls: ['../encode.component.scss']
})
export class EncodeVideoTestComponent {

    isVideoGood: boolean = true;
    isAudioGood: boolean = true;

  constructor(private _router: Router,
              private _route: ActivatedRoute) 
  {
  }

  onConfirm(): any 
  {
    this._router.navigate(["../consent"], { relativeTo: this._route });
  }

}
