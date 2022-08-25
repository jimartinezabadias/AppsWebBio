import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-consigna',
    templateUrl: './consigna-component.component.html',
    styleUrls: ['consigna-component.component.scss','../encode.component.scss']
})

export class EncodeConsignaComponent implements OnInit {

  public puntos_consigna: [];
  public titulo: string; 
  public descripcion: string;
  public ruta: string;

  constructor(
    private _router: Router, 
    private _route: ActivatedRoute) 
  {
    
  }
  
  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.titulo = params['titulo'];
      this.descripcion = params['descripcion'];
      this.puntos_consigna = params['puntos_consigna'];
      this.ruta = params['ruta'];
    });
  }

}