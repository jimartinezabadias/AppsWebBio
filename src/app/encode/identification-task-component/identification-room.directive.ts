import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[identificationRoomHost]',
})
export class EncodeIdentificationRoomDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}