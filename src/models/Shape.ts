import { Position } from "../utils/positionUtils";

type Color = string | "red" | "blue" | "green";

export abstract class Shape {
  constructor(
    public id: string,
    public position: Position,
    public width: number,
    public height: number,
    public fill: Color = "black",
    public image: ImageBitmap | undefined = undefined
  ) {}

  fixAbsoluteDimensions() {
    if (this.width < 0) {
      this.position.x = this.position.x + this.width;
      this.width = Math.abs(this.width);
    }
    if (this.height < 0) {
      this.position.y = this.position.y + this.height;
      this.height = Math.abs(this.height);
    }
  }

  abstract isInside(position: Position): boolean;
}

export class Rectangle extends Shape {
  isInside(position: Position): boolean {
    const myPosition = this.position;
    return (
      position.x >= myPosition.x &&
      position.x <= myPosition.x + this.width &&
      position.y >= myPosition.y &&
      position.y <= myPosition.y + this.height
    );
  }
}

export class Line extends Shape {
  isInside(position: Position): boolean {
    const tolerance = 20;
    const start = this.position;
    const end = {
      x: this.position.x + this.width,
      y: this.position.y + this.height,
    };

    const distance =
      Math.abs(
        (position.y - end.y) * start.x -
          (position.x - end.x) * start.y +
          position.x * end.y -
          position.y * end.x
      ) /
      Math.sqrt(
        Math.pow(position.y - end.y, 2) + Math.pow(position.x - end.x, 2)
      );

    if (distance > tolerance) {
      return false;
    }

    const dotProduct =
      (position.x - start.x) * (end.x - start.x) +
      (position.y - start.y) * (end.y - start.y);
    if (dotProduct < 0) {
      return false;
    }

    const squaredLength =
      (end.x - start.x) * (end.x - start.x) +
      (end.y - start.y) * (end.y - start.y);
    if (dotProduct > squaredLength) {
      return false;
    }

    return true;
  }
}

export class Circle extends Shape {
  isInside(position: Position): boolean {
    const radius = this.getRadius();
    const { x, y } = this.getCenter();

    const dx = Math.abs(position.x - x);
    const dy = Math.abs(position.y - y);

    return dx * dx + dy * dy <= radius * radius;
  }

  getCenter(): Position {
    const radius = this.getRadius();
    const centerX = this.position.x + radius;
    const centerY = this.position.y + radius;
    return { x: centerX, y: centerY };
  }

  getRadius(): number {
    const radius = Math.abs(this.width / 2);
    return radius;
  }
}
