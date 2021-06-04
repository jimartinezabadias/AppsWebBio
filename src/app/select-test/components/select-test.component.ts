import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/app/NavigationService/NavigationService';

// Allows use of ngif in template
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-select-test',
  templateUrl: './select-test.component.html',
  styleUrls: ['./select-test.component.scss']
})
export class SelectTestComponent implements OnInit {
  
  isRulitOpen: boolean;

  constructor(private _navigationService: NavigationService) {}
  
  ngOnInit(): void {
    this.isRulitOpen = this._navigationService.isRulitOpen;
    this._navigationService.rulitConfigChanged$.subscribe({next: (config) => this.isRulitOpen = config.IS_TEST_OPEN});
  }

}
