import { Object } from "../object.js";
import { Projectile } from "../../class/objectSpace/projectile.js";

export class Enemy {
    constructor(ctx, spritesheet, canvas, ship, position = {x:0, y:0}) {
        // Propiedades de renderizado
        this.ctx = ctx;
        this.spritesheet = spritesheet;
        this.canvas = canvas;
        this.image = new Object(spritesheet, {x:662, y:-1}, 94, 148, 0.4);
        this.imagePart = new Object(spritesheet, {x:998, y:273}, 36, 76, 0.52);
        
        // Propiedades de estado
        this.position = position;
        this.death = false;
        this.isTracking = true;
        
        // Propiedades de movimiento
        this.baseSpeed = 1;
        this.maxSpeed = 2;
        this.currentSpeed = this.baseSpeed;
        this.acceleration = 0.01;
        this.ship = ship;
        
        // Inicialización de workers
        this.initializeWorkers();
    }

    // Métodos de inicialización
    initializeWorkers() {
        this.projectileWorker = new Worker('./src/utils/workers/enemy/projectileWorker.js');
        this.trackingWorker = new Worker('./src/utils/workers/enemy/trackingWorker.js');
        this.setupProjectileWorker();
        this.setupTrackingWorker();
    }

    setupProjectileWorker() {
        this.projectileWorker.onmessage = (e) => {
            const projectileData = e.data;
            projectileData.forEach(data => this.createProjectileInstance(data));
        };
    }

    setupTrackingWorker() {
        if (!this.trackingWorker) return;
        
        this.trackingWorker.onmessage = (e) => {
            const { angle, newPosition, currentSpeed } = e.data;
            if (this.isTracking && !this.death) {
                this.updatePosition(angle, newPosition, currentSpeed);
            }
        };
    }

    // Métodos de renderizado
    draw() {
        this.drawMainBody();
        this.drawParts();
    }

    drawMainBody() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle + Math.PI/2);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.image.draw(this.ctx, this.position);
        this.imagePart.draw(this.ctx, {x:this.position.x+13, y:this.position.y+16});
        this.ctx.restore();
    }

    drawParts() {
        this.ctx.save();
        this.ctx.translate(this.position.x, this.position.y);
        this.ctx.rotate(this.angle + Math.PI/2);
        this.ctx.scale(-1,1);
        this.ctx.translate(-this.position.x, -this.position.y);
        this.imagePart.draw(this.ctx, {x:this.position.x+13, y:this.position.y+16});
        this.ctx.restore();
    }

    // Métodos de actualización
    update(boolean) {
        this.draw();
        if(boolean) this.hitBox();
        this.updateMovement();
        this.updateProjectiles();
    }

    updateMovement() {
        if (!this.trackingWorker || !this.isTracking || this.death) return;
        
        this.updateSpeed();
        this.sendTrackingData();
    }

    updateSpeed() {
        if (this.currentSpeed < this.maxSpeed) {
            this.currentSpeed = Math.min(
                this.currentSpeed + this.acceleration,
                this.maxSpeed
            );
        }
    }

    updatePosition(angle, newPosition, currentSpeed) {
        this.angle = angle;
        this.position = newPosition;
        this.currentSpeed = currentSpeed;
    }

    // Métodos de proyectiles
    createProjectileInstance(data) {
        const projectile = new Projectile(
            this.ctx,
            this.spritesheet,
            { x: data.x, y: data.y },
            data.angle,
            true
        );
        projectile.speed = 3;
        this.projectilesEnemys.push(projectile);
    }

    updateProjectiles() {
        if (this.isTracking && !this.death) {
            this.createProjectile(this.projectilesEnemys);
        }
    }

    createProjectile(projectilesEnemys) {
        if (!this.projectileWorker) return;
        this.projectilesEnemys = projectilesEnemys;
        this.sendProjectileData();
    }

    // Métodos de comunicación con workers
    sendTrackingData() {
        this.trackingWorker.postMessage({
            enemyPosition: this.position,
            shipPosition: this.ship.position,
            speed: this.currentSpeed,
            maxSpeed: this.maxSpeed
        });
    }

    sendProjectileData() {
        this.projectileWorker.postMessage({
            position: this.position,
            angle: this.angle,
            timestamp: Date.now()
        });
    }

    // Métodos de utilidad
    generatePosition(canvas) {
        const positions = {
            1: () => ({ x: Math.random() * canvas.width, y: -this.image.height }),
            2: () => ({ x: canvas.width + this.image.width, y: Math.random() * canvas.height }),
            3: () => ({ x: -this.image.width, y: Math.random() * canvas.height }),
            4: () => ({ x: Math.random() * canvas.width, y: canvas.height + this.image.height })
        };

        const randomPosition = Math.floor(Math.random() * 4) + 1;
        this.position = positions[randomPosition]();
        this.resetSpeed();
    }

    collision(canvas) {
        const outOfBounds = 
            this.position.x - this.image.radio > canvas.width ||
            this.position.x + this.image.radio < 0 ||
            this.position.y - this.image.radio > canvas.height ||
            this.position.y + this.image.radio < 0;
            
        return outOfBounds && this.death;
    }

    hitBox() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.image.radio, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    resetSpeed() {
        this.currentSpeed = this.baseSpeed;
    }

    destroy() {
        this.isTracking = false;
        this.resetSpeed();
        this.terminateWorkers();
    }

    terminateWorkers() {
        [this.projectileWorker, this.trackingWorker].forEach(worker => {
            if (worker) {
                worker.terminate();
                worker = null;
            }
        });
    }
}
