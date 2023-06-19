import { Component, Input, OnInit } from '@angular/core';
import { BoardService } from '../board/board.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements OnInit {
  @Input() ball: any;
  public coordinateX = 250;
  public coordinateY = 250;
  constructor(private boardService: BoardService) {
    this.boardService.ballMovment$
      .pipe(takeUntil(this.boardService.gameStop))
      .subscribe((val) => {
        this.coordinateX = val.posX;
        this.coordinateY = val.posY;
      });
  }

  ngOnInit(): void {}
}
