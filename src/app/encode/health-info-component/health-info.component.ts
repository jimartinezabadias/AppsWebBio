import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';

@Component({
    selector: 'app-encode-health-info',
    templateUrl: './health-info.component.html',
    styleUrls: ['health-info.component.scss','../encode.component.scss']
})

export class EncodeHealthInfoComponent implements OnInit {

  constructor(private _userService: EncodeUserService) 
  {
  }
  
  ngOnInit(): void 
  {
  }

}
