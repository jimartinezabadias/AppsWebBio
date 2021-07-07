import { IEncodeUser } from "./IEncodeUser";

export class EncodeUser implements IEncodeUser {
    
    public uid: string;
    public name: string | null;
    public email: string | null;

    constructor(id: string)
    {
        this.uid = id;
    }

}