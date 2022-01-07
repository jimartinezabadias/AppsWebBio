import { PerpetratorCondition, SomnolenceDegree } from "../constants";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    completed: boolean | null;
}