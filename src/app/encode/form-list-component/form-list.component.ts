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
    let windowRef: Window;
    switch (formName) {
      case 'stai':
        windowRef = window.open("https://forms.gle/aXHRPZz4v2fohMUj6","formPopup","width=600,height=600");
        break;
      case 'panas':
        windowRef = window.open("https://forms.gle/fgbU4Zx9gxwcWB8V6","formPopup","width=600,height=600");
        break;
      case 'ipip':
        windowRef = window.open("https://forms.gle/YiQw42ZyxHx6WK1Z9","formPopup","width=600,height=600");
        break;
    
      default:
        break;
    }
  }
  
}
