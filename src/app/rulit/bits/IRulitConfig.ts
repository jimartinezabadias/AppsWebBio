import { DocumentReference } from "@angular/fire/firestore";

export interface IRulitConfig {
    IS_TEST_OPEN: boolean,
    SHORT_MEMORY_MAX_EXERCISES: number,
    SHORT_MEMORY_MAX_CORRECT_EXERCISES: number,
    LONG_MEMORY_MAX_EXERCISES: number,
    LONG_MEMORY_MAX_CORRECT_EXERCISES: number,
    solutions: Array<DocumentReference>
}