import { firestore } from "firebase";
import { IEncodeGoogleFormResponse } from "./IEncodeGoogleFormResponse";
import { IEncodeDayOne } from "./IEncodeDayOne";
import { IEncodeUserPersonalInfo } from "./IEncodeUserPersonalInfo";
import { IEncodeUserHealthInfo } from "./IEncodeUserHealthInfo";

// EncodeUser stored in DB
export interface IEncodeUser {
    uid: string | null;
    name: string;
    email: string;
    creationDate: Date | firestore.FieldValue | null;
    googleFormsResponses: IEncodeGoogleFormResponse[] | null;
    personalInfo: IEncodeUserPersonalInfo | null;
    dayOne: IEncodeDayOne | null;
    healthInfo: IEncodeUserHealthInfo | null;
}