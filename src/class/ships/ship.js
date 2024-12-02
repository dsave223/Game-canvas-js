import { Object } from "../object.js";
import { Projectile } from "../objectSpace/projectile.js";

export class Ship{
    constructor(ctx, spritesheet, canvas){
        this.ctx = ctx;
        this.spritesheet = spritesheet
        this.image = new Object(spritesheet,{x:442, y:193}, 126, 107, 0.4);
        this.canvas = canvas;
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
        this.imageEff = new Object(spritesheet, {x:1113, y:458},  16, 126, 0.4);
        this.lastShotTime = 0;
        this.shotCooldown = 250;
        this.projectileWorker = new Worker('./src/utils/workers/ship/projectileWorker.js');
        this.isGameActive = false;
        this.reset();
        this.keyboard();
        this.initAudio();
        this.setupProjectileWorker();
    }

    reset(){
        this.position = { x: 450, y: 290 };
        this.speed = 0;
        this.projectiles = [];
        this.keys = {
            A:false,
            D:false,
            W:false,
            shoot:true
        }
        this.angle = 0;
    }

    draw(){
        this.ctx.save();

        this.ctx.translate(this.position.x,  this.position.y);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.position.x, -this.position.y)
        this.image.draw(this.ctx, this.position);

        if(this.keys.W){
            this.imageEff.draw(this.ctx, {x: this.position.x-12, y:this.position.y+40})
            this.imageEff.draw(this.ctx, {x: this.position.x+12, y:this.position.y+40})
        }

        this.ctx.restore();
    }

    collisionCanvas(){
        if(this.position.x - this.image.radio > this.canvas.width){
            this.position.x = 0;
        }
        if(this.position.x + this.image.radio < 0){
            this.position.x = this.canvas.width;
        }
    
        if(this.position.y - this.image.radio > this.canvas.height){
            this.position.y = 0;
        }
        if(this.position.y + this.image.radio < 0){
            this.position.y = this.canvas.height;
        }
    }

    move(){
        if (this.keys.D){
            this.angle+=0.06;
        }
        if (this.keys.A){
            this.angle-=0.06;
        }
        if (this.keys.W){
            this.speed+=0.09;
            if (this.speed >= 4.5){
                this.speed = 4.5;
            }
        }else{
            this.speed-=0.06;
            if (this.speed <= 0){
                this.speed = 0;
            }
        }

        this.position.x += Math.cos(this.angle-Math.PI/2)  * this.speed;
        this.position.y += Math.sin(this.angle -Math.PI/2)  * this.speed;
    }

    hitBox(){
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    update(boolean){
        this.updateProjectile(boolean);
        this.draw();
        if(boolean){
            this.hitBox();
        }
        this.move();
        this.collisionCanvas();
    
    }

    updateProjectile(boolean){
        this.projectiles.forEach((projectile, i)=>{
            projectile.update(boolean);
            if(projectile.collision(this.canvas)){
                setTimeout(() => {
                    this.projectiles.splice(i, 1);
                },0);
            }
        });
    }

    setupProjectileWorker() {
        this.projectileWorker.onmessage = (e) => {
            const projectileData = e.data;
            projectileData.forEach(data => {
                this.projectiles.push(
                    new Projectile(
                        this.ctx,
                        this.spritesheet,
                        { x: data.x, y: data.y },
                        data.angle
                    )
                );
            });
        };
    }

    keyboard(){
        document.addEventListener('keydown', (e)=>{
            if (e.key ===  'a'  || e.key === 'A'){
                this.keys.A = true;
            }
            if (e.key ===  'd'  || e.key === 'D'){
                this.keys.D = true;
            }
            if (e.key ===  'w'  || e.key === 'W'){
                this.keys.W = true;
            }

            if(e.key === 'g' || e.key === 'G'){
                const currentTime = Date.now();
                if(this.keys.shoot && currentTime - this.lastShotTime >= this.shotCooldown && this.isGameActive){
                    this.playShootSound();
                    this.projectileWorker.postMessage({
                        position: this.position,
                        angle: this.angle,
                        timestamp: currentTime
                    });
                    
                    this.lastShotTime = currentTime;
                    this.keys.shoot = false;
                }
            }

        });
        document.addEventListener('keyup', (e)=>{
            if (!this.isGameActive) return;
            
            if (e.key ===  'a'  || e.key === 'A'){
                this.keys.A = false;
            }
            if (e.key ===  'd'  || e.key === 'D'){
                this.keys.D = false;
            }
            if (e.key ===  'w'  || e.key === 'W'){
                this.keys.W = false;
            }

            if(e.key === 'g' || e.key === 'G'){
                this.keys.shoot = true;
            }
        });
    }

    initAudio() {
        this.shootSound = new Audio();
        this.shootSound.src = './src/assets/musica/biogun.mp3';
        this.shootSound.volume = 0.3;

        this.explosionSound = new Audio();
        this.explosionSound.src = './src/assets/musica/explosion.wav';
        this.explosionSound.volume = 0.4;
    }

    playShootSound() {
        if (!this.shootSound) return;
        
        try {
            const soundClone = this.shootSound.cloneNode();
            if (soundClone) {
                soundClone.volume = 0.3;
                soundClone.play().catch(error => {
                    console.error('Error al reproducir el sonido:', error);
                });
            }
        } catch (error) {
            console.error('Error al reproducir el sonido:', error);
        }
    }

    playExplosionSound() {
        if (!this.explosionSound) return;
        
        try {
            const soundClone = this.explosionSound.cloneNode();
            if (soundClone) {
                soundClone.volume = this.explosionSound.volume;
                soundClone.play().catch(error => {
                    console.error('Error al reproducir el sonido de explosión:', error);
                });
            }
        } catch (error) {
            console.error('Error al reproducir el sonido de explosión:', error);
        }
    }

    setGameActive(status) {
        this.isGameActive = status;
    }

    updateProjectile(boolean){
        for(let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(boolean);
            
            if(projectile.collision(this.canvas)){
                this.projectiles.splice(i, 1);
            }
        }
    }
}