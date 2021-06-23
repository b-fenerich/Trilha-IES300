import { EstatisticaService } from './../../services/estatistica.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-estatistica',
  templateUrl: './estatistica.component.html',
  styleUrls: ['./estatistica.component.scss']
})
export class EstatisticaComponent implements OnInit {
  user;
  userStats;

  rankings = [
    {
      position: 1,
      username: 'heroi-gladiador98'
    },
    {
      position: 2,
      username: 'zombieHunter'
    }, 
    {
      position: 3,
      username: 'chumbo_pesadoxXx'
    }, 
    {
      position: 4,
      username: 'LoLzerO'
    }, 
    {
      position: 5,
      username: '4fun_guy'
    }, 
    {
      position: 6,
      username: 'DrinqueDeLagrimas'
    },
    {
      position: 7,
      username: 'Harbor'
    },
    {
      position: 8,
      username: 'DrinqueDeLagrimas2'
    }, 
    {
      position: 9,
      username: '0_lol'
    }, 
    {
      position: 10,
      username: 'lunatic'
    }, 
    {
      position: 11,
      username: 'redX'
    }, 
    {
      position: 12,
      username: 'dieguito'
    }
  ]
  constructor(private estatisticaService: EstatisticaService) { 
    this.user = JSON.parse(localStorage.getItem('userInfo'));
  }


  ngOnInit(): void {
    this.getUserStats();

    // console.log(this.estatisticaService.getUserStatistics(1))
  }

  getUserStats() {
    
    this.estatisticaService.getUserStatistics(this.user.id).subscribe(resp => {
      console.log("resp", resp);
      this.userStats = resp;
    })
  }

}
