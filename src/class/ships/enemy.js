import { Object } from "../object.js";
import { Projectile } from "../../class/objectSpace/projectile.js";

export class Enemy{
    constructor(ctx, spritesheet, canvas, ship, position = {x:0, y:0}){
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        this.image = new Object(spritesheet, {x:662, y:-1}, 94, 148, 0.4);
        this.canvas = canvas;
        this.ship = ship;
        this.position = position;
        this.imagePart = new Object(spritesheet, {x:998, y:273}, 36, 76, 0.52);
        this.speed = 1;
        this.death = false;
        this.lastShotTime = 0;
        this.shootCooldown = 3000;

        this.projectileWorker = new Worker('./src/class/ships/workers/enemy/projectileWorker.js');
        this.trackingWorker = new Worker('./src/class/ships/workers/enemy/trackingWorker.js')
        this.setupProjectileWorker();
        this.setupTrackingWorker();
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

    collision(canvas){
        if((this.position.x - this.image.radio > canvas.width ||
            this.position.x + this.image.radio < 0 ||
            this.position.y - this.image.radio > canvas.height ||
            this.position.y + this.image.radio < 0) && this.death
        ){
            return true;
        }
        return false;
    }

    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    canShoot() {
        return Date.now() - this.lastShotTime > this.shootCooldown;
    }

    setupProjectileWorker() {
        this.projectileWorker.onmessage = (e) => {
            try {
                const projectileData = e.data;
                projectileData.forEach(data => {
                    const projectile = new Projectile(
                        this.ctx,
                        this.spritesheet,
                        { x: data.x, y: data.y },
                        data.angle,
                        true
                    );
                    projectile.speed = 3;
                    this.projectilesEnemys.push(projectile);
                });
            } catch (error) {
                console.error('Error al crear proyectiles del enemigo:', error);
            }
        };

        this.projectileWorker.onerror = (error) => {
            console.error('Error en el worker de proyectiles enemigos:', error);
        };
    }

    createProjectile(projectilesEnemys) {
        if (!this.projectileWorker) return;
        
        this.projectilesEnemys = projectilesEnemys;
        
        this.projectileWorker.postMessage({
            position: this.position,
            angle: this.angle,
            timestamp: Date.now()
        });
    }

    setupTrackingWorker() {
        if (!this.trackingWorker) return;
    
        this.trackingWorker.onmessage = (e) => {
            try {
                if (e.data.error) {
                    console.error('Error en tracking worker:', e.data.error);
                    return;
                }
    
                const { angle, newPosition } = e.data;
                this.angle = angle;
                this.position = newPosition;
            } catch (error) {
                console.error('Error al procesar datos de seguimiento:', error);
            }
        };
    
        this.trackingWorker.onerror = (error) => {
            console.error('Error en el worker de seguimiento:', error.message);
        };
    }

    update(boolean) {
        this.draw();
        if(boolean) this.hitBox();
        
        // Usar el worker para el seguimiento
        if (this.trackingWorker && !this.death) {
            try {
                this.trackingWorker.postMessage({
                    enemyPosition: this.position,
                    shipPosition: this.ship.position
                });
            } catch (error) {
                console.error('Error al enviar datos al worker de seguimiento:', error);
            }
        }
    }

    destroy() {
        try {
            if (this.projectileWorker) {
                this.projectileWorker.terminate();
                this.projectileWorker = null;
            }
            if (this.trackingWorker) {
                this.trackingWorker.terminate();
                this.trackingWorker = null;
            }
        } catch (error) {
            console.error('Error al destruir workers:', error);
        }
    }
}
