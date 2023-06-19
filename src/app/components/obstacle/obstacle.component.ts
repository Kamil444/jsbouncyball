import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.scss'],
})
export class ObstacleComponent implements OnInit {
  @Input() obstacle: any;

  constructor() {}

  ngOnInit(): void {}

  public osbtacleColor() {
    if (this.obstacle.special) return { 'background-color': 'blue' };
    return { 'background-color': 'green' };
  }
}
