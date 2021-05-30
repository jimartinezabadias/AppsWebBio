import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { EncodeUser } from "../models/EncodeUser";

@Injectable({
    providedIn: 'root'
})
export class EncodeUserService {
    
    constructor(private _dbService: DataDbService)
    {

    }    
    
    // returns id of the created user
    public async createUser(): Promise<IEncodeUser>
    {
        const newUserId: string = this._dbService.getNewEncodeDocumentRef().id;
        const newUser: IEncodeUser = new EncodeUser(newUserId);
        await this._dbService.saveEncodeUser(newUser);
        return newUser;
    }
}