import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MAX_TIMELINE_SCREENSHOTS } from '../../constants';
import { IEncodeScreenshot } from '../../models/IEncodeScreenshot';

@Component({
    selector: 'app-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['timeline.component.scss']
})
export class EncodeTimelineComponent {

  public timeline =  new Array<IEncodeScreenshot | null>(MAX_TIMELINE_SCREENSHOTS);

  @Input() 
  set timeline$(timeline$: Observable<Array<IEncodeScreenshot | null>>) {
    timeline$.subscribe(this._onTimelineChange);
  }
  
  constructor()
  {
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot | null>): void => {
    console.log("updating timeline component _onTimelineChange");
    this.timeline = newTimeline;
  }

}
