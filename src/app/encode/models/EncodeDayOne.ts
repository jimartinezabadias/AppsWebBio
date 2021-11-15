import { SomnolenceDegrees } from "../constants";
import { IEncodeDayOne } from "./IEncodeDayOne";

export class EncodeDayOne implements IEncodeDayOne {
    
    public somnolenceDegree: SomnolenceDegrees | null;

    constructor()
    {
        this.somnolenceDegree = null;
    }
    
}