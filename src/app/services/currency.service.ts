import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http: HttpClient) { }

  // Http Header
  httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getCountryList() {
    return this.http.get('assets/data/data.json').pipe(
      retry(1),
      catchError(this.errorHandl)
    );

  }

  getCurrencyData(data){
    return this.http.get(`https://api.exchangeratesapi.io/latest?base=${data}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  compareCurrency(data) {
      // tslint:disable-next-line: max-line-length
      const url = `http://api.currencylayer.com/live?access_key=4f6b9feaad974f5810f5442990461e1d&currencies=${data['from'].currency_code},${data['to'].currency_code}&format=1`;
      return this.http.get(url).pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  currencyOverPeriod(period) {
    console.log('AAAAAA', period);
    // tslint:disable-next-line: no-string-literal
    // tslint:disable-next-line: max-line-length
    const url = `https://free.currconv.com/api/v7/convert?apiKey=0d7d4ccb4584e81514bc&q=${period['from']['currency_code']}_${period['to']['currency_code']}&compact=ultra&date=${period['startDate']}&endDate=${period['endDate']}`;
    return this.http.get(url).pipe(
      retry(1),
      catchError(this.errorHandl)
    );

  }
  // Error handling
  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      alert(errorMessage);
    }
    console.log(errorMessage);
    return throwError(errorMessage);
 }

}
