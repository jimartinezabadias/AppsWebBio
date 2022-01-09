import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { HttpClient } from "@angular/common/http";
import { IEncodeSettings } from "../models/IEncodeSettings";
import { IEncodeGoogleFormResponse } from "../models/IEncodeGoogleFormResponse";
import { Observable } from "rxjs";
import { IEncodeSessionOne } from "../models/IEncodeSessionOne";

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
        const googleFormsResponses: IEncodeGoogleFormResponse[] = await this._getGoogleFormsPreFilledURLs(newUserId);
        const newSessionOne: IEncodeSessionOne = { 
            somnolenceDegree: null,
            audios: null,
            completed: false
        };
          
        const newUser: IEncodeUser = {
            uid: newUserId, 
            name: userData.name, 
            email: userData.email, 
            googleFormsResponses: googleFormsResponses,
            creationDate: null,
            personalInfo: null,
            sessionOne: newSessionOne,
            sessionTwo: null,
            healthInfo: null,
            abandonedByUser: false,
            consent: null
        };
        
        await this._dbService.saveEncodeUser(newUser);
        return newUser;
    }

    // searchs in db for user with given id and stores it if found. 
    // public async loadUser(userId: string): Promise<boolean> 
    // {
    //     let user: IEncodeUser = await this.getUserData(userId);
    //     if (user)
    //     {
    //         this._user = user;
    //         return true;
    //     }
    //     return false;
    // }

    get user(): IEncodeUser 
    {
        return this._user;
    }

    set user(value: IEncodeUser) {
        this._user = value;
    }

    get googleForms$(): Observable<IEncodeGoogleFormResponse[]>{
        return this._dbService.getEncodeUserForms$(this._user.uid);
    }

    public async saveSessionOneResults() 
    {
        await this._dbService.saveEncodeSessionOneResults(this._user);
    }
    
    // private getUserData(userid: string): Promise<IEncodeUser> 
    // {
    //     return this._dbService.getEncodeUser(userid);
    // }

    private async _getGoogleFormsPreFilledURLs(newUserId: string): Promise<IEncodeGoogleFormResponse[]> {
        const encodeConfig: IEncodeSettings = await this._dbService.getEncodeSettings();
        const options = {
            params: {
                userId: newUserId,
                formsURLs: encodeConfig.googleFormsURLs
            }
        }

        return this._http.get<IEncodeGoogleFormResponse[]>(encodeConfig.generatePreFilledResponsesScriptURL, options).toPromise();
    }
}