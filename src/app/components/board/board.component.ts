import { Component, OnInit } from '@angular/core';
import { BoardService } from './board.service';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  public boardHeight = this.boardService.boardDimensions.height[1];
  public boardWidth = this.boardService.boardDimensions.width[1];
  public obatacleArray = this.boardService.obstacles;
  public ballObject = this.boardService.ball;

  constructor(private boardService: BoardService) {
    this.boardService.obstacleArray$
      .pipe(takeUntil(this.boardService.gameStop))
      .subscribe((data) => {
        this.obatacleArray = data;
      });
  }

  ngOnInit(): void {}

  public test() {
    this.boardService.stoppper();
  }
}
