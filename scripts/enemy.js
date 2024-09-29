import { Object } from "./object.js";

export class Enemy{
    constructor(ctx, spritesheet, canvas, ship){
        this.ctx = ctx;
        this.image = new Object(spritesheet, {x:662, y:-1}, 94, 148, 0.4);
        this.canvas = canvas;
        this.ship = ship;
        this.position = {x:500 , y:200};
        this.imagePart = new Object(spritesheet, {x:998, y:273}, 36, 76, 0.52);
        this.speed = 1;
    }

    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,  this.position.y);
        this.ctx.rotate(this.angle + Math.PI/2);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.image.draw(this.ctx, this.position);
        this.imagePart.draw(this.ctx, {x:this.position.x+13, y:this.position.y+16});

        this.ctx.restore();

        this.ctx.save();

        this.ctx.translate(this.position.x,  this.position.y);
        this.ctx.rotate(this.angle + Math.PI/2);
        this.ctx.scale(-1,1);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.imagePart.draw(this.ctx, {x:this.position.x+13, y:this.position.y+16});

        this.ctx.restore();
    }

    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    createProyectile(){
        
        new Projectile(
            this.ctx,
            this.spritesheet,
            {x: this.position.x + Math.cos(this.angle) * 14,
                y: this.position.y + Math.sin(this.angle) * 14

            },
            this.angle
        )
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

    collision(){
        
    }

    update(boolean){
        this.draw();
        if(boolean) this.hitBox();
        let v1 ={
            x: this.ship.position.x - this.position.x,
            y: this.ship.position.y - this.position.y
        }
        let mag = Math.sqrt(v1.x*v1.x + v1.y*v1.y);
        let vU ={
            x:v1.x/mag,
            y:v1.y/mag
        }
        this.angle = Math.atan2(vU.y, vU.x);

        this.position.x += vU.x *  this.speed;

        this.position.y += vU.y *  this.speed;

    }
}