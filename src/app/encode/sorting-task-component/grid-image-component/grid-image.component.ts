import { Component, Input, OnInit } from '@angular/core';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-grid-image',
    templateUrl: './grid-image.component.html',
    styleUrls: ['grid-image.component.scss']
})
export class EncodeGridImageComponent implements OnInit {

  @Input() 
  public screenshot: IEncodeScreenshot;

  constructor()
  {
  }

  ngOnInit(): void {
  }

}
