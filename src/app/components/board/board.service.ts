import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  interval,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  public gameStop: Subject<any> = new Subject();
  private gameTime$: Observable<number> = interval(5);
  private obstacleArraySubject: BehaviorSubject<any>;
  private ballMovmentSubject: BehaviorSubject<any>;
  public obstacleArray$: Observable<any>;
  public ballMovment$: Observable<any>;

  //Board object
  public boardDimensions = {
    width: [0, 500],
    height: [0, 500],
  };

  // Ball coordinates [x,y] on a board
  private ballPosition = {
    posX: 250,
    posY: 250,
  };
  // Angles of a direction vector
  private directionVector = {
    sinY: 0,
    cosX: 0,
  };
  //set of obstacles with special status that ball collided with
  private specialObstaclesCollidedWith: Set<string> = new Set('');

  private isThereCollision = false;

  // Array of obstacles objects on a board
  public obstacles = [
    { width: [0, 75], height: [0, 250], special: false },
    { width: [425, 500], height: [350, 500], special: false },
    { width: [150, 275], height: [100, 150], special: false },
    { width: [300, 350], height: [300, 350], special: true },
    { width: [375, 425], height: [125, 175], special: true },
    { width: [75, 125], height: [375, 425], special: true },
  ];
  //Ball object
  public ball = { width: 25, height: 25 };

  constructor() {
    this.ballMovmentSubject = new BehaviorSubject([this.ballPosition]);
    this.ballMovment$ = this.ballMovmentSubject.asObservable();
    this.obstacleArraySubject = new BehaviorSubject(this.obstacles);
    this.obstacleArray$ = this.obstacleArraySubject.asObservable();
    this.gameTime$.pipe(takeUntil(this.gameStop)).subscribe((data) => {
      this.ballMovmentFunction();
    });
    this.generateDirectonVector();
  }

  public stoppper() {
    this.gameStop.next(void 0);
  }

  private generateDirectonVector() {
    const angleInRadians = Math.random() * (Math.PI * 2);
    this.directionVector.sinY = Number(Math.cos(angleInRadians).toFixed(2));
    this.directionVector.cosX = Number(Math.sin(angleInRadians).toFixed(2));
  }

  private changeDirectionOnCollision() {
    return {
      xAxis: () => (this.directionVector.sinY = this.directionVector.sinY * -1),
      yAxis: () => (this.directionVector.cosX = this.directionVector.cosX * -1),
    };
  }

  private ballMovmentFunction() {
    this.borderCollisionDetection();
    this.obstacleCollisionDetection();
    this.changeObstacleStatus();
    this.ballPosition.posX += this.directionVector.sinY;
    this.ballPosition.posY += this.directionVector.cosX;
    this.ballMovmentSubject.next(this.ballPosition);
    this.obstacleArraySubject.next(this.obstacles);
  }

  private obstacleCollisionDetection() {
    for (const [index, element] of this.obstacles.entries()) {
      if (
        this.ballPosition.posX >= element.width[0] - this.ball.width &&
        this.ballPosition.posX <= element.width[1] &&
        this.ballPosition.posY >= element.height[0] - this.ball.height &&
        this.ballPosition.posY <= element.height[1]
      ) {
        this.isThereCollision = true;
        if (element.special === true) {
          this.collisionOnSpecial(index);
          break;
        } else {
          if (
            Math.abs(
              this.ballPosition.posX - element.width[0] + this.ball.width
            ) < 1 ||
            Math.abs(this.ballPosition.posX - element.width[1]) < 1
          ) {
            this.changeDirectionOnCollision().xAxis();
          }
          if (
            Math.abs(
              this.ballPosition.posY - element.height[0] + this.ball.height
            ) < 1 ||
            Math.abs(this.ballPosition.posY - element.height[1]) < 1
          ) {
            this.changeDirectionOnCollision().yAxis();
          }
        }
      } else {
        this.isThereCollision = false;
      }
    }
  }

  private borderCollisionDetection() {
    if (
      this.ballPosition.posX <= this.boardDimensions.width[0] ||
      this.ballPosition.posX >= this.boardDimensions.width[1] - this.ball.width
    ) {
      this.changeDirectionOnCollision().xAxis();
    }
    if (
      this.ballPosition.posY <= this.boardDimensions.height[0] ||
      this.ballPosition.posY >=
        this.boardDimensions.height[1] - this.ball.height
    ) {
      this.changeDirectionOnCollision().yAxis();
    }
  }

  private collisionOnSpecial(index: number) {
    const numberToString = index.toString();
    this.specialObstaclesCollidedWith.add(numberToString);
  }

  private changeObstacleStatus() {
    if (!this.isThereCollision) {
      const [element] = this.specialObstaclesCollidedWith;
      if (element) {
        const index = Number(element);
        this.obstacles[index].special = false;
        this.generateDirectonVector();
        this.specialObstaclesCollidedWith = new Set('');
      }
    }
  }
}
