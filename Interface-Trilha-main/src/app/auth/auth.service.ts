// *****
// SERVICE APENAS DE AUTENTICAÇÃO
// *****
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CanActivate, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userInfo;

  constructor(private http: HttpClient, private router: Router) { 
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }


  url = environment.apiURL;

  public currentUser: Observable<any>

  public isAuthenticated(): boolean {
    if(localStorage.getItem('userInfo') == null) {
      return false
    } else {return true};
    // !this.jwtHelper.isTokenExpired(token);
  }

  loginUsuario(user): Observable<any> {
    let credential = {
      password: user.value.password,
      username: user.value.username
    }

    return this.http.post<any>(this.url + '/login', credential)
  }
  
  _userActionOccured: Subject<void> = new Subject();
  get userActionOccured(): Observable<void> { return this._userActionOccured.asObservable() };

  notifyUserAction() {
    this._userActionOccured.next();
  }



  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }


}
