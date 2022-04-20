import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemRetrievalService {

  constructor(
    private http: HttpClient
  ) { }

  private _apiURL = `http://${window.location.hostname}:${window.location.port}/api/`
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  /*        GET single        */
  getWorkout(id: string, field: string | null) :Observable<any> {
    var url = this._apiURL + `workout/${id}`;
    if (field) url += `/?field=${field}`;
    console.log(field)
    console.log(url)
    return this.http.get<any>(url).pipe(
      tap(_ => console.log(`Fetched Workout w/ ID: ${id}`)),
      catchError(this.errorHandler<any>(`get workout og if ${id}`))
    )
  }

  /*        GET all        */
  getAll(item: String, field: string) :Observable<any> | null {
    console.log(item)
    switch (item) {
      case 'exercise':
        return this.getAllExercise();
      case 'movement-pattern':
        return this.getAllMovementPattern(field);
      case 'workout':
        return this.getAllWorkout(field);
    }
    return null;//QUICK BAD FIX
    /*
    var url = this._apiURL + item
    return this.http.get(url).pipe(
      tap(_ => console.log("Fetched all " + item)),
      catchError(this.errorHandler(`get all ${item}`))
    )
    */
  }
  getAllWorkout(field: string = '') :Observable<any[]> {
    var url = this._apiURL + `workout/?field=${field}`;
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log("Fetched all Workouts")),
      catchError(this.errorHandler<any[]>(`get all workout`))
    )
  }
  getAllMovementPattern(field: string = '') :Observable<any[]> {
    var url = this._apiURL + `workout-child/?field=${field}`;
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log("Fetched all Movement Patterns")),
      catchError(this.errorHandler<any[]>(`get all movement patterns`))
    )
  }
  getAllExercise() :Observable<any[]> {
    console.log("Exer")
    var url = this._apiURL + 'exercises';
    return this.http.get<any[]>(url).pipe(
      tap(_ => console.log("Fetched all Exercise")),
      catchError(this.errorHandler<any[]>(`get all exercise`))
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
