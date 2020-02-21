import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {
  constructor() {}

  MAX_NUMBER = [...Array(100)].map((v, k) => k + 1);

  type: string;
  show = false;
  cardNumber = 1;
  showChart = false;
  user: string;

  ngOnInit() {
    this.type = 'download';
    this.cardNumber = 20;
    this.user = 'client'
  }

  register() {
    this.show = false;
    setTimeout(() => {
      this.show = true;
    }, 100);
  }
}
