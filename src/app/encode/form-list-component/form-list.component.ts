import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['form-list.component.scss','../encode.component.scss']
})

export class EncodeFormListComponent {
  
  constructor() 
  {
  }

  public openForm(formName: string)
  {
    let windowRef: Window = window.open("https://forms.gle/cQEKMhNgn2fr2MQdA","formPopup","width=600,height=600");
  }
  
}
