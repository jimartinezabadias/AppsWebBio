import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-instructions',
    templateUrl: './instructions-component.component.html',
    styleUrls: ['instructions-component.component.scss','../encode.component.scss']
})

export class EncodeInstructionsComponent implements OnInit {

  public instructions: [];
  public title: string; 
  public description: string;
  public route: string;

  constructor(
    private _router: Router, 
    private _route: ActivatedRoute) 
  {
    
  }
  
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.title = params['title'];
      this.description = params['description'];
      this.instructions = params['instructions'];
      this.route = params['route'];
    });
  }

}