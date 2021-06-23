import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstatisticaService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL;

  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  })

  getUserStatistics(user) {

    return this.http.get<any>(this.url + '/estatistica/' + user)
  }

}
