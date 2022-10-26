import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/navigation-service/navigation.service';

import Swiper from 'swiper';

@Component({
    selector: 'app-rulit-instructions',
    templateUrl: './rulit-instructions.component.html',
    styleUrls: ['../rulit.component.scss']
})

export class RulitInstructionsComponent implements OnInit {

    mySwiper: Swiper;

    constructor(private _route: ActivatedRoute, private _navigationService: NavigationService) {}

    ngOnInit(): void {
      // Allow user to access with a given graph and solution id in the URL
      const graphAndSolutionParam = this._route.snapshot.paramMap.get('graphAndSolutionId');
      if (graphAndSolutionParam) this._navigationService.rulitSolutionCodeUrl = graphAndSolutionParam;
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

