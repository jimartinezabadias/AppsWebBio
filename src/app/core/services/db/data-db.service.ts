import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, DocumentReference, QuerySnapshot } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { CreativeUser } from './../../models/creative-user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRulitUser } from 'src/app/rulit/bits/RulitUserService';
import { AdminCreativityComponent } from 'src/app/admin/components/admin-creativity/admin-creativity.component';
import { IEncodeUser } from 'src/app/encode/models/IEncodeUser';
import { IRulitConfig } from 'src/app/rulit/bits/IRulitConfig';


@Injectable({
  providedIn: 'root'
})

export class DataDbService {
  
  private creativesCollectionRef: AngularFirestoreCollection<CreativeUser>;
  private creativesMetadataRef: AngularFirestoreCollection;
  private rulitUserCollectionRef: AngularFirestoreCollection;
  private rulitConfigRef: AngularFirestoreCollection;
  public creativesUsers = [];
  private encodeUserCollectionRef: AngularFirestoreCollection;

  constructor(private afs: AngularFirestore, private http: HttpClient) { 
    this.creativesCollectionRef = afs.collection<CreativeUser>('creatives-users', ref => ref.orderBy('dateStart', 'desc'));
    this.creativesMetadataRef = afs.collection('creatives-meta');
    this.rulitUserCollectionRef = afs.collection<IRulitUser>('rulit-users');
    this.encodeUserCollectionRef = afs.collection<IEncodeUser>('encode-users');
    this.rulitConfigRef = afs.collection("rulit-config");
  } 

  // TODO: Theres no need for async
  async saveContact(newCreativeUser: any): Promise<void> {
    this.creativesCollectionRef.add(newCreativeUser);

    // get actual counter
    // let prevCounter = await this.getCreativesMetadataCounter().ref.get();

    // update and increment tests counter
    this.getCreativesMetadataCounter().update( {"count": firestore.FieldValue.increment(1)} );

  }

  public getTestsFirstPage(pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this.afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').limit(pageSize));
    
    return testsRef.get();
  }

  public getTestsNextPage(actualLast, pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this.afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').startAfter(actualLast).limit(pageSize));
    
    return testsRef.get();
  }
  
  public getTestsPrevPage(prevFirst,actualFirst, pageSize: number = 3):  Observable<QuerySnapshot<CreativeUser>> {
    const testsRef = this.afs.collection<CreativeUser>('creatives-users', 
      ref => ref.orderBy('dateStart', 'desc').startAt(prevFirst).endBefore(actualFirst).limit(pageSize));
    
    return testsRef.get();
  }

  public getCreativesUsersData(admin: AdminCreativityComponent) {
  // Asigna la instantánea para incluir el ID del documento
  this.creativesCollectionRef.snapshotChanges().subscribe((usersSnapshop) => {
    usersSnapshop.forEach((usersData: any) => {
      this.creativesUsers.push(
        usersData.payload.doc.data()       
      );
      });
    admin.downloadFile(this.creativesUsers);
    });
  }

  async getAllRulitUsersData(): Promise<Array<IRulitUser>> {
    const snapshot = await this.rulitUserCollectionRef.ref.orderBy("trainingDate", "desc").get();
    let users = [];
    snapshot.docs.forEach( (doc: DocumentData) => {
      users.push(doc.data());
    });
    return users;
  }

  public getCreativesMetadataCounter(){
    return this.creativesMetadataRef.doc('tests-counter');
  }

  public getNewRulitDocumentRef(): DocumentReference {
    return this.rulitUserCollectionRef.ref.doc();
  }

  public getNewEncodeDocumentRef(): DocumentReference {
    return this.encodeUserCollectionRef.ref.doc();
  }

  async getRulitUserData(userId: string): Promise<IRulitUser> {
    let userData = await this.rulitUserCollectionRef.doc<IRulitUser>(userId).get().toPromise();
    userData.data().userId = userId;
    return userData.data();
  }
  
  async saveRulitUserData(testUser: IRulitUser): Promise<void> {
    
    if ( testUser.nextTest === "long_memory_test" )
      testUser.trainingDate = firestore.FieldValue.serverTimestamp();
    
    if ( testUser.nextTest === "no_next_test" )
      testUser.testDate = firestore.FieldValue.serverTimestamp();

    await this.rulitUserCollectionRef.doc(testUser.userId).set(testUser);
  }

  
  async getRulitConfig(): Promise<IRulitConfig> {
    let cfg = await this.rulitConfigRef.doc<IRulitConfig>("config").get().toPromise();
    return cfg.data();
  }
  
  public async saveEncodeUser(testUser: IEncodeUser): Promise<void> {
    const userData = Object.assign(testUser,{});
    await this.encodeUserCollectionRef.doc(testUser.userId).set(userData);
  }

  public async getEncodeUser(userId: string): Promise<IEncodeUser> {
    let userData = await this.encodeUserCollectionRef.doc<IEncodeUser>(userId).get().toPromise();
    // userData.data().userId = userId;
    return userData.data();
  }

}

