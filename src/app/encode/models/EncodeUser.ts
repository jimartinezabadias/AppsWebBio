import { IEncodeGoogleFormResponse } from "./IEncodeGoogleFormResponse";
import { IEncodeDayOne } from "./IEncodeDayOne";
import { IEncodeUser } from "./IEncodeUser";
import { IEncodeUserPersonalInfo } from "./IEncodeUserPersonalInfo";

export class EncodeUser implements IEncodeUser {
    
    public uid: string | null;
    public name: string;
    public email: string;
    public creationDate: Date | null;
    public googleFormsResponses: IEncodeGoogleFormResponse[] | null;
    public googleFormsPreFilledURLs: string[] | null;    
    public personalInfo: IEncodeUserPersonalInfo | null;
    public dayOne: IEncodeDayOne | null;

    constructor(id: string, name: string, email: string, googleFormsResponses: IEncodeGoogleFormResponse[])
    {
        this.uid = id;
        this.name = name;
        this.email = email;
        this.googleFormsResponses = googleFormsResponses;
        this.personalInfo = null;
        this.dayOne = null;
    }
    

}