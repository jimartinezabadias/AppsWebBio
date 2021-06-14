import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  // se usa cuando el template es muy corto
  template: '<router-outlet></router-outlet>',
  // templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit() {
    console.log("version 14062012");
  }

}
