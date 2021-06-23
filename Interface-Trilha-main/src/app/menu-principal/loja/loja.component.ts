import { LojaService } from './../../services/loja.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loja',
  templateUrl: './loja.component.html',
  styleUrls: ['./loja.component.scss']
})
export class LojaComponent implements OnInit {
  user;
  pieces = [];
  constructor(private lojaService: LojaService) { 
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.listarItems();
  }

  listarItems() {
    this.lojaService.listItem().subscribe(resp => {
      console.log(resp);
      this.pieces = resp;
    })
  }

  buyPiece(i) {
    console.log(i);
    this.lojaService.buyItem(this.user.id, i.id).subscribe(resp => {
      console.log("ok! ~", resp)
    })
    // this.pieces.forEach(piece => {
    //   piece.equipped = false;
    // });
    // console.log(i.equipped);
    // i.equipped = true;
  }

}
