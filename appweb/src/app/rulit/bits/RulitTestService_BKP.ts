import { NgZone } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { FinishTestDialogComponent } from "../components/rulit-test/dialogs/finish-test-dialog.component";
import { NotConnectedNodeDialogComponent } from "../components/rulit-test/dialogs/not-connected-node-dialog.component";
import { CanvasGraph } from "./CanvasGraph";
import { ExerciseService, IRulitTestExercise } from "./ExerciseService";
import { GraphNode } from "./GraphNode";
import { IRulitExercise, RulitUserService } from "./RulitUserService";

export type TestName = "learning" | "short_memory_test" | "long_memory_test" | "no_next_test";

export class RulitTestService {

    private testName: TestName;
    
    private currentExercise: IRulitTestExercise;
    private isExerciseOver$ = new Subject<boolean>();
    private isTestOver$ = new Subject<boolean>();
    
    private newNodeChange$ = new Subject<GraphNode>();

    constructor(
        public graph: CanvasGraph, 
        private solution: Array<number>, 
        private ngZone: NgZone,
        private userService: RulitUserService,
        private _dialog: MatDialog ) {

        // Set current test name
        this.testName = this.userService.user.nextTest;
        
        //
        this.currentExercise = new ExerciseService();

        // Reverse solutions array to be used as a stack
        this.solution.reverse();

        // Observe when current node changes.
        this.graph.activeNode$.subscribe( (theNode) => { 
            
            // Remove the last element in solutions array.
            this.solution.pop();
            
            // When the node is the last in graph: 
            //      - Check if test has finished
            //      - or, go to the next exercise.
            if ( theNode.isLastNode ) {

                let currentTestExercisesArray: Array<IRulitExercise>;
                const MAX_EXERCISES: number = this.userService.getMaxExercices(this.testName);
                const MAX_CORRECT_EXERCISES: number = this.userService.getMaxCorrectExercices(this.testName);

                if ( this.testName == "learning" || this.testName == "short_memory_test" ) {
                    currentTestExercisesArray = this.userService.user.shortMemoryTest;
                } 
                else if ( this.testName == "long_memory_test" ) {
                    currentTestExercisesArray = this.userService.user.longMemoryTest;
                }
                
                currentTestExercisesArray.push(this.currentExercise.toDataExercise());
                
                let correctExercisesInTest = this.userService.getConsecutiveCorrectExercises(currentTestExercisesArray, this.testName);

                if ( correctExercisesInTest >= MAX_CORRECT_EXERCISES || currentTestExercisesArray.length == MAX_EXERCISES ) { 
                    
                    if ( this.testName == "short_memory_test" ) {
                        this.userService.user.nextTest = "long_memory_test";
                        
                        if ( correctExercisesInTest >= MAX_CORRECT_EXERCISES )
                            this.openFinishTestDialog("Completaste la prueba","Perfecto has terminado el laberinto sin ayuda dos veces. Mañana nos encontramos nuevamente.");
                        if ( currentTestExercisesArray.length == MAX_EXERCISES )
                            this.openFinishTestDialog("Completaste la prueba","Muchas gracias por participar, ya ha practicado suficiente. Mañana nos encontramos nuevamente.");
                         
                        this.isTestOver$.next(true);
                        console.log("Short memory test is over");
                    }
                    
                    if ( this.testName == "long_memory_test" ) {
                        this.userService.user.nextTest = "no_next_test";
                        this.isTestOver$.next(true);
                        this.openFinishTestDialog("Felicitaciones!","Completaste todas las pruebas.");
                        console.log("Long memory test is over"); 
                    }

                } else {

                    this.isExerciseOver$.next(true); 

                    if ( this.testName == "learning" ) { 
                        this.userService.user.nextTest = "short_memory_test";
                    }

                }

                // console.log(this.userService.user);

            }

        });

        // When theres a new clicked node
        this.newNode$.subscribe({ 
            next: (newNode) => { 
                // Can be the first move in the exercise
                if ( ! this.currentExercise.currentStep ) {
                    if ( newNode.isFirstNode ) {
                        this.currentExercise.initNewStep();
                        this.graph.activeNode = newNode;
                    } 
                    else 
                    {
                        console.log("Must start form initial node"); // TODO
                    }
                }
                if ( this.currentExercise.currentStep && newNode !== this.graph.activeNode ) {

                    if ( this.graph.isActiveNodeNextTo(newNode) ) {
                        if ( this.isSelectedNodeNextInsolution(newNode) ) {
                            // Update exercise by completing current step
                            this.currentExercise.completeCurrentStep();
                            
                            // Update current node in the graph
                            this.graph.activeNode = newNode;
    
                            // Build a new step
                            this.currentExercise.initNewStep();
                        } 
                        else 
                        {
                            // Update step and exercise variables
                            this.updateStepErrors();
                            this.currentExercise.addIncorrectMove();
    
                            // Selected node flickers in red
                            this.ngZone.runOutsideAngular( () => { this.graph.flickerNode(newNode); } );
                        }

                    } 
                    else
                    {
                        this.updateStepErrors();
                        this.currentExercise.addIncorrectMove();
                        this.openNotConnectedNodeDialog();

                    }
                    
                }
            }
        });

    }
    
    private updateStepErrors(): void {
        const stepIndex = this.currentExercise.steps.length;
        this.userService.user.stepErrors[stepIndex] += 1;
    }

    get exerciseChange$(): Observable<boolean> {
        return this.isExerciseOver$.asObservable();
    }
    
    get testChange$(): Observable<boolean> {
        return this.isTestOver$.asObservable();
    }

    setCurrentNode(newNode: GraphNode){
        this.newNodeChange$.next(newNode);
    }

    private get newNode$(): Observable<GraphNode> {
        return this.newNodeChange$.asObservable();
    }

    // Handles user click:
    //      - Searchs for a node in clicked area.
    //      - Emits the new node change.
    handleNewClick(clientX: number, clientY: number ): void {
        
        let newNode = this.graph.getNodeAtPosition(clientX,clientY);

        // Theres a node clicked
        if ( newNode ) this.setCurrentNode(newNode);

    }
    
    private isSelectedNodeNextInsolution(theNode: GraphNode): boolean {
        // Compare the node to the last element in the array
        return this.solution[this.solution.length - 1] == theNode.id;
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

    // TODO: complete and use this function
    private testIsFinished(exercises: IRulitExercise[]): boolean {
        
        if ( this.testName === "short_memory_test" ){
            if ( exercises.length >= this.userService.getMaxExercices(this.testName) ){
                return true;
            }
        }

    }

}

        // 
        // From test component initTest() 
        // 
        
        // TODO: load graph data based on graphId
        // let theGraph = await buildGraph(GRAPH_DATA,this.canvas);     [[ HECHO ]]
        
        // TODO: load solution based on solutionId
        // Copies solutions to a new array 
        // let currentSolution = Object.assign([],SOLUTION);            [[ HECHO ]]
        
        // Build the test 
        // this.testService = new RulitTestService(theGraph, currentSolution , this.ngZone, this.userService, this._dialog); 
        
        // this.clickCanvas$ = fromEvent(this.canvas.nativeElement,"click");    [[ HECHO ]]
        
        // Handles user new click
        // this.clickCanvas$.subscribe( ( event: MouseEvent ) => { 
        //     this.testService.handleNewClick(event.clientX,event.clientY);    [[ HECHO ]]
        // });

        // Draw canvas when current node changes
        // this.testService.graph.activeNode$.subscribe( () => {                [[ HECHO ]]
        //     this.testService.graph.draw(); 
        // });

        // When exercise is over go to next one
        // this.testService.exerciseChange$.subscribe( (isExerciseOver) => {    [[ HECHO ]]
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
