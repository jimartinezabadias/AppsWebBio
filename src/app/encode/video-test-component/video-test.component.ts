import { Component } from '@angular/core';

@Component({
    selector: 'app-encode-video-test',
    templateUrl: './video-test.component.html',
    styleUrls: ['../encode.component.scss']
})
export class EncodeVideoTestComponent {

    isVideoGood: boolean = true;
    isAudioGood: boolean = true;

  constructor() 
  {
  }

  onConfirm(): any 
  {
    console.log("video:");
    console.log(this.isVideoGood);
    console.log("audio:");
    console.log(this.isAudioGood);
  }

}
