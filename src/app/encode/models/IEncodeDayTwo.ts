import { SomnolenceDegrees } from "../constants";

export interface IEncodeDayTwo {
    somnolenceDegree: SomnolenceDegrees;
    hasPerpetrator: boolean | null;
    completed: boolean | null;
}