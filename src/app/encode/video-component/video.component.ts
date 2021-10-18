import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyDialogService } from '../services/lazy-dialog.service';
import { OnExit } from '../exit.guard';

@Component({
    selector: 'app-encode-video',
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss','../encode.component.scss']
})

export class EncodeVideoComponent implements OnInit, OnExit {

  public videoSource = "assets/videos/videoEncode.mp4";
  private dialogClosed = false;
    
  constructor(private _router: Router, private _route: ActivatedRoute, public lazyDialog: LazyDialogService) 
  {
  }

  ngOnInit(): void 
  {
  }

  onExit() {
    //si confirma, envia al componente anterior
    if(this.dialogClosed == false) {
      if(confirm('¿Quieres salir del test?')) {
        window.location.href = '';
        return true;
      } else {
        return false;
      } 
    }else {
      return true;
    }
  }

  async onVideoLaunched()
  {
    const dialogRef = await this.lazyDialog.openDialog('video-dialog');

    dialogRef.afterClosed().subscribe(result => {
      console.log("cerró");
      this.dialogClosed = true;
      this._router.navigate(["/encode/"+location.pathname.split('/').slice()[2]+"/audios"]);
    });
  }
  
}
