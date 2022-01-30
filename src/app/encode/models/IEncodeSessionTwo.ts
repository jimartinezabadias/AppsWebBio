import { PerpetratorCondition, Perpetrator1Id, Perpetrator2Id,  SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeImageSelectionResponse } from "./IEncodeImageSelectionResponse";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    imageSelectionResponse: IEncodeImageSelectionResponse[] | null;
    identificationResponse: Map< typeof Perpetrator1Id | typeof Perpetrator2Id , IEncodeIdentificationResponse> | null;
    completed: boolean | null;
}
