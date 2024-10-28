import { Object } from "../object.js";
import { checkCanvasCollision } from "../../utils/collision.js";

export class Asteroid{
    constructor(ctx, spritesheet, canvas, position={x:0, y:0}, type=1){
        this.ctx =  ctx;
        this.spritesheet = spritesheet;
        this.canvas = canvas;
        this.position = {...position};
        this.rotation = 0;
        this.death = false;
        this.image = new Object();
        this.type = type;
        this.scale = Math.random() * (0.8 - 0.4) + 0.4;
        this.speed = Math.random() * (1 - 0.5) + 2;
        if(this.type === 3){
            this.scale = Math.random() * (0.3 - 0.2) + 0.2;
            this.speed = Math.random() * (2 - 1) + 2;
        }
        this.angle = (Math.random() * (360)) * Math.PI/180;
        this.createAsteroid();
    }

    createAsteroid(){
        let num = Math.floor(Math.random() * (4)) + 1;
	
        switch (num) {
            case 1:
                this.image = new Object(this.spritesheet, {x:0, y:621}, 215, 211, this.scale);
                break;
            case 2:
                this.image = new Object(this.spritesheet, {x: 214, y:832}, 212, 218, this.scale);
                break;
            case 3:
                this.image = new Object(this.spritesheet,  {x: 0, y:832}, 214, 227,  this.scale);
                break;
            case 4:
                this.image = new Object(this.spritesheet,  {x: 0, y:400}, 220, 221,  this.scale);
                break;
        }
    }

    generatePosition(canvas){
        let num = Math.floor(Math.random() * (4)) + 1;
        let x, y;

        switch (num) {
            case 1:
                x = Math.random() * canvas.width;
                y = -this.image.height;
                break;
            case 2:
                x = canvas.width + this.image.width;
                y = Math.random() * canvas.height;
                break;
            case 3:
                x = -this.image.width;
                y = Math.random() * canvas.height;
                break;
            case 4:
                x = Math.random() * canvas.width;
                y = canvas.height+this.image.height;
                break;
        }
        this.position = {x:x, y:y};
    }

    collision() {
        return checkCanvasCollision(this, canvas);
    }

    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,  this.position.y);
        this.ctx.rotate(this.rotation);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.image.draw(this.ctx, this.position);

        this.ctx.restore();
    }

    update(boolean){
        this.draw();
        if(boolean){
            this.hitBox();
        }
        this.position.x += Math.cos(this.angle)* this.speed;
        this.position.y += Math.sin(this.angle)* this.speed;
        this.rotation += 0.015;
        this.collision()
    }
}