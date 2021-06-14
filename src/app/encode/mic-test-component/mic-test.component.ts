import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-mic-test',
    templateUrl: './mic-test.component.html',
    styleUrls: ['../encode.component.scss']
})

export class EncodeMicTestComponent implements OnInit {

  constructor(private _userService: EncodeUserService) 
  {
  }

  ngOnInit(): void 
  {
  }

}
