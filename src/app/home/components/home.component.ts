import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor() { }

  goITBA() {
    window.open('https://www.itba.edu.ar/');
  }
  goIBCN() {
    window.open('http://www.ibcn.fmed.uba.ar/');
  }
  goUNICEN() {
    window.open('http://www.unicen.edu.ar/');
  }
  goMediaLab() {
    window.open('http://medialab.com.ar/');
  }
  goTuxdi() {
    window.open(' https://tuxdi.com/');
  }
 
  ngOnInit(): void {
  }

}
