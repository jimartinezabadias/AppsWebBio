import { PerpetratorCondition, PerpetratorId, SomnolenceDegree } from "../constants";
import { IEncodeIdentificationResponse } from "./IEncodeIdentificationResponse";
import { IEncodeImageSelection } from "./IEncodeImageSelection";

export interface IEncodeSessionTwo {
    somnolenceDegree: SomnolenceDegree;
    perpetratorCondition: PerpetratorCondition | null;
    identificationResponse: Map<PerpetratorId, IEncodeIdentificationResponse> | null;
    imageSelections: IEncodeImageSelection[] | null;
    completed: boolean | null;
}
