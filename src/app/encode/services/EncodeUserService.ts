import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { EncodeUser } from "../models/EncodeUser";
import { GENERATE_GOOGLE_FORMS_LINKS_SCRIPT_URL, googleFormsURLs } from "../constants";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EncodeUserService {
    
    private _user: IEncodeUser = null;
    
    constructor(private _dbService: DataDbService, private _http: HttpClient)
    {
    }    
    
    // creates and stores a new user
    // returns the created user
    public async createNewUser(userData: {name: string, email: string}): Promise<IEncodeUser>
    {
        const newUserId: string = this._dbService.getNewEncodeDocumentRef().id;
        const newUser: IEncodeUser = new EncodeUser(newUserId, userData.name, userData.email);
        const googleFormsPreFilledURLs: string[] = await this._getGoogleFormsPreFilledURLs(newUserId);
        await this._dbService.saveEncodeUser(newUser);
        return newUser;
    }

    // searchs in db for user with given id and stores it if found. 
    public async loadUser(userId: string): Promise<boolean> 
    {
        let user: IEncodeUser = await this.getUserData(userId);
        if (user)
        {
            this._user = user;
            return true;
        }
        return false;
    }

    public user(): IEncodeUser 
    {
        return this._user;
    }
    
    //
    private getUserData(userid: string): Promise<IEncodeUser> 
    {
        return this._dbService.getEncodeUser(userid);
    }

    private _getGoogleFormsPreFilledURLs(userID: string): any {
        const options = {
            params: {
                userID:  userID,
                formsURLs: [googleFormsURLs.testFormURL]
            }
        }
        const request = this._http.get<any>(GENERATE_GOOGLE_FORMS_LINKS_SCRIPT_URL, options);
        request.subscribe(response => {
            console.log(response);
        });
    }
}