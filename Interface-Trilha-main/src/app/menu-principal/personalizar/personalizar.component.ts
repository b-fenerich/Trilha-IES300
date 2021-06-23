import { PersonalizarService } from './../../services/personalizar.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personalizar',
  templateUrl: './personalizar.component.html',
  styleUrls: ['./personalizar.component.scss']
})
export class PersonalizarComponent implements OnInit {
  user;
  pieces = [
    {
      name: "1",
      urlImg: "src/assets/image.png",
      equipped: true,
      userOwns: true
    },
    {
      name: "2",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: true
    },
    {
      name: "3",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "4",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    }
    ,
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    },
    {
      name: "5",
      urlImg: "src/assets/image.png",
      equipped: false,
      userOwns: false
    }
  ]
  constructor(private personalizarService: PersonalizarService, public router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.user);
    this.personalizarService.listItems(this.user.id).subscribe((resp: any) => {
      console.log(resp);
      this.pieces = resp;
    });
  }

  equipPiece(i) {
    console.log(i);
    this.personalizarService.updateItems(i.id, this.user.id).subscribe(resp => {
      console.log("ok! ~", resp)
    })
    // this.pieces.forEach(piece => {
    //   piece.equipped = false;
    // });
    // console.log(i.equipped);
    // i.equipped = true;
  }

}
