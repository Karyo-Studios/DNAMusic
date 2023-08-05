export class Blob {
    constructor({
        x = 400,
        y = 400,
        color = 0xff0000,
      }) {
        this.x = x
        this.y = y
        this.color = color
        this.radius = 30
        this.growing = true
      }

    update = () => {
        this.y = this.y - 1
    }

    // render = () => {
    //   g.clear();
    //   g.beginFill(this.color);
    //   g.drawCircle(this.x, this.y, this.radius);
    //   g.endFill();
    // }
}