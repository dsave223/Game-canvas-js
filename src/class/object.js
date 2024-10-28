export class Object{
    constructor(spritesheet, paddlePosition, paddleWidth, paddleHeight, scale, angle){
        this.spritesheet = spritesheet;
        this.paddlePosition = paddlePosition
        this.paddleWidth = paddleWidth;
        this.paddleHeight = paddleHeight;
        this.scale = scale;
        this.angle = 0;

        this.width = this.paddleWidth *  this.scale;
        this.height = this.paddleHeight *  this.scale;

        this.radio = this.width/2;

    }

    setAngle(){
        this.angle = degrees * Math.PI/180;
    }

    draw(ctx, position){
        ctx.drawImage(
            this.spritesheet,
            this.paddlePosition.x,
            this.paddlePosition.y,
            this.paddleWidth,
            this.paddleHeight,
            position.x -  this.width / 2,
            position.y  -  this.height / 2,
            this.width,
            this.height
        )
    }
}