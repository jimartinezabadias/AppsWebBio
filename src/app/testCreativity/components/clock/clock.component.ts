import {
    Component,
    OnChanges,
    SimpleChanges,
    OnInit,
    DoCheck,
    OnDestroy
} from '@angular/core';

// import { Clock } from '../../../core/models/clock.module';

@Component({
    /*usaré ese selector como una etiqueta HTML en el template*/
    selector: 'app-clock',
    templateUrl: './clock.component.html',
    styleUrls: ['./clock.component.scss']
})

export class ClockComponent implements OnInit {

    constructor() { }

    // ting = new Audio('/assets/sounds/ting.mp3');
    // alertSecond = new Audio('/assets/sounds/second.mp3');

    // clock: Clock = {
    //     seconds: 0,
    //     minutes: 0,
    //     state: 'started'
    // };

    ngOnInit() {
        // const timeClock = setInterval(() => {
        //     this.controlSecondsMinutes();
        //     this.checkLastSeconds();
        //     if (this.clock.minutes === 1) {
        //         this.pauseTimer();
        //         this.ting.play();
        //         clearInterval(timeClock);
        //     }
        // }, 1000);
    }

    // checkLastSeconds() {
    //     let count = 0 ;
    //     if (this.clock.minutes === 0 && this.clock.seconds === 50) {
    //         this.clock.state = 'alert';
    //         const timeOut = setInterval(() => {
    //             this.playSoundSecond();
    //             count++;
    //             console.log(count);
    //             if (count === 9) {
    //                 clearInterval(timeOut);
    //             }
    //         },  1000);
    //     }
    // }

    // playSoundSecond() {
    //     this.alertSecond.play();
    // }

    // controlSecondsMinutes() {
    //     if (this.clock.state !== 'finalized') {
    //         this.clock.seconds++;
    //         if (this.clock.seconds >= 60){
    //           this.clock.minutes++;
    //           this.clock.seconds = 0;
    //         }
    //       }
    // }

    // pauseTimer(): void {
    //     this.clock.state = 'finalized';
    //   }

    // resetTimer() {
    //     this.clock.state = 'started';
    //     this.clock.minutes = 0;
    //     this.clock.seconds = 0;
    // }


    // alertTime() {
    //     const timeout = setInterval(() => {
    //         let count = 0;
    //         this.alertSecond.play();
    //         count ++;
    //         if (count <= 10) {
    //         count ++;
    //         } else {
    //             clearInterval(timeout);
    //         }
    //     }, 1000);
    // }

}




