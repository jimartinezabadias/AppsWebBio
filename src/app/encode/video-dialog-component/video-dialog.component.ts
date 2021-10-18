import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyDialogService } from '../services/lazy-dialog.service';
import { OnExit } from 'src/app/encode/exit.guard';

@Component({
    selector: 'app-encode-video-dialog',
    templateUrl: './video-dialog.component.html',
    styleUrls: ['video-dialog.component.scss','../encode.component.scss']
})

export class EncodeVideoDialogComponent implements OnInit, OnExit {

  public videoSource = "assets/videos/videoEncode.mp4";

  public videoLaunched;
    
  constructor(private _router: Router, private _route: ActivatedRoute, public lazyDialog: LazyDialogService) 
  {
  }

  ngOnInit(): void 
  {
    this.lazyDialog.openDialog('video-dialog')
    this.videoLaunched = false;
  }

  onExit() {
    //si confirma, envia al componente anterior
    if(this.videoLaunched == false) {
      const rta = confirm('¿Quieres salir del test?');
      return rta; 
    } else {
      return true;
    }

  }

  launchVideo() {
    this.videoLaunched = true;
    console.log("video running");
  }
  
}
