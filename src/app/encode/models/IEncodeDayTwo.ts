import { PerpetratorCondition, SomnolenceDegree } from "../constants";

export interface IEncodeDayTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    completed: boolean | null;
}