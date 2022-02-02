import { Perpetrator1Id, Perpetrator2Id } from "../constants";

export interface IEncodeSuspect {
    photoStorageRef: string;
    isPerpetrator: boolean;
    suspectOfBeing: typeof Perpetrator1Id | typeof Perpetrator2Id
}
