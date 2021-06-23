import { Component, OnInit } from '@angular/core';
import * as Phaser from 'phaser';


@Component({
  selector: 'app-cena',
  templateUrl: './cena.component.html',
  styleUrls: ['./cena.component.scss']
})
export class CenaComponent implements OnInit {
   phaserGame: Phaser.Game;
   config: Phaser.Types.Core.GameConfig;


  constructor() { 
     this.config = {
       type: Phaser.AUTO,
       height: 600,
       width: 800,
       scene: [ MainScene ],
       parent: 'gameContainer',
       physics: {
         default: 'arcade',
         arcade: {
           gravity: { y: 100 }
         }
       }
     };

  }

  ngOnInit(): void {
     this.phaserGame = new Phaser.Game(this.config);

  }

}

 class MainScene extends Phaser.Scene {
   constructor() {
     super({ key: 'main' });
   }
   create() {
     this.add.image(400, 300, 'board');
   }
   preload() {
     this.load.image('board', '../../../../assets/board.svg');
   }
   update() {
     // console.log('update method');
   }
 }

