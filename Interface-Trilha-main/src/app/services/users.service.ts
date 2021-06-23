import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  url = environment.apiURL

  token = localStorage.getItem('token');
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.token
  })

  constructor(private http: HttpClient) { }

  signupUsuario(user): Observable<any> {

    let credential = {
      username: user.value.user,
      password: user.value.password,
      email: user.value.email,
    }

    return this.http.post<any>(this.url + '/cadastro', credential)

  }


}
