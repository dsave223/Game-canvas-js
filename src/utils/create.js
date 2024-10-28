import { Enemy } from "../class/objects/enemy.js";
import { Asteroid } from "../class/objects/asteroid.js";
import { Star } from "../class/atmosphere/star.js";

export function generateEnemys() {
    setInterval(() => {
        let enemy = new Enemy(ctx, spritesheet, canvas, ship);
        enemy.generatePosition(canvas);
        enemys.push(enemy);
        setTimeout(() => {
            enemy.death = true;
        }, 3000);
    }, 7000);
}

export function generateAsteroids() {
    setInterval(() => {
        let type = Math.floor(Math.random()* (2)) + 1;
        let asteroid = new Asteroid(ctx, spritesheet, canvas, {x:0, y:0}, type);
        asteroid.generatePosition(canvas);
        asteroids.push(asteroid);
        setTimeout(() => {
            asteroid.death = true
        }, 3000);
    }, 600);
}

export function createMeteors(position) {
    let count = Math.floor(Math.random()*(5 - 3 + 1)) + 3;
    for(let i=0; i < count; i++){
        let meteor = new Asteroid(ctx, spritesheet, canvas, position, 3);
        meteor.death = true;
        asteroids.push(meteor);
    }
}

export function createStars(){
    for (let i = 0; i < 10; i++) {
        let star = new Star(
            ctx,
            canvas,
            {
                x: Math.random()*(canvas.width),
                y: Math.random()*(canvas.height),
            },
            Math.random()*(1.5 - 1) + 1
        );
        stars.push(star);
    }
    
    for (let i = 0; i < 45; i++) {
        let star = new Star(
            ctx,
            canvas,
            {
                x: Math.random()*(canvas.width),
                y: Math.random()*(canvas.height),
            },
            Math.random()*(1.5 - 1) + 1,
            2
        );
        stars.push(star);
    }
}