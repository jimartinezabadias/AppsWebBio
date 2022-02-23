import { Component, Input, OnInit } from '@angular/core';
import { IEncodeImageSelectionResponse } from '../../models/IEncodeImageSelectionResponse';

@Component({
    selector: 'app-grid-image',
    templateUrl: './grid-image.component.html',
    styleUrls: ['grid-image.component.scss']
})
export class EncodeGridImageComponent implements OnInit {

  @Input() 
  public screenshot: IEncodeImageSelectionResponse;

  constructor()
  {
  }

  ngOnInit(): void {
  }

}
