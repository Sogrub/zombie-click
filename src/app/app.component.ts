import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IUpgrade, IZombie } from '../shared/interfaces/general.interfaces';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild('containerZombies') containerZombies!: ElementRef<HTMLElement>
  points: number = 200
  pointsExponent: number = 1
  zombiesExponent: number = 1

  clickedZombie: IZombie | undefined;

  zombies: IZombie[] = []
  upgrades: IUpgrade[] = [
    {
      imagen: 'assets/zombie2.png',
      increment: 2,
      text: 'Click',
      cost: 10,
      action: (upgrade: IUpgrade) => this.increment(upgrade)
    },
    {
      imagen: 'assets/turret.png',
      increment: 1,
      text: 'Buy',
      cost: 50,
      action: (upgrade: IUpgrade) => this.turret(upgrade)
    }
  ]

  turretsCount: any[] = []

  constructor() {}

  ngOnInit(): void {
    this.createZombies();

    setInterval(() => {
      this.zombies.forEach(zombie => {
        const dificulAument = 13 + (Math.log(this.zombiesExponent) * 10)
        for (let i = 0; i < dificulAument; i++) {
          setTimeout(() => {
            zombie.top += 1
          }, 10 * i);
        }
        if (zombie.top > this.containerZombies.nativeElement.clientHeight - 50) {
          this.lossClick(zombie)
        }
      })
    }, 100)

    setInterval(() => {
      for (let x = 0; x < this.turretsCount.length; x++) {
        setTimeout(() => {
          const random = Math.floor(Math.random() * this.zombies.length)
          this.click(this.zombies[random])
        }, 750 * x);
      }
    }, 3000)
  }

  createZombies() {
    this.zombies = []
    for (let i = 0; i < this.zombiesExponent; i++) {
      setTimeout(() => {
        this.createdZombie();
      }, 1000 * i);
    }
  }

  createdZombie() {
    const maxWidth = this.containerZombies.nativeElement.clientWidth;

    const position = {
      x: Math.floor(Math.random() * ((maxWidth - 170) - 100 + 1)) + 100,
      y: - 120
    };

   const newZombie: IZombie = {
    image: 'assets/zombie2.png',
    top: -120,
    left: position.x
   }

   this.zombies.push(newZombie)
  }

  zombieDifficulty() {
    if (this.points >= (this.zombiesExponent * (this.zombiesExponent * 100))) {
      this.zombiesExponent++;
      this.createZombies();
    }
  }

  lossClick(zombie: IZombie) {
    this.points -= this.pointsExponent;
    const index = this.zombies.indexOf(zombie);
    console.log('index', index)
    this.zombies.splice(index, 1);
    setTimeout(() => {
      this.createdZombie()
    }, 10);
  }

  click(zombie: IZombie) {
    this.points += this.pointsExponent;
    const index = this.zombies.indexOf(zombie);
    this.zombies.splice(index, 1);
    this.clickedZombie = zombie;
    setTimeout(() => {
      this.createdZombie()
      this.zombieDifficulty();
    }, 10);
    setTimeout(() => {
      this.clickedZombie = undefined
    }, 500);
  }

  // Upgrades

  increment(upgrade: IUpgrade) {
    const { cost, increment } = upgrade
    if (this.points >= cost) {
      this.pointsExponent = this.pointsExponent * increment
      this.points -= cost
      const index = this.upgrades.indexOf(upgrade)
      this.upgrades[index].cost = cost * this.pointsExponent
    }
  }

  turret(upgrade: IUpgrade) {
    const { cost, increment } = upgrade
    if (this.points >= cost) {
      this.turretsCount.push(cost)
      this.points -= cost
      const index = this.upgrades.indexOf(upgrade)
      this.upgrades[index].cost = cost * (this.turretsCount.length * 2)
    }
  }
}
