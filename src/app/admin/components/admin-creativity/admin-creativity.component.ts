import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CreativityTestsDataSource } from 'src/app/core/models/creativityTestsDataSource';
import { tap } from 'rxjs/operators';
import { CreativeUser } from 'src/app/core/models/creative-user.interface';
import { CreativityFirestoreService } from 'src/app/core/creativityFirestore.service';

@Component({
  selector: 'app-admin-creativity',
  templateUrl: './admin-creativity.component.html',
  styleUrls: ['../admin.component.scss'],
})
export class AdminCreativityComponent implements AfterViewInit, OnInit {

  public testsDataSource: CreativityTestsDataSource;

  public creativesUsers: CreativeUser[] = [];
  public count = 1;
  public end = false;
  public totalTestsCounter: any = { count: -1 };

  // Columnas de la tabla que se van a mostrar
  displayedColumns: string[] = ["nameLastName", "age", "city", "educationLevel", "educationStatus", "school", "degree",
                                  "year", "grade", "course" , "object", "proposal", "dateStart", "dateEnd" ];

  pageSize: number = 10;
  pageIndex: number = 0;
  
  // Referencia a la tabla de usuarios
  @ViewChild(MatTable) table: MatTable<CreativeUser>;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _creativityFirestoreService: CreativityFirestoreService) 
  { 
  }

  //al iniciar esta sección, se obtienen todos los datos de la colección 'creativesUsers'
  async ngOnInit(): Promise<void> {
    
    this.testsDataSource = new CreativityTestsDataSource(this._creativityFirestoreService);
    this.testsDataSource.loadTests(this.pageSize);

    // Get total number of users
    const counter = await this._creativityFirestoreService.getCreativityMetadataCounter();
    this.totalTestsCounter.count = counter.data().count;
  }

  ngAfterViewInit() {
    this.paginator.page
        .pipe(
            tap(() => {
              this.paginator._nextButtonsDisabled()
              this.paginator._previousButtonsDisabled()
              this._loadTestsPage()
            })
        )
        .subscribe();
  }
  
  private _loadTestsPage() {
    if (this.pageIndex < this.paginator.pageIndex){
      this.testsDataSource.loadNextTestsPage(this.pageSize);
      this.pageIndex = this.paginator.pageIndex;
      return
    }

    this.testsDataSource.loadPrevTestsPage(this.pageSize);
    this.pageIndex = this.paginator.pageIndex;
  }

  public getData() {
    // let data = this.dbData.getCreativesUsersData(this);
    // return data;
  }

  downloadFile(data: any) {
    let csvData = this.ConvertToCSV(data, ['nameLastName','age', 'city', 'educationLevel', 'educationStatus', 
    'school', 'degree', 'year', 'grade', 'course', 'object', 'proposal', 'dateStart', 'dateEnd']);
     
      let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
      let dwldLink = document.createElement("a");
      let url = URL.createObjectURL(blob);
      let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
      
      if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
          dwldLink.setAttribute("target", "_blank");
      }
    
      dwldLink.setAttribute("href", url);
      dwldLink.setAttribute("download", "dataUsersCreatives" + ".csv");
      dwldLink.style.visibility = "hidden";
      document.body.appendChild(dwldLink);
      dwldLink.click();
      document.body.removeChild(dwldLink);
  }
    
    ConvertToCSV(objArray : any, headerList : any) {
     
      
      objArray.forEach(data => {
        data.dateStart = data.dateStart.toDate();
        data.dateEnd = data.dateEnd.toDate();
      });
      
       let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
       let str = '';
       let row = 'S.No,';
    
        for (let index in headerList) {
           row += headerList[index] + ',';
       }
    
       row = row.slice(0, -1);
       str += row + '\r\n';
    
       for (let i = 0; i < array.length; i++) {
           let line = (i+1)+'';
           for (let index in headerList) {
              let head = headerList[index];
               line += ',' + array[i][head];
           }    
           str += line + '\r\n';
       }
       return str;
    }
 

  

}
