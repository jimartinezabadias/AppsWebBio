import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import Swiper from 'swiper';
import { RulitTestService2 } from '../../bits/RulitTestService2';

@Component({
    selector: 'app-rulit-instructions',
    templateUrl: './rulit-instructions.component.html',
    styleUrls: ['../rulit.component.scss']
})

export class RulitInstructionsComponent implements OnInit {

    mySwiper: Swiper;

    constructor(private _route: ActivatedRoute, private _testService: RulitTestService2) {}

    ngOnInit(): void {
      // Allow user to access with a given graph and solution id in the URL
      const graphAndSolutionParam = this._route.snapshot.paramMap.get('graphAndSolutionId');
      this._testService.graphAndSolutionId = graphAndSolutionParam;
    }

    ngAfterViewInit() {
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

