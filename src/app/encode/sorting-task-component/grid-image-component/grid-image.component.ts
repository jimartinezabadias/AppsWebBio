import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-grid-image',
    templateUrl: './grid-image.component.html',
    styleUrls: ['grid-image.component.scss']
})
export class EncodeGridImageComponent implements OnInit {

  @Input() 
  public screenshot: IEncodeScreenshot;

  @Input() 
  public timeline$: Observable<IEncodeScreenshot[]>;

  @Output()
  public addScreenshotToTimelineEvent = new EventEmitter<IEncodeScreenshot>();

  constructor()
  {
  }

  ngOnInit(): void {
  }

  public addToTimeline() {
    // console.log("add to timeline");
    // console.log(this.screenshot);
    this.addScreenshotToTimelineEvent.emit(this.screenshot);
  }

}
