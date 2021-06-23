import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { fadeStateTrigger } from '../animations/animation';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [fadeStateTrigger]
})
export class NavbarComponent implements OnInit {

  constructor(public location: Location, public router: Router) { }
  user;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.user)
  }

  logoutUser() {
    localStorage.removeItem('userInfo')
    this.router.navigate(['/login']);
  }

  isHomeRouteActivated(): boolean {
    return this.location.path().indexOf('/menu') > -1;
  }

  isLoginRouteActivated(): boolean {
    return this.location.path().indexOf('/login') > -1;
  }

  isCadastroRouteActivated(): boolean {
    return this.location.path().indexOf('/cadastro') > -1;
  }
}
