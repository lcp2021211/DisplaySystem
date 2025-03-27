import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  constructor() {}

  MAX_NUMBER = [...Array(10)].map((v, k) => (k + 1) * 10);

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
