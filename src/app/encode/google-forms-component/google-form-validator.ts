import { FormControl, ValidationErrors } from "@angular/forms";
import { Observable, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { EncodeUserService } from "../services/EncodeUserService";

export class GoogleFormValidator {
  
    static googleFormResponse(userService: EncodeUserService){
      
      return (control: FormControl): Observable<ValidationErrors | null>  => {
  
        const actualResponseURL: string = control.value.preFilledURL;
    
        return userService.googleForms$.pipe(
          switchMap(arr => { 
            arr = arr.filter(resp => (resp.preFilledURL == actualResponseURL) && resp.isResponded );
    
            if (arr.length > 0){
              return of(null);
            }
    
            return of({'error': 'error'});
          }), 
          catchError(() => of({'error': 'error'}))
          );
      }
    }
  }