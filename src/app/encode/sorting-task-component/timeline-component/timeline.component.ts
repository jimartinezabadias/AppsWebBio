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
  
  private _timeline$: Observable<IEncodeScreenshot[]>;

  public componentTimeline =  new Array<IEncodeScreenshot | null>(MAX_TIMELINE_SCREENSHOTS);

  @Input() 
  set timeline$(timeline$: Observable<IEncodeScreenshot[]>) {
    this._timeline$ = timeline$;
    this._timeline$.subscribe(this._onTimelineChange);
  }
  
  constructor()
  {
    // for (let index = 0; index < MAX_TIMELINE_SCREENSHOTS; index++) {
    //   this.componentTimeline.push(null);
    // }
  }

  private _onTimelineChange = (newTimeline: Array<IEncodeScreenshot>): void => {
    console.log("updating timeline component _onTimelineChange");
    // todo update component timeline
  }

}
