import { Asteroid } from "./asteroid.js";
import { Enemy } from "./enemy.js";
import { Label } from "./label.js";
import { Ship } from "./ship.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spritesheet = document.getElementById('spritesheet')

const ship = new Ship(ctx, spritesheet, canvas);

const asteroids = [];
const labels = [];
const enemys = [];

const font = window.getComputedStyle(document.body).fontFamily;
const fontWeith = window.getComputedStyle(document.body).fontWeight;

canvas.width  = 900;
canvas.height = 600;

let hitBox = false;

function background(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height );
}

function generateEnemys() {
    setInterval(() => {
        let enemy = new Enemy(ctx, spritesheet, canvas, ship);
        enemy.generatePosition(canvas);
        enemys.push(enemy);
    }, 7000);
}

function generateAsteroids() {
    setInterval(() => {
        let type = Math.floor(Math.random()* (2)) + 1;
        let asteroid = new Asteroid(ctx, spritesheet, {x:0, y:0}, type);
        asteroid.generatePosition(canvas);
        asteroids.push(asteroid);
        setTimeout(() => {
            asteroid.death = true
        }, 3000);
    }, 500);
}

function createMeteors(position) {
    let count = Math.floor(Math.random()*(5 - 3 + 1)) + 3;
    for(let i=0; i < count; i++){
        let meteor = new Asteroid(ctx, spritesheet, position, 3);
        meteor.death = true;
        asteroids.push(meteor);
    }
}

function collision(object01, object02) {
    let v1 = object01.position;
    let v2 = object02.position;

    let v3 ={
        x:v1.x - v2.x,
        y:v1.y - v2.y
    }

    let distance = Math.sqrt(v3.x*v3.x + v3.y*v3.y);

    if(distance < object01.image.radio + object02.image.radio){
        return true;
    }
    return false;
}

function collisionObjects() {
    for(let j=0; j < asteroids.length; j++){
        if(collision(asteroids[j], ship)){
            console.log("exitoso");
        }
    }

    for(let i=0; i < ship.projectiles.length; i++){
        for(let j=0; j < asteroids.length; j++){
            if(collision(ship.projectiles[i], asteroids[j])){
                setTimeout(() => {
                    if (asteroids[j].type === 1) {
                        let text = new Label(ctx, "+10 puntos", asteroids[j].position, "#5CCB5F", fontWeith, font );
                        labels.push(text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                    }else if (asteroids[j].type === 2) {
                        createMeteors(asteroids[j].position);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                    }else{
                        let text = new Label(ctx, "+5 puntos", asteroids[j].position, "white", fontWeith, font );
                        labels.push(text);
                        console.log("seguardo:", text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                    }
                }, 0);
                return;
            }
        }
    }
}

function updateObject() {
    ship.update(hitBox);
    asteroids.forEach((asteroid, i)=>{
        asteroid.update(hitBox);
        if(asteroid.collision(canvas)){
            setTimeout(() => {
                asteroids.splice(i,1);
            }, 0);
        }
    });
    labels.forEach((label, i) => {
        label.update();
        if(label.opacity<=0){
            labels.splice(i, 1);
        }
    });
    enemys.forEach((enemy) =>{
        enemy.update(hitBox);
    });
}

function update() {
    background();
    collisionObjects();
    updateObject();
    
    requestAnimationFrame(update);
}

update();
generateAsteroids();
generateEnemys();


