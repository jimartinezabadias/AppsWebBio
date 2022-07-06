import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat';
import { Parser, transforms } from 'json2csv';
import { RulitFirestoreService } from 'src/app/core/rulitFirestore.service';
import { IRulitSettings, IRulitSolutionSettings } from 'src/app/rulit/bits/IRulitSettings';
import { CSV_SEPARATOR } from '../../constants';

const SEPARATOR = CSV_SEPARATOR;

@Component({
  selector: 'app-admin-rulit',
  templateUrl: './admin-rulit.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminRulitComponent {

  shortMemMaxExercises: number = 0;
  longMemMaxExercises: number = 0;

  constructor( 
    private _rulitFirestoreService: RulitFirestoreService 
    ) {}
  
  async getData() {
    const rulitSettingsData: IRulitSettings = (await this._rulitFirestoreService.getRulitSettings()).data();
    rulitSettingsData.solutions.forEach(async (solutionDocRef) => {
      const settings: IRulitSolutionSettings = (await this._rulitFirestoreService.getRulitSolutionSettings(solutionDocRef.id)).data();
      if (this.shortMemMaxExercises < settings.shortMem_MaxExercises)
        this.shortMemMaxExercises = settings.shortMem_MaxExercises;
      if (this.longMemMaxExercises < settings.longMem_MaxExercises)
        this.longMemMaxExercises = settings.longMem_MaxExercises;
    });

    const usersQuery = await this._rulitFirestoreService.getAllRulitUsersData();
    const rulitUsers = usersQuery.docs.map(doc => doc.data());
    rulitUsers.map( (user) => { 
      if ( user.trainingDate )
        user.trainingDate = (user.trainingDate as firebase.firestore.Timestamp).toDate().toLocaleString("es-AR")
      if ( user.testDate )
        user.testDate = (user.testDate as firebase.firestore.Timestamp).toDate().toLocaleString("es-AR");
    });
    
    // CSV
    const flatOptions = transforms.flatten({ objects: true, arrays: true, separator: SEPARATOR });
    let fields = this._getFields();
    const json2csvParser = new Parser({ fields: fields, transforms: [ flatOptions ] });
    const csv = json2csvParser.parse(rulitUsers);
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  // Returns the column names of the csv in the correct order
  private _getFields(): Array<string> {
    const STEPS = 15;
    // Set static fields
    let fields = [
      "userId",
      "name",
      "email",
      "trainingDate",
      "testDate",
      "nextTest",
      "graphAndSolutionCode"
    ];
    
    // Set stepErrors 
    for (let i = 0; i < STEPS; i++) {
      fields.push("stepErrors" + SEPARATOR + i);
    }
    
    // Set ShortMemoryTest
    for (let i = 0; i < this.shortMemMaxExercises; i++) {
      let prefix = "shortMemoryTest" + SEPARATOR + i + SEPARATOR;
      // Static exercise fields
      fields.push(prefix + "totalExerciseTime");
      fields.push(prefix + "totalIncorrectMoves");
      fields.push(prefix + "totalMoves");
      
      prefix = prefix + "steps" + SEPARATOR;
      for (let j = 0; j < STEPS; j++) {
        fields.push(prefix + j + SEPARATOR + "elapsedTime");
        fields.push(prefix + j + SEPARATOR + "incorrectMoves");
      }

    }
    
    // Set LongMemoryTest 
    for (let i = 0; i < this.longMemMaxExercises; i++) {
      let prefix = "longMemoryTest" + SEPARATOR + i + SEPARATOR;
      // Static exercise fields
      fields.push(prefix + "totalExerciseTime");
      fields.push(prefix + "totalIncorrectMoves");
      fields.push(prefix + "totalMoves");
      
      prefix = prefix + "steps" + SEPARATOR;
      for (let j = 0; j < STEPS; j++) {
        fields.push(prefix + j + SEPARATOR + "elapsedTime");
        fields.push(prefix + j + SEPARATOR + "incorrectMoves");
      }

    }

    return fields;
  }
}
