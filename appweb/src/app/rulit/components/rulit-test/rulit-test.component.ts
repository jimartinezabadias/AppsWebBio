import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, MediaMatcher } from '@angular/cdk/layout';

import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import { map, take, tap } from "rxjs/operators";

import { buildGraph } from 'src/app/rulit/bits/GraphUtils';
import { RulitTestService } from 'src/app/rulit/bits/RulitTestService';

// import { GRAPH as GRAPH_DATA, SOLUTION } from "src/app/rulit/bits/graphs_available/Graph1_data_testing";
import { RulitUserService } from 'src/app/rulit/bits/RulitUserService';
import { ScreenOrientationDialogComponent } from './dialogs/orientation-dialog.component';
import { LongMemoryWellcomeDialogComponent } from './dialogs/long-memory-wellcome-dialog.component';
import { RulitTestService2 } from '../../bits/RulitTestService2';

const MAX_CANVAS_HEIGHT = 480;
const MAX_MOBILE_SCREEN_WIDTH = 768;

@Component({
    selector: 'app-rulit-test',
    templateUrl: './rulit-test.component.html',
    styleUrls: ['../rulit.component.scss']
})

export class RulitTestComponent implements OnInit, AfterViewChecked, OnDestroy {

    @ViewChild('countdown') private _countdown: ElementRef<HTMLElement>;
    @ViewChild('canvas', { static: true }) private canvas: ElementRef<HTMLCanvasElement>;
    private clickCanvas$: Observable<Event>;
    private orientationChange$: Subscription;
    private metaviewport: HTMLMetaElement = document.querySelector('meta[name="viewport"]');
    
    countDown: number = 3;
    testStarted: boolean = false;

    private testService: RulitTestService;

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private userService: RulitUserService,
        private _testService2: RulitTestService2,
        private _dialog: MatDialog,
        private _breakpointObserver: BreakpointObserver,
        private _mediaMatcher: MediaMatcher ) {}

    async ngOnInit(): Promise<void> {
        
        // When user enters the URL for the long term memory test.
        //      - eg. /rulit/test/<<userId>>
        if ( ! this.userService.user ) {
            let userIdParam = this.route.snapshot.paramMap.get('userId');
            await this.userService.loadUserFromDB(userIdParam);
        }

        // TODO: Cambiar la segunda condicion por: ! this._testService.isTesting
        if ( this.userService.user.nextTest === "long_memory_test" && this.userService.user.longMemoryTest.length === 0 ) {
            await this.openLongMemoryWellcomeDialog().afterClosed().toPromise();
        }

        // TODO: observe only for mobile devices using mediaMatcher
        // Test inits if the mobile is landscape
        let orientationDialogRef: MatDialogRef<ScreenOrientationDialogComponent> = null;
        
        this.orientationChange$ = this._breakpointObserver.observe([
            Breakpoints.HandsetPortrait
        ]).subscribe( (result) => {
            if ( result.matches ) {
                orientationDialogRef = this.openScreenOrientationDialog();
            } else {
                if ( orientationDialogRef ) {
                    orientationDialogRef.close();
                }
                if ( ! this._testService2.isTesting ) this.initTest();
                // if ( ! this.testService ) this.initTest();
            }
        });

    }

    private async initTest() {

        await this.countdown();

        this.setCanvasSize();
        
        await this._testService2.initGraph(this.canvas);
        
        this._testService2.graph.draw();
        
        // TODO: load graph data based on graphId
        // let theGraph = await buildGraph(GRAPH_DATA,this.canvas); [[hecho]]
        
        // TODO: load solution based on solutionId
        // Copies solutions to a new array 
        // let currentSolution = Object.assign([],SOLUTION);
        
        // Build the test 
        // this.testService = new RulitTestService(theGraph, currentSolution , this.ngZone, this.userService, this._dialog); 
        
        // this.clickCanvas$ = fromEvent(this.canvas.nativeElement,"click");
        
        // Handles user new click
        // this.clickCanvas$.subscribe( ( event: MouseEvent ) => { 
        //     this.testService.handleNewClick(event.clientX,event.clientY);
        // });

        // Draw canvas when current node changes
        // this.testService.graph.activeNode$.subscribe( () => { 
        //     this.testService.graph.draw(); 
        // });

        // When exercise is over go to next one
        // this.testService.exerciseChange$.subscribe( (isExerciseOver) => {
        //     if (isExerciseOver) this.goNextExercise(); 
        // });
        
        // When test is over
        // this.testService.testChange$.subscribe( (isTestOver) => {
        //     this.userService.saveTestData();
        // });

        // On desktop screens, when mouse move:
        //      - set cursor to pointer if over a node
        // if ( ! this._mediaMatcher.matchMedia(Breakpoints.Handset).matches ){
        //     fromEvent(this.canvas.nativeElement,"mousemove")
        //         .subscribe( (event: MouseEvent ) => { this.ngZone.runOutsideAngular( () => { 

        //                 let newNode = this.testService.graph.getNodeAtPosition(event.clientX,event.clientY);
        
        //                 // Theres a node
        //                 if ( newNode ) {
        //                     if ( this.testService.graph.isActiveNodeNextTo(newNode) ) {
        //                         this.canvas.nativeElement.style.cursor = "pointer";
        //                         this.testService.graph.highlightNode(newNode);
        //                         this.testService.graph.draw();    
        //                     }
        //                 }
        //                 else
        //                 {
        //                     this.canvas.nativeElement.style.cursor = "default";
        //                     this.testService.graph.resetHighlights();
        //                     this.testService.graph.draw();
        //                 }
                        
        //             }
        //         )}
        //     );
        // }

        // Test starts with first node selected
        // this.testService.setCurrentNode(this.testService.graph.firstNode);

        // First Draw
        // this.testService.graph.draw();

        this.testStarted = true;

    }
    
    // Based on window size, sets the canvas used for the graph
    private setCanvasSize(): void {
        
        const mediaQueryList = this._mediaMatcher.matchMedia(`(max-height: ${MAX_CANVAS_HEIGHT}px) and (orientation: landscape)`);

        if ( mediaQueryList.matches ) {
            // Has to do this compare because safari and chrome gives different results
            let screenHeight = (window.screen.height < window.screen.width) ? window.screen.height: window.screen.width;
            this.canvas.nativeElement.width = (screenHeight * 0.9) * 1.4;
            this.canvas.nativeElement.height = screenHeight * 0.9;
        }
        else
        {
            this.canvas.nativeElement.width = 672;
            this.canvas.nativeElement.height = 480;
        }

    }

    private goNextExercise(): void {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['rulit/test',this.userService.user.userId]);
    }

    private countdown() {
        
        let countdownStart = 3;
        
        return interval(1000).pipe(
            take(countdownStart + 1),
            map(i => countdownStart - i),
            tap( i => { this.countDown = i } )
        ).toPromise();

    }

    ngAfterViewChecked(): void {
        // scroll to the graph
        if ( this.testService )
            this.canvas.nativeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        if ( ! this.testService ) {
            // console.log("test");
            // console.log(this._countdown.nativeElement);
            this._countdown.nativeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }

    }

    ngOnDestroy(): void {
        this.metaviewport.content = 'width=device-width, initial-scale=1.0';
        // this.orientationChange$.unsubscribe();
    }

    // Dialogs

    private openScreenOrientationDialog(): MatDialogRef<ScreenOrientationDialogComponent, any> {
        this.metaviewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0";
        // TODO: estilos
        const config = new MatDialogConfig();
        config.panelClass = ["custom-rulit-dialog"];
        config.disableClose = true;
        return this._dialog.open(ScreenOrientationDialogComponent, config);
    }
    
    private openLongMemoryWellcomeDialog(): MatDialogRef<LongMemoryWellcomeDialogComponent, any> {
        const config = new MatDialogConfig();
        config.panelClass = ["custom-rulit-dialog"];
        config.maxWidth = "30rem";
        config.data = { 
            userName: this.userService.user.name,
            message: "Hace un tiempo descubriste la ruta para atravesar este laberinto. Trata de recordarla debemos salir de aquí una vez más. Igual que antes te indicaremos si vas por el camino correcto."
        }
        return this._dialog.open(LongMemoryWellcomeDialogComponent, config);
    }

}

