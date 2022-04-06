import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemPostService {

  constructor(
    private http: HttpClient
  ) { }

  private _apiURL = `http://${window.location.hostname}:4242/api/`
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  addEntry(data: any) {
    var url = this._apiURL + 'workout-diary';
    return this.http.post(url, data).pipe(
      tap(_ => console.log("Sent of Workout Entry")),
      catchError(this.errorHandler<any[]>(`POST a workout entry`))
    )
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
   errorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      //this.log(`${operation} failed: ${error.message}`);
      //Message Servic????
      return of(result as T);
    };
  }
}
