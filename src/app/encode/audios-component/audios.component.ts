import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnExit } from '../exit.guard';

@Component({
    selector: 'app-encode-audios',
    templateUrl: './audios.component.html',
    styleUrls: ['audios.component.scss','../encode.component.scss']
})

export class EncodeAudiosComponent implements OnExit {

  private audiosReady = false;

  constructor(private _router: Router,
    private _route: ActivatedRoute) 
  {
  }

  onExit() {
    if(this.audiosReady == false) {
      if(confirm('¿Quieres salir del test?')) {
        window.location.href = '';
        return true;
      } else {
        return false;
      } 
    } else {
      return true;
    }

  }

  onAudiosReady()
  {
    //falta chequear por audios
    this.audiosReady = true;
    this._router.navigate(["../end"], { relativeTo: this._route });
    
  }
  
}
