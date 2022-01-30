import { Perpetrator1Id, Perpetrator2Id } from "../constants";

export interface IEncodeSuspect {
    photo: string;
    isPerpetrator: boolean;
    suspectOfBeing: typeof Perpetrator1Id | typeof Perpetrator2Id
}
