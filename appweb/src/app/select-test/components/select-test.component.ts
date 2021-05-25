import { Component, OnInit } from '@angular/core';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IRulitConfig } from 'src/app/rulit/bits/RulitUserService';
// Allows use of ngif in template
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-select-test',
  templateUrl: './select-test.component.html',
  styleUrls: ['./select-test.component.scss']
})
export class SelectTestComponent implements OnInit {
  
  private _rulitConfig: IRulitConfig;
  isRulitOpen: boolean = false;

  constructor( private _dbService: DataDbService ) { 
    this.loadRulitConfig();
  }

  ngOnInit(): void {
    // localStorage.clear();
    localStorage.removeItem('creative-user');

  }

  // Load config from db
  async loadRulitConfig(): Promise<boolean> {
    this._rulitConfig = await this._dbService.getRulitConfig();
    this.isRulitOpen = this._rulitConfig.IS_TEST_OPEN;
    // console.log(this._rulitConfig);
    return true;
  }

}
