import { PerpetratorCondition, PerpetratorId, SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    identificationResponse: Map<PerpetratorId, IEncodeIdentificationResponse> | null;
    completed: boolean | null;
}
