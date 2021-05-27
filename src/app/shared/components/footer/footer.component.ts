import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
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

}
