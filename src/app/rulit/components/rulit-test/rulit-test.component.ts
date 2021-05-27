import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';

import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import { filter, map, take, tap } from "rxjs/operators";

import { RulitUserService } from 'src/app/rulit/bits/RulitUserService';
import { ScreenOrientationDialogComponent } from './dialogs/orientation-dialog.component';
import { LongMemoryWellcomeDialogComponent } from './dialogs/long-memory-wellcome-dialog.component';
import { RulitTestService } from '../../bits/RulitTestService';
import { GraphNode } from '../../bits/GraphNode';
import { NotConnectedNodeDialogComponent } from './dialogs/not-connected-node-dialog.component';
import { FinishTestDialogComponent } from './dialogs/finish-test-dialog.component';

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
    private exerciseChange$: Subscription;
    private testChange$: Subscription;
    private metaviewport: HTMLMetaElement = document.querySelector('meta[name="viewport"]');
    
    countDown: number = 3;
    testStarted: boolean = false;

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private router: Router,
        private userService: RulitUserService,
        private _testService: RulitTestService,
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
        
        // Test inits if the mobile is landscape or not in mobile
        if ( this._mediaMatcher.matchMedia(Breakpoints.Handset).matches ) {
            
            let orientationDialogRef: MatDialogRef<ScreenOrientationDialogComponent> = null;
            
            this.orientationChange$ = this._breakpointObserver.observe(
                Breakpoints.HandsetLandscape
            ).subscribe( (result: BreakpointState) => {
                if ( result.matches ) {
                    if ( orientationDialogRef ) {
                        orientationDialogRef.close();
                    }
                    if (! this.testStarted && this._breakpointObserver.isMatched(Breakpoints.HandsetLandscape) ) {
                        this.testStarted = true;
                        this.initTest();
                    }
                } 
                else
                {
                    orientationDialogRef = this.openScreenOrientationDialog();
                }
            });

        }
        else // Not in mobile
        {
            if ( ! this._testService.isTesting ) this.initTest();
        }

    }

    private async initTest() {

        await this.countdown();

        this.setCanvasSize();
        
        await this._testService.initGraph(this.canvas, this.userService.user.graphAndSolutionCode);
        
        // Observers
        this.clickCanvas$ = fromEvent(this.canvas.nativeElement,"click");
        
        // Handles user new click
        this.clickCanvas$
            .pipe( 
                map( (ev: MouseEvent) => { 
                    return this._testService.graph.getNodeAtPosition(ev.clientX,ev.clientY);
                }),
                filter ( (node: GraphNode | undefined ) => node !== undefined ),
                filter( (node: GraphNode) => node != this._testService.graph.activeNode )
            )
            .subscribe({ 
                next: (node) => { 
                    if (this._testService.isNodeNextInSolution(node)) {
                        this._testService.setActiveNode(node);
                        this._testService.graph.draw();
                    }
                    else
                    {
                        this._testService.registerError(this.userService.user);
                        if (this._testService.graph.isActiveNodeNextTo(node)) {
                            this._testService.graph.flickerNode(node);
                        }
                        else
                        {
                            this.openNotConnectedNodeDialog();
                        }
                    }
                }
            }
        );

        // On desktop screens, when mouse move:
        //      - set cursor to pointer if over a node
        if ( ! this._mediaMatcher.matchMedia(Breakpoints.Handset).matches ){
            fromEvent(this.canvas.nativeElement,"mousemove")
                .subscribe( (event: MouseEvent ) => { this.ngZone.runOutsideAngular( () => { 

                        let newNode = this._testService.graph.getNodeAtPosition(event.clientX,event.clientY);
        
                        // Theres a node
                        if ( newNode ) {
                            if ( this._testService.graph.isActiveNodeNextTo(newNode) ) {
                                this.canvas.nativeElement.style.cursor = "pointer";
                                this._testService.graph.highlightNode(newNode);
                                this._testService.graph.draw();    
                            }
                        }
                        else
                        {
                            this.canvas.nativeElement.style.cursor = "default";
                            this._testService.graph.resetHighlights();
                            this._testService.graph.draw();
                        }
                        
                    }
                )}
            );
        }
        
        // When exercise is over go to next one
        this.exerciseChange$ = this._testService.isExerciseOver$
            .pipe(
                filter( (isExerciseOver) => isExerciseOver === true ),
                tap( () => {
                    if (this._testService.testName === "learning") 
                        this.userService.user.nextTest = "short_memory_test";
                })
            )
            .subscribe({
                next: () => {
                    this._testService.isTesting = false;
                    this.goNextExercise();
                    this.exerciseChange$.unsubscribe();
                }
            }
        );

        // When test is over go to next one
        this.testChange$ = this._testService.isTestOver$
            .pipe( 
                filter( (testOver) => testOver !== null ) )
            .subscribe( { 
                next: (testOver) => {
                    if ( this._testService.testName === "short_memory_test" ) {
                        this.userService.user.nextTest = "long_memory_test";
                        if ( testOver === "MAX_CORRECT_EXERCISES" ) {
                            this.openFinishTestDialog("Completaste la prueba","Perfecto encontraste el final del camino oculto. En unos dias te enviaremos un e-mail para completar la prueba.");
                        }
                        else if ( testOver === "MAX_EXERCISES" ) {
                            this.openFinishTestDialog("Completaste la prueba","Muchas gracias por participar, ya practicaste suficiente. En unos dias te enviaremos un e-mail para completar la prueba.");
                        }
                    }
                    else if ( this._testService.testName === "long_memory_test" )
                    {
                        this.userService.user.nextTest = "no_next_test";
                        this.openFinishTestDialog("¡Felicitaciones!","Completaste todas las pruebas. ¡Has hecho un gran aporte a la ciencia!");
                    }
                    this._testService.isTesting = false;
                    this.userService.saveTestData();
                }
            }
        );
        
        // 
        this._testService.startTest(this.userService);

        // Test starts with first node selected
        this._testService.setActiveNode(this._testService.graph.firstNode);

        // First Draw
        this._testService.graph.draw();

        this.testStarted = true;

    }
    
    // Sets the canvas used for the graph based on window size
    private setCanvasSize(): void {

        // Has to do this compare because safari and chrome gives different results
        const screenHeight = (window.screen.height < window.screen.width) ? window.screen.height: window.screen.width;

        if ( this._mediaMatcher.matchMedia( Breakpoints.Handset ).matches ) {
            this.canvas.nativeElement.width = (screenHeight * 0.9) * 1.4;
            this.canvas.nativeElement.height = screenHeight * 0.9;
        }
        else {
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
        if ( this.testStarted )
            this.canvas.nativeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        if ( ! this.testStarted )
            this._countdown.nativeElement.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
    }

    ngOnDestroy(): void {
        this.metaviewport.content = 'width=device-width, initial-scale=1.0';
        this._testService.isTesting = false;
        if ( this.orientationChange$ ) this.orientationChange$.unsubscribe();
        this.testChange$.unsubscribe();
        this.exerciseChange$.unsubscribe();
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
            message: "Hace unos dias encontraste el final del camino oculto. Trata de recordarlo para hallarlo nuevamente, el camino oculto es el mismo. "
        }
        return this._dialog.open(LongMemoryWellcomeDialogComponent, config);
    }

    private openNotConnectedNodeDialog() {
        const config = new MatDialogConfig();
        config.panelClass = ["custom-rulit-dialog"];
        this._dialog.open(NotConnectedNodeDialogComponent,config);
    }

    // 
    private openFinishTestDialog(theTitle: string, theMessage: string): MatDialogRef<FinishTestDialogComponent, any> {
        const config = new MatDialogConfig();
        config.data = { title: theTitle, message: theMessage };
        config.panelClass = ["custom-rulit-dialog"];
        config.disableClose = true;
        return this._dialog.open(FinishTestDialogComponent,config);
    }

}

