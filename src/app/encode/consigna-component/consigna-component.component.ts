import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-consigna',
    templateUrl: './consigna-component.component.html',
    styleUrls: ['consigna-component.component.scss','../encode.component.scss']
})

export class EncodeConsignaComponent implements OnInit {

  public consigna: string;
  public ruta: string;

  constructor(
    private _router: Router, 
    private _route: ActivatedRoute) 
  {
    
  }
  
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.consigna = params['consigna'];
      this.ruta = params['ruta'];
      console.log(this.consigna);
      console.log(this.ruta);
    });
  }

}