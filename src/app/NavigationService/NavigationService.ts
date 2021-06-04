import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IRulitConfig } from "../rulit/bits/IRulitConfig";

@Injectable({
    providedIn: 'root'
})
export class NavigationService {

    private _rulitConfig: IRulitConfig;
    private _rulitConfig$ = new Subject<IRulitConfig>();

    public isRulitOpen: boolean = false;

    constructor(private _dbService: DataDbService){
        this.rulitConfigChanged$.subscribe(
            {
                next: (config) => this.isRulitOpen = config.IS_TEST_OPEN  
            });

        this.loadRulitConfig();
    }

    get rulitConfig(): IRulitConfig 
    {
        return this._rulitConfig;
    }

    get rulitConfigChanged$(): Observable<IRulitConfig> {
        return this._rulitConfig$.asObservable();
    }

    // Load config from db
    async loadRulitConfig(): Promise<void> {
        this._rulitConfig = await this._dbService.getRulitConfig();
        // console.log(this._rulitConfig);
        // let solution = await this._rulitConfig.solutions[0].get();
        // console.log(solution.data());
        this._rulitConfig$.next(this._rulitConfig);
    }

}
