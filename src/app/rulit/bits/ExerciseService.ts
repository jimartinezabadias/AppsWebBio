import { IRulitExercise, IRulitStep } from "./RulitUserService";

interface IRulitTestStep extends IRulitStep {
    initialTime: number
}

export interface IRulitTestExercise extends IRulitExercise {
    currentStep: IRulitTestStep,
    initNewStep(): void,
    completeCurrentStep(): void,
    addIncorrectMove(): void,
    toDataExercise(): IRulitExercise,
    toDataStep(theStep: IRulitTestStep): IRulitStep
}

export class ExerciseService implements IRulitTestExercise {

    totalMoves: number;
    totalIncorrectMoves: number;
    totalExerciseTime: number;
    steps: Array<IRulitStep>;
    currentStep: IRulitTestStep;

    constructor(){
        this.totalMoves = 0;
        this.totalIncorrectMoves = 0;
        this.totalExerciseTime = 0;
        this.steps = new Array<IRulitStep>();
        this.currentStep = null;
    }

    initNewStep(): void {
        this.currentStep = this.buildNewStep();
    }

    completeCurrentStep(): void {
        let currentTimeInMilliseconds = new Date().getTime();

        let timeDiff = new Date(currentTimeInMilliseconds - this.currentStep.initialTime);
        this.currentStep.elapsedTime = timeDiff.getMinutes() * 60 * 1000;
        this.currentStep.elapsedTime += timeDiff.getSeconds() * 1000;
        this.currentStep.elapsedTime += timeDiff.getMilliseconds();

        this.totalExerciseTime += this.currentStep.elapsedTime;
        
        let completeStep = this.toDataStep(this.currentStep);

        this.steps.push(completeStep);
    }

    addIncorrectMove() {
        this.currentStep.incorrectMoves++;
        this.totalIncorrectMoves++;
    }

    toDataExercise(): IRulitExercise {
        
        const dataExercise: IRulitExercise = {
            totalMoves: 15 + this.totalIncorrectMoves,
            totalIncorrectMoves: this.totalIncorrectMoves,
            totalExerciseTime: this.totalExerciseTime,
            steps : this.steps
        }

        return dataExercise;
    }

    toDataStep(theStep: IRulitTestStep): IRulitStep {
        return {
            incorrectMoves: theStep.incorrectMoves,
            elapsedTime: theStep.elapsedTime
        } as IRulitStep;
    }

    private buildNewStep = ():IRulitTestStep => {
        
        let currentTimeInMilliseconds = new Date().getTime();
        
        return {
            initialTime: currentTimeInMilliseconds,
            elapsedTime: 0,
            incorrectMoves: 0
        } as IRulitTestStep;
    }

}
