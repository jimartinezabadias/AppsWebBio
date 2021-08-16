import { Component, OnInit } from '@angular/core';
import { SomnolenceDegrees } from "../constants";

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})

export class EncodeVideoComponent implements OnInit {
  
  get somnolenceDegrees() 
  {
    return SomnolenceDegrees;
  }

  constructor() 
  {
  }
  

  ngOnInit(): void 
  {
  }
  
}
