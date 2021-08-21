import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})

export class EncodeVideoComponent implements OnInit {

  public videoSource = "assets/videos/videoEncode.mp4";
  
  constructor() 
  {
  }

  ngOnInit(): void 
  {
  }
  
}
