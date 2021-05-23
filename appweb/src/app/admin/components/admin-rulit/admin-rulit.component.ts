import { Component } from '@angular/core';
import firebase from 'firebase';
import { Parser, transforms } from 'json2csv';
import { DataDbService } from 'src/app/core/services/db/data-db.service';

const SEPARATOR = "_";

@Component({
  selector: 'app-admin-rulit',
  templateUrl: './admin-rulit.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminRulitComponent{

  constructor( private dbData: DataDbService ) {}
  
  async getData() {
    let rulitUsers = await this.dbData.getAllRulitUsersData();
    console.log(rulitUsers.length);
    rulitUsers.map( (user) => { 
      if ( user.trainingDate )
        user.trainingDate = (user.trainingDate as firebase.firestore.Timestamp).toDate().toLocaleString("es-AR")
      if ( user.testDate )
        user.testDate = (user.testDate as firebase.firestore.Timestamp).toDate().toLocaleString("es-AR");
    });
    
    // CSV
    const flatOptions = transforms.flatten({ objects: true, arrays: true, separator: SEPARATOR });
    let fields = this.getFields();
    const json2csvParser = new Parser({ fields: fields, transforms: [ flatOptions ] });
    const csv = json2csvParser.parse(rulitUsers);
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }

  // Returns the column names of the csv in the correct order
  getFields(): Array<string> {
    const STEPS = 15;
    const MAX_EXERCISES = 10;
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
    for (let i = 0; i < MAX_EXERCISES; i++) {
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
    for (let i = 0; i < MAX_EXERCISES - 1 ; i++) {
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
