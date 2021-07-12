import { firestore } from "firebase";
import { IEncodeUser } from "./IEncodeUser";

export class EncodeUser implements IEncodeUser {
    
    public uid: string | null;
    public name: string;
    public email: string;
    public creationDate: Date | null;
    

    constructor(id: string, name: string, email: string)
    {
        this.uid = id;
        this.name = name;
        this.email = email;
    }

}