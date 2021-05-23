import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  images: string[] = [
    './assets/videos/instructionRulit_1.gif',
    './assets/images/instructionRulit_2.png',
    './assets/images/instruction_4.png',
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
