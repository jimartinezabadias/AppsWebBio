import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { DocumentData } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";
import { DataDbService } from "src/app/core/services/db/data-db.service";
import { IEncodeUser } from "src/app/encode/models/IEncodeUser";

export class EncodeUsersDataSource implements DataSource<IEncodeUser> {

    private testsSubject = new BehaviorSubject<IEncodeUser[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    private actualFirstInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private actualLastInPage: firebase.firestore.DocumentSnapshot<DocumentData> = null;
    private prevFirstQueue: Array<firebase.firestore.DocumentSnapshot<DocumentData>> = [];

    constructor(private dbService: DataDbService) {}
    
    connect(collectionViewer: CollectionViewer): Observable<IEncodeUser[] | readonly IEncodeUser[]> {
        throw new Error("Method not implemented.");
    }
    
    disconnect(collectionViewer: CollectionViewer): void {
        throw new Error("Method not implemented.");
    }

}
