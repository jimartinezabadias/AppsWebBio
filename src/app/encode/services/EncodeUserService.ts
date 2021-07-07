import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { EncodeUser } from "../models/EncodeUser";

@Injectable({
    providedIn: 'root'
})
export class EncodeUserService {
    
    private _user: IEncodeUser = null;
    
    constructor(private _dbService: DataDbService)
    {
    }    
    
    // creates and stores a new user
    // returns the created user
    public async createUser(): Promise<IEncodeUser>
    {
        const newUserId: string = this._dbService.getNewEncodeDocumentRef().id;
        const newUser: IEncodeUser = new EncodeUser(newUserId);
        await this._dbService.saveEncodeUser(newUser);
        return newUser;
    }

    // searchs in db for user with given id and stores it if found. 
    public async loadUser(userId: string): Promise<boolean> {
        let user: IEncodeUser = await this.getUserData(userId);
        if (user)
        {
            this._user = user;
            return true;
        }
        return false;
    }

    public user(): IEncodeUser {
        return this._user;
    }
    
    //
    private getUserData(userid: string): Promise<IEncodeUser> {
        return this._dbService.getEncodeUser(userid);
    }
}