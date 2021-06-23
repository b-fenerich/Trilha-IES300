import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalizarService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL

  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  })

  listItems(userId) {
    let body = {
      id: userId
    }
    return this.http.post<any>(this.url + '/personalizar', body)

  }

  updateItems(idItem, userId) {
    let body = {
      id: idItem,
      userId: userId
    }
    
    return this.http.put<any>(this.url + '/personalizar', body)

  }
}
