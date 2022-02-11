import { PerpetratorCondition, PerpetratorId, SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeImageSelectionResponse } from "./IEncodeImageSelectionResponse";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    identificationResponse: Map<PerpetratorId, IEncodeIdentificationResponse> | null;
    imageSelectionResponse: IEncodeImageSelectionResponse[] | null;
    completed: boolean | null;
}
