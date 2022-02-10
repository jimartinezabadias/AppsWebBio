import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEncodeSuspect } from '../../models/IEncodeSuspect';
import { Room1Title, Room2Title } from '../../constants';

@Component({
  selector: 'app-encode-identification-room',
  templateUrl: './identification-room.component.html',
  styleUrls: ['./identification-room.component.scss','../../encode.component.scss']
})
export class EncodeIdentificationRoom {
  
  private _lineup: Array<IEncodeSuspect>;

  public selectedSuspect: IEncodeSuspect|null;

  @Input() public roomTitle: typeof Room1Title| typeof Room2Title;

  @Input() 
  set lineup(lineup: Array<IEncodeSuspect>) {
    // shuffle
    lineup.sort((a, b) => 0.5 - Math.random());
    
    this._lineup = lineup;
  };

  @Output()
  public suspectIdentified = new EventEmitter();

  get lineup(): Array<IEncodeSuspect> {
    return this._lineup;
  }

  constructor() 
  {
    this.selectedSuspect = null;
  }

  public selectedSuspectChange(suspectId: string){
    this.selectedSuspect = this._lineup.find( suspect => suspect.id == suspectId);
  }

  public identifySuspect(): void {
    // todo
    // abrir nivel de confianza
    // emitir una respuesta usando la interfaz
    this.suspectIdentified.emit(this.selectedSuspect.id);
  }

}
