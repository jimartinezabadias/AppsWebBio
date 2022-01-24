import { Injectable } from "@angular/core";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "../models/IEncodeUser";
import { HttpClient } from "@angular/common/http";
import { IEncodeGoogleFormsSettings } from "../models/IEncodeGoogleFormsSettings";
import { IEncodeGoogleFormResponse } from "../models/IEncodeGoogleFormResponse";
import { Observable } from "rxjs";
import { IEncodeSessionOne } from "../models/IEncodeSessionOne";
import { IEncodeSessionTwo } from "../models/IEncodeSessionTwo";
import { IEncodeUserConsent } from "../models/IEncodeUserConsent";

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
        const newSessionOne: IEncodeSessionOne = { completed: false, somnolenceDegree: null, audios: null };
        const newSessionTwo: IEncodeSessionTwo = { completed: false, somnolenceDegree: null, perpetratorCondition: null, identificationResponse: null };
        const userConsent: IEncodeUserConsent = { hasAccepted: false, date: null };

        const newUser: IEncodeUser = {
            uid: newUserId, 
            name: userData.name, 
            email: userData.email, 
            googleFormsResponses: googleFormsResponses,
            creationDate: null,
            personalInfo: null,
            sessionOne: newSessionOne,
            sessionTwo: newSessionTwo,
            healthInfo: null,
            abandonedByUser: false,
            consent: userConsent
        };
        
        await this._dbService.createEncodeUser(newUser);
        return newUser;
    }

    get user(): IEncodeUser 
    {
        return this._user;
    }

    set user(user: IEncodeUser) {
        this._user = user;
    }

    get googleForms$(): Observable<IEncodeGoogleFormResponse[]> | null{
        return (this._user == null) ? null : this._dbService.getEncodeUserForms$(this._user.uid);
    }

    public async updateUserInDB() 
    {
        if (this._user == null) return ;
        
        await this._dbService.updateEncodeUser(this._user);
    }
    
    private async _getGoogleFormsPreFilledURLs(newUserId: string): Promise<IEncodeGoogleFormResponse[]> {
        const googleFormsSettings: IEncodeGoogleFormsSettings = await this._dbService.getEncodeGoogleFormsSettings();
        const options = {
            params: {
                userId: newUserId,
                formsURLs: googleFormsSettings.googleFormsURLs
            }
        }

        return this._http.get<IEncodeGoogleFormResponse[]>(googleFormsSettings.generatePreFilledResponsesScriptURL, options).toPromise();
    }
}