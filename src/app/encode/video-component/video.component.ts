import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { LazyDialogService } from '../services/lazy-dialog.service';
import { OnExit } from '../exit.guard';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})

export class EncodeVideoComponent implements OnInit, OnExit {

  @ViewChild('video', { static: true }) private _video: ElementRef<HTMLVideoElement>;
  private _videoEnded$: Observable<Event>;
  public videoSource = "assets/videos/videoEncode.mp4";
    
  constructor(private _router: Router, private _route: ActivatedRoute, public lazyDialog: LazyDialogService) 
  {
  }

  ngOnInit(): void 
  {
    this._videoEnded$ = fromEvent(this._video.nativeElement,'ended');
    this._videoEnded$.subscribe(this._videoEndedObserver);
  }

  onExit() {
    //si confirma, envia al componente anterior
    const rta = confirm('¿Quieres salir del test?');
    return rta; 
  }

  private _videoEndedObserver = () => { 
    this._router.navigate(["../audios"], { relativeTo: this._route });
  };
  
}
