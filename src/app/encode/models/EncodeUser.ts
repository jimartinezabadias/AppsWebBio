import { IEncodeUser } from "./IEncodeUser";

export class EncodeUser implements IEncodeUser {
    
    public userId: string;
    public name: string;

    constructor(id: string)
    {
        this.userId = id;
    }

}