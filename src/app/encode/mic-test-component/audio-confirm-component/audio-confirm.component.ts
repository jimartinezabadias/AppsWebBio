import { Component, OnInit, Input } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-audio-confirm',
    templateUrl: './audio-confirm.component.html',
    styleUrls: ['../../encode.component.scss']
})
export class AudioConfirmComponent implements OnInit {

  @Input() audio?: SafeResourceUrl;

  constructor() 
  {
  }

  ngOnInit(): void 
  {
  }

}
