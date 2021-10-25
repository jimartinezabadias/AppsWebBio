import { IEncodeGoogleFormResponse } from "./IEncodeGoogleFormResponse";
import { IEncodeUser } from "./IEncodeUser";

export class EncodeUser implements IEncodeUser {
    
    public uid: string | null;
    public name: string;
    public email: string;
    public creationDate: Date | null;
    public googleFormsResponses: IEncodeGoogleFormResponse[] | null;

    constructor(id: string, name: string, email: string)
    {
        this.uid = id;
        this.name = name;
        this.email = email;
    }

}