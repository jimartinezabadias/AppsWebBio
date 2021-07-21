import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DocumentData, QuerySnapshot } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "src/app/encode/models/IEncodeUser";

export class EncodeUsersDataSource implements DataSource<IEncodeUser> {

    private _usersSubject = new BehaviorSubject<IEncodeUser[]>([]);
    private _loadingSubject = new BehaviorSubject<boolean>(false);
    private _actualFirstInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private _actualLastInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private _prevFirstQueue: Array<firebase.firestore.DocumentSnapshot<DocumentData>> = [];

    public loading$ = this._loadingSubject.asObservable();

    constructor(private _dbService: DataDbService) {}
    
    public connect(collectionViewer: CollectionViewer): Observable<IEncodeUser[] | readonly IEncodeUser[]> 
    {
        return this._usersSubject.asObservable();
    }
    
    public disconnect(collectionViewer: CollectionViewer): void
    {
        this._usersSubject.complete();
        this._loadingSubject.complete();
    }

    public loadUsers(pageSize: number)
    {
        this._loadingSubject.next(true);

        this._dbService.getEncodeFirstPage(pageSize)
            .pipe( finalize(() => this._loadingSubject.next(false)) )
            .subscribe( users => this._loadNewResults(users));

    }

    public loadNextPage(pageSize: number)
    {
        this._loadingSubject.next(true);

        this._prevFirstQueue.push(this._actualFirstInPage);

        this._dbService.getEncodesNextPage(this._actualLastInPage, pageSize)
            .pipe( finalize(() => this._loadingSubject.next(false)) )
            .subscribe( tests => this._loadNewResults(tests));
    }

    public loadPrevPage(pageSize: number)
    {
        this._loadingSubject.next(true);

        let prevFirst = this._prevFirstQueue.pop();

        this._dbService.getEncodePrevPage( prevFirst, this._actualFirstInPage, pageSize)
            .pipe( finalize(() => this._loadingSubject.next(false)) )
            .subscribe( tests => this._loadNewResults(tests));
    }

    private async _loadNewResults(results: QuerySnapshot<IEncodeUser>): Promise<void>
    {
        let arrUsers: IEncodeUser[] = [];
        this._usersSubject.next(arrUsers);
            
        results.docs.forEach( user => {
            arrUsers.push(user.data());
        });

        this._actualFirstInPage = await results.docs[0].ref.get();
        this._actualLastInPage = await results.docs[results.size - 1].ref.get();
        
        this._usersSubject.next(arrUsers);
    }

}
