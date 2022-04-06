import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient
  ) { }

  isLoggedIn(): boolean {
    var token = localStorage.getItem('SESSIONID');
    if (token) return true
    return false
  }
  delToken() {
    localStorage.removeItem('SESSIONID');
  }
  
  /*            REQUESTS            */
  private _apiURL = `http://${window.location.hostname}:4242/api/`
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  /* GET Requests */
  getInfo() {
    var url = this._apiURL + 'user';
    return this.http.get(url).pipe(
      tap(_ => console.log("Get User Info")),
      catchError(this.errorHandler<any[]>(`GET logged in user info`))
    )
  }

  logIn(data: Object) {
    var url = this._apiURL + 'login';
    return this.http.post(url, data).pipe(
      tap(_ => console.log("Sent of Login Form")),
      catchError(this.errorHandler<any[]>(`POST a login`))
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
