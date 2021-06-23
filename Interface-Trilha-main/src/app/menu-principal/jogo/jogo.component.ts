import { JogoService } from './../../services/jogo.service';
import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';
import Piece from './helpers/piece';
import Game from './helpers/game';
import Zone from './helpers/zone';
import io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {WebSocketServiceService} from './web-socket-service.service'
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.scss']
})
export class JogoComponent implements OnInit {
  @ViewChild('login') 
  inputLogin: ElementRef;
  @ViewChild('login') 
  inputGame: ElementRef;

  place00:any;
  gameId: any;
  nickname: any;
  XCoord:any;
  YCoord:any;
  XCoordAnt:any;
  YCoordAnt:any;
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;
  greeting: any;
  name!: string;
  webSocketService: WebSocketServiceService;
  playerType: number;
  turno: number;
  ///////////
  removePeca: boolean;

  constructor(private jogoService: JogoService, private http: HttpClient) {   }

  ngOnInit(): void {
    this.webSocketService = new WebSocketServiceService(this.http, this);
  }


  create_game(){

    this.webSocketService.create_game(this.nickname)
    this.playerType = 0;
    this.turno = 0;
    this.removePeca= false;

  }
  connectToEspecifGame() {
    this.webSocketService.connectToEspecifGame(this.nickname, this.gameId)
    this.playerType = 1;
    this.turno = 0;
    this.removePeca = false;
  }

  makeAMove(){
    console.log(this.gameId);
    this.webSocketService.makeAMove(this.XCoord, this.YCoord, this.XCoordAnt, this.YCoordAnt, this.playerType, this.gameId);
  }

  
  renderBoard(board, pecasPosicionadasPlayer1, pecasPosicionadasPlayer2) {
    for(let i = 0; i < 7; i++) {
      for(let j = 0; j < 7; j++) {
        if(board[i][j] == 'PLAYER_1') {
          (document.getElementById(i+'_'+j) as HTMLElement).style.background = "url('../../../assets/wood_piece.png') no-repeat";
          (document.getElementById(i+'_'+j) as HTMLElement).style.backgroundSize = "75px";
          (document.getElementById(i+'_'+j) as HTMLElement).style.backgroundPosition = "center";
          (document.getElementById(i+'_'+j) as HTMLElement).setAttribute('playerType', '0');
          (document.getElementById(i+'_'+j) as HTMLElement).classList.add('piecePlaced');

        } else if (board[i][j] == 'PLAYER_2') {
          (document.getElementById(i+'_'+j) as HTMLElement).style.background = "url('../../../assets/black_piece.png') no-repeat";
          (document.getElementById(i+'_'+j) as HTMLElement).style.backgroundSize = "75px";
          (document.getElementById(i+'_'+j) as HTMLElement).style.backgroundPosition = "center";
          (document.getElementById(i+'_'+j) as HTMLElement).setAttribute('playerType', '1');
          (document.getElementById(i+'_'+j) as HTMLElement).classList.add('piecePlaced');
        } else {
          (document.getElementById(i+'_'+j) as HTMLElement).style.background = "";
          (document.getElementById(i+'_'+j) as HTMLElement).className = 'tenant';
        }
      }
    }

    //Render light pieces
    for(let i =1; i <= 9; i++) {
      if(9 - pecasPosicionadasPlayer2 >= i) {
        (document.getElementById('dark' + i) as HTMLElement).style.background = "url('../../../assets/black_piece.png') no-repeat";
        (document.getElementById('dark' + i) as HTMLElement).style.backgroundSize = "49px";
      } else{
        (document.getElementById('dark' + i) as HTMLElement).style.background = "";
      }

    }

    //Render light pieces
    for(let i =1; i <= 9; i++) {
      if(9 - pecasPosicionadasPlayer1 >= i) {
        (document.getElementById('light' + i) as HTMLElement).style.background = "url('../../../assets/wood_piece.png') no-repeat";
        (document.getElementById('light' + i) as HTMLElement).style.backgroundSize = "49px";
      } else {
        (document.getElementById('light' + i) as HTMLElement).style.background = "";
      }
    }
  }

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {
      console.log(target);
      /*if(target.classList.contains('piece')) {
        this.XCoordAnt = target.getAttribute('x');
        this.YCoordAnt = target.getAttribute('y');
      } */
      if(!this.removePeca) {
        if(target.classList.contains('piecePlaced')) {
          if(target.getAttribute('playerType') == this.playerType.toString()){
            this.XCoordAnt = target.getAttribute('x');
            this.YCoordAnt = target.getAttribute('y');
          }
        }
        if(target.classList.contains('tenant') && !target.classList.contains('piecePlaced')) {
          this.XCoord = target.getAttribute('x');
          this.YCoord = target.getAttribute('y');
          this.webSocketService.makeAMove(this.XCoord, this.YCoord, this.XCoordAnt, this.YCoordAnt, this.playerType, this.gameId);
        }
      } else {
        if(target.getAttribute('playerType') != this.playerType.toString()){
          this.XCoord = target.getAttribute('x');
          this.YCoord = target.getAttribute('y');
          this.webSocketService.makeAMove(this.XCoord, this.YCoord, this.XCoordAnt, this.YCoordAnt, this.playerType, this.gameId);
        }
      }
 }
}
