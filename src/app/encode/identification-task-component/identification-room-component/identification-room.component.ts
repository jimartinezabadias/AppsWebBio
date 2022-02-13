import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IEncodeSuspect } from '../../models/IEncodeSuspect';
import { ABSENT_SUSPECT_ID, ROOM_1_TITLE, ROOM_2_TITLE } from '../../constants';
import { IEncodeIdentificationResponse } from '../../models/IEncodeIdentificationResponse';
import { MatDialog } from '@angular/material/dialog';
import { ConfidenceDialogComponent } from './confidence-component/confidence.component';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-encode-identification-room',
  templateUrl: './identification-room.component.html',
  styleUrls: ['./identification-room.component.scss','../../encode.component.scss']
})
export class EncodeIdentificationRoom implements OnInit {
  
  private _lineup: Array<IEncodeSuspect>;
  
  public selectedSuspectSource = new Subject<IEncodeSuspect>();
  public selectedSuspect$: Observable<IEncodeSuspect|null>;
  
  @Input() 
  public roomTitle: typeof ROOM_1_TITLE| typeof ROOM_2_TITLE;

  @Input() 
  set lineup(lineup: Array<IEncodeSuspect>) {
    // place the absent suspect last
    const asi = lineup.findIndex(suspect => suspect.id == ABSENT_SUSPECT_ID);
    lineup.push(lineup.splice(asi, 1)[0]);

    this._lineup = lineup;
    this.selectedSuspectSource.next(null);
  };

  @Output()
  public suspectIdentified = new EventEmitter();

  get lineup(): Array<IEncodeSuspect> {
    return this._lineup;
  }

  constructor(private _dialogService: MatDialog) 
  {
  }

  ngOnInit(): void {
    this.selectedSuspect$ = this.selectedSuspectSource.asObservable();
  }

  public identifySuspect(): void {
    // todo
    // emitir una respuesta usando la interfaz
    // this.suspectIdentified.emit(this.selectedSuspect.id);

    const confidenceDialogRef = this._dialogService.open(ConfidenceDialogComponent, {});
    // extendDialogRef.afterClosed().subscribe(async (response: boolean): Promise<void> => {
    //   if(response == true) {
    //     this._wantsToExtend = false;
    //   } else if (response == false) {
    //     this._navigateToEndComponent();
    //   }
      
    //   extendDialogRef.close();
  }

}
