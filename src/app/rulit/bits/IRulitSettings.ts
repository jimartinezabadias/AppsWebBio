import { DocumentReference } from "@angular/fire/firestore";

export interface IRulitSettings {
    IS_TEST_OPEN: boolean,
    solutions: Array<DocumentReference>
}

export interface IRulitSolutionSettings {
    graphNumber: number,
    solutionNumber: number,
    shortMem_MaxExercises: number,
    shortMem_MaxCorrectExercises: number,
    longMem_MaxExercises: number,
    longMem_MaxCorrectExercises: number
}