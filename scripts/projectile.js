import { Object } from "./object.js";

export class Projectile{
    constructor(ctx, spritesheet, position, angle){
        this.ctx =ctx;
        this.image = new Object(spritesheet, {x: 505, y: 299}, 16, 22, 0.7);
        this.imageEff =  new Object(spritesheet, {x: 1113, y: 927}, 12,  126, 0.5);
        this.position = position;
        this.angle = angle;
        this.speed = 12;
    }
    
    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,  this.position.y);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.position.x, -this.position.y)
        this.image.draw(this.ctx, this.position);
        this.imageEff.draw(this.ctx, {x:this.position.x, y:this.position.y+25})

        this.ctx.restore();
    }

    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    collision(canvas){
        if(this.position.x - this.image.radio > canvas.width || 
            this.position.x + this.image.radio < 0 ||
            this.position.y - this.image.radio > canvas.height ||
            this.position.y + this.image.radio < 0
        ){
            return true;
        }
        return false;
    }

    update(boolean){
        this.draw();
        if(boolean){
            this.hitBox();
        }
        this.position.x += Math.cos(this.angle - Math.PI/2) * this.speed;
        this.position.y += Math.sin(this.angle - Math.PI/2) * this.speed;
    }
}