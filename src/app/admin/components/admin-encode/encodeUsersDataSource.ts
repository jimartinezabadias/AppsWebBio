import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { IEncodeUser } from "src/app/encode/models/IEncodeUser";

// import { finalize } from "rxjs/operators";
// import { DataDbService } from "src/app/core/services/db/data-db.service";
// import { DocumentData, QuerySnapshot } from "@angular/fire/compat/firestore";
// import firebase from "firebase/compat/app";

import { EncodeFirestoreService } from "src/app/core/encodeFirestore.service";
import { DocumentData, DocumentSnapshot, QuerySnapshot } from "@angular/fire/firestore";

export class EncodeUsersDataSource implements DataSource<IEncodeUser> {

    private _usersSubject = new BehaviorSubject<IEncodeUser[]>([]);
    private _loadingSubject = new BehaviorSubject<boolean>(false);
    private _actualPageFirstDoc: DocumentSnapshot<DocumentData> = null;
    private _actualPageLastDoc: DocumentSnapshot<DocumentData> = null;
    private _prevFirstQueue: Array<DocumentSnapshot<DocumentData>> = [];

    public loading$ = this._loadingSubject.asObservable();

    constructor(private _encodeFirestoreService: EncodeFirestoreService) {}
    
    public connect(collectionViewer: CollectionViewer): Observable<IEncodeUser[] | readonly IEncodeUser[]> 
    {
        return this._usersSubject.asObservable();
    }
    
    public disconnect(collectionViewer: CollectionViewer): void
    {
        this._usersSubject.complete();
        this._loadingSubject.complete();
    }

    public async loadUsers(pageSize: number)
    {
        this._loadingSubject.next(true);

        const usersSnapshot = await this._encodeFirestoreService.getEncodeFirstPage(pageSize);
        this._loadNewResults(usersSnapshot);
        this._loadingSubject.next(false);
    }

    public loadNextPage(pageSize: number)
    {
        this._loadingSubject.next(true);

        this._prevFirstQueue.push(this._actualPageFirstDoc);

        // this._dbService.getEncodesNextPage(this._actualLastInPage, pageSize)
        //     .pipe( finalize(() => this._loadingSubject.next(false)) )
        //     .subscribe( tests => this._loadNewResults(tests));
    }

    public loadPrevPage(pageSize: number)
    {
        this._loadingSubject.next(true);

        let prevFirst = this._prevFirstQueue.pop();

        // this._dbService.getEncodePrevPage( prevFirst, this._actualFirstInPage, pageSize)
        //     .pipe( finalize(() => this._loadingSubject.next(false)) )
        //     .subscribe( tests => this._loadNewResults(tests));
    }

    private async _loadNewResults(results: QuerySnapshot<IEncodeUser>): Promise<void>
    {
        if (results.size > 0){
            let arrUsers: IEncodeUser[] = [];
            this._usersSubject.next(arrUsers);
                
            results.forEach(doc => {
                arrUsers.push(doc.data() as IEncodeUser);
            })
    
            this._actualPageFirstDoc = results.docs[0];
            this._actualPageLastDoc = results.docs[results.size - 1];

            // this._actualPageFirstDoc = await results.docs[0].ref.get();
            // this._actualPageLastDoc = await results.docs[results.size - 1].ref.get();
            
            this._usersSubject.next(arrUsers);
        }
    }

}
