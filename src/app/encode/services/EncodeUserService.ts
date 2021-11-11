import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { EncodeUser } from "../models/EncodeUser";
import { HttpClient } from "@angular/common/http";
import { IEncodeSettings } from "../models/IEncodeSettings";
import { IEncodeGoogleFormResponse } from "../models/IEncodeGoogleFormResponse";
import { FormGroup } from "@angular/forms";
import { IEncodeUserPersonalInfo } from "../models/IEncodeUserPersonalInfo";
import { IEncodeUserHealthInfo } from "../models/IEncodeUserHealthInfo";

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
        const googleFormsResponses: IEncodeGoogleFormResponse[] = await this._getGoogleFormsPreFilledURLs(userData.email);
        const newUser: IEncodeUser = new EncodeUser(newUserId, userData.name, userData.email,googleFormsResponses);
        // TODO: armar array con google forms
        
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

    public storePersonalInfo(personalInfo: IEncodeUserPersonalInfo): void {
        this._user.personalInfo = personalInfo;
    }

    public storeHealthInfo(healthInfo: IEncodeUserHealthInfo): void {
        this._user.healthInfo= healthInfo;
    }
    
    //
    private getUserData(userid: string): Promise<IEncodeUser> 
    {
        return this._dbService.getEncodeUser(userid);
    }

    private async _getGoogleFormsPreFilledURLs(userEmail: string): Promise<IEncodeGoogleFormResponse[]> {
        const encodeConfig: IEncodeSettings = await this._dbService.getEncodeSettings();
        const options = {
            params: {
                email: userEmail,
                formsURLs: encodeConfig.googleFormsURLs
            }
        }
        return this._http.get<IEncodeGoogleFormResponse[]>(encodeConfig.generatePreFilledResponsesScriptURL, options).toPromise();
    }
}