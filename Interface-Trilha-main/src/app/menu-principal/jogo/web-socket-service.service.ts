import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'
import { JogoComponent } from './jogo.component';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Game } from 'phaser';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  webSocketEndPoint: string = 'http://localhost:8080/gameplay';
  topic: string = "/topic/game-progress/";
  stompClient: any;
  jogoComponent: JogoComponent;
  gameId: any;
  turno: number;

	validMove: boolean;
	lastMove: String;
	lastMoveTrinca: boolean;

  constructor(private http: HttpClient, jogoComponent: JogoComponent) {
    this.jogoComponent =jogoComponent;
   }

  _connect(gameId) {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
        _this.stompClient.subscribe(_this.topic +_this.gameId, function (response: any) {
            _this.onMessageReceived(response);
        });
        //_this.stompClient.reconnect_delay = 2000;
    });
  };

  create_game(nickname) {
    this.http.post<any>("http://localhost:8080/game/start", { "player": {"nickname" : nickname}, "privacy":"true" }).subscribe(response=> {
  
      console.log(response.body);
      this.gameId = response.gameId;
      this.jogoComponent.gameId =  response.gameId;
      alert('Seu game id é: ' + this.gameId);
      (document.getElementById('game_id') as HTMLInputElement).value = this.gameId;
      this._connect(this.gameId);
    });   
    

    this.turno = 0;
  }

  connectToEspecifGame(nickname, gameId) {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
        _this.stompClient.subscribe(_this.topic +_this.gameId, function (response: any) {
            _this.onMessageReceived(response);
        });
    });
    this.http.post<any>("http://localhost:8080/game/connect", { "player": {"nickname" : nickname},  "gameId":gameId }).subscribe(response=> {
      this.gameId = response.gameId;
      this.jogoComponent.gameId = response.gameId;
      console.log(response);
      this.jogoComponent.renderBoard(response.board, 0,0);
    });
    this.turno = 0;
  }

  _disconnect() {
    if (this.stompClient !== null) {
        this.stompClient.disconnect();
    }
    console.log("Disconnected");
}

// on error, schedule a reconnection attempt
/*errorCallBack(error: string) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
        this._connect();
    }, 5000);
}*/

/**
* Send message to sever via web socket
* @param {*} message 
*/
  _send(message: string) {
      console.log("calling logout api via web socket");
      this.stompClient.send("/app/gameplay", {}, JSON.stringify(message));
  }

  onMessageReceived(message: any) {
    const response = JSON.parse(message.body)
    this.jogoComponent.renderBoard(response.board, response.player1.pecasPosicionadas, response.player2.pecasPosicionadas);
    
    this.lastMoveTrinca = response.lastMoveTrinca;
    this.validMove = response.validMove;
    this.lastMove = response.lastMove;

    console.log(this.lastMoveTrinca);
    console.log(this.validMove);
    console.log(this.lastMove);

    if(this.checkTurno() == 0) {
      (document.getElementById('turn') as HTMLElement).innerHTML = 'Vez de Player 1'
    }
    if(this.checkTurno() == 1) {
      (document.getElementById('turn') as HTMLElement).innerHTML = 'Vez de Player 2'
    }
    let player;
    if(this.lastMove == 'PLAYER_1') player = 0;
    else player = 1;

    if(this.lastMoveTrinca && (player == this.jogoComponent.playerType)) {
      alert('Remova uma peça');
      this.jogoComponent.removePeca = true;
    } else {
      this.jogoComponent.removePeca = false;
    }

    if(response.player2.pecasVivas < 3 && response.gameStatus != '' && !(response.player2.pecasPosicionadas < 9)) {
      alert('Player 1 Venceu');
      this.gameId = null;
    } else if (response.player1.pecasVivas < 3 && !(response.player2.pecasPosicionadas < 9)) {
      alert('Player 2 Venceu');
      this.gameId = null;
    }
  }

 
    makeAMove(XCoord, YCoord, XCoordAnt, YCoordAnt, type, gameId){
    console.log(gameId);
    console.log(this.turno)
    if(this.checkTurno() == type) {
      this.http.post<any>("http://localhost:8080/game/gameplay", { 
        "type": type,
        "coordinateXAnt" :XCoordAnt,
        "coordinateYAnt":YCoordAnt,
        "coordinateX":XCoord,
        "coordinateY":YCoord,
        "gameId" : gameId
      }).subscribe(response=> {
        this.handleResponse(response);
      });
    } else {
      alert('Não é sua Vez');
    }
  }

  handleResponse(response) {
    //console.log(response)
  }


  checkTurno() : number {
    if(!this.lastMove) return 0;
    if(this.lastMove == 'PLAYER_1') {
      if(this.validMove && !this.lastMoveTrinca) return 1;
      if(this.validMove && this.lastMoveTrinca) return 0;
      if(!this.validMove) return 1;
    } else {
      if(this.validMove && !this.lastMoveTrinca) return 0;
      if(this.validMove && this.lastMoveTrinca) return 1;
      if(!this.validMove) return 0;
    }
    return null;
  }
}
