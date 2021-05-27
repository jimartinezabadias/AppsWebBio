import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  images: string[] = [
    'assets/images/instruction_1.png',
    'assets/images/instruction_2.png',
    'assets/images/instruction_3.png',
    'assets/images/instruction_4.png',
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
