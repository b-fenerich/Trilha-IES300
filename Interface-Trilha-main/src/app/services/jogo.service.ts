import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JogoService {

    constructor(private http: HttpClient) { }
  
    url = environment.apiURL
  
    token = localStorage.getItem('token');
    headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    })

    requisicao() {
        return this.http.get(this.url + '/');
    }
}  