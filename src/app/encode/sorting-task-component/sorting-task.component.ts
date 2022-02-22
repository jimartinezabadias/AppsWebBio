import { Component, OnInit } from '@angular/core';
import { EncodeUserService } from '../services/EncodeUserService';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { DataDbService } from 'src/app/core/services/db/data-db.service';
import { IEncodeImageSelectionResponse } from '../models/IEncodeImageSelectionResponse';

@Component({
    selector: 'app-sorting-task',
    templateUrl: './sorting-task.component.html',
    styleUrls: ['sorting-task.component.scss','../encode.component.scss']
})
export class EncodeSortingTaskComponent implements OnInit, OnExit {
  
  public isTaskRunning: boolean = false;

  public lineup: Array<IEncodeImageSelectionResponse>;

  constructor(
    private _dbService: DataDbService,
    private _userService: EncodeUserService,
    private _router: Router,
    private _route: ActivatedRoute)
  {
  }

  ngOnInit(): void {
    this.lineup = this._userService.user.sessionTwo.imageSelectionResponse;
  }

  onExit(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return true;
  }

  public startTask(): void {
    console.log("starting sort task");
    console.log(this._userService.user.sessionTwo.imageSelectionResponse);
    this.isTaskRunning = true;
  }
}
