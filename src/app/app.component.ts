import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  // se usa cuando el template es muy corto
  template: '<router-outlet></router-outlet>'
})

export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit() {
  }

}
