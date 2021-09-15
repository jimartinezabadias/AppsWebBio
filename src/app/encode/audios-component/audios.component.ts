import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})

export class EncodeAudiosComponent {
    
  constructor(private _router: Router,
    private _route: ActivatedRoute) 
  {
  }

  onAudiosReady()
  {
    //falta chequear por audios
    this._router.navigate(["../end"], { relativeTo: this._route });
    
  }
  
}
