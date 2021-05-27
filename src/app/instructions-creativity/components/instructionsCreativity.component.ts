import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Element } from './../../core/models/element.module';
import { ActivatedRoute, Params  } from '@angular/router';

import Swiper, { Navigation } from 'swiper';

@Component({
  selector: 'app-instructions-creativity',
  templateUrl: './instructionsCreativity.component.html',
  styleUrls: ['./instructionsCreativity.component.scss']
})
export class InstructionsCreativityComponent implements OnInit, AfterViewInit {

  mySwiper: Swiper;

  constructor(private route: ActivatedRoute) {  }

  elementFinal: Element;


  elementClip: Element = {
    id: 1,
    name: 'Clip',
    image: 'assets/images/clip.jpg',
    code: '312917'
};
  elementJournal: Element = {
    id: 2,
    name: 'Diario',
    image: 'assets/images/diario.jpg',
    code: '1016221914112'
  };
  elementCup: Element = {
    id: 3,
    name: 'Vaso',
    image: 'assets/images/vaso.jpg',
    code: '32217'
  };


  boxObjects = [
    this.elementClip,
    this.elementJournal,
    this.elementCup
  ];

  ngOnInit(): void {
    let auxCode = '';
    this.route.params.subscribe(
      (params: Params) => {
        auxCode = params.code;
        this.elementFinal = this.detectCodeToObject(auxCode);
        localStorage.setItem('final-element', JSON.stringify(this.elementFinal));
      }
    );
  }

  detectCodeToObject(code: string){
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.boxObjects.length; i++) {
      const object = this.boxObjects[i];
      if (object.code === code) {
        return object;
      }
    }
  }

  ngAfterViewInit() {
    Swiper.use([Navigation]);

    this.mySwiper = new Swiper('.swiper-container', {
      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },
      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
