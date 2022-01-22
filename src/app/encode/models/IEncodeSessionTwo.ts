import { PerpetratorCondition, PerpetratorId, SomnolenceDegree } from "../constants";
import { IEncodeChosenSuspect } from "./IEncodeSuspectIdentification";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    identificationResult: Map<PerpetratorId, IEncodeChosenSuspect> | null;
    completed: boolean | null;
}
