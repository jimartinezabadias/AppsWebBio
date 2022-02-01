import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[identificationHost]',
})
export class EncodeIdentificationDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}