import { Label } from "./class/atmosphere/label.js";
import { Ship } from "./class/ships/ship.js";
import { Asteroid } from "./class/objectSpace/asteroid.js";
import { Enemy } from "./class/ships/enemy.js";
import { Star } from "./class/atmosphere/star.js";

import { collision } from "./utils/collision/collision.js";
import { updateObject } from "./utils/update/updateObject.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spritesheet = document.getElementById('spritesheet');

const menu = document.querySelector(".menu");
const score = document.querySelector(".score");
const btnMenu = document.querySelector(".play-game");

const font = window.getComputedStyle(document.body).fontFamily;
const fontWeith = window.getComputedStyle(document.body).fontWeight;

canvas.width  = 900;
canvas.height = 600;

const ship = new Ship(ctx, spritesheet, canvas);
const asteroids = [];
const labels = [];
const enemys = [];
const projectilesEnemys = [];
const stars = [];

let hitBox = false;
let menuStatus = true;
let play = false;
let scoreCount = 0;

btnMenu.addEventListener("click", init);

function init() {
    hitBox = false;
    asteroids.length = 0;
    labels.length = 0;
    enemys.length = 0;
    projectilesEnemys.length = 0;
    ship.position = {x: 200,y: 200};
    ship.projectiles.length = 0;
    ship.angle = 0;
    ship.speed = 0;
    menu.style.display = "none";
    menuStatus =  false;
    play = true;
    scoreCount = 0;
    score.innerHTML = scoreCount;

    if (enemyWorker) enemyWorker.terminate();
    if (asteroidWorker) asteroidWorker.terminate();
    
    setupWorkers();
}

function background() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => star.update());
}

function createStars(){
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

let enemyWorker;
let asteroidWorker;

function setupWorkers() {
    enemyWorker = new Worker('./src/workers/enemyWorker.js');
    asteroidWorker = new Worker('./src/workers/asteroidWorker.js');
    
    enemyWorker.onmessage = function(e) {
        if (e.data === 'generateEnemy') {
            let enemy = new Enemy(ctx, spritesheet, canvas, ship);
            enemy.generatePosition(canvas);
            enemys.push(enemy);
            setTimeout(() => {
                enemy.death = true;
            }, 3000);
        }
    };

    asteroidWorker.onmessage = function(e) {
        if (e.data === 'generateAsteroid') {
            let type = Math.floor(Math.random()* (2)) + 1;
            let asteroid = new Asteroid(ctx, spritesheet, canvas, {x:0, y:0}, type);
            asteroid.generatePosition(canvas);
            asteroids.push(asteroid);
            setTimeout(() => {
                asteroid.death = true;
            }, 3000);
        }
    };
    
    enemyWorker.postMessage('start');
    asteroidWorker.postMessage('start');
}

function createMeteors(position) {
    let count = Math.floor(Math.random()*(5 - 3 + 1)) + 3;
    for(let i=0; i < count; i++){
        let meteor = new Asteroid(ctx, spritesheet, canvas, position, 3);
        meteor.death = true;
        asteroids.push(meteor);
    }
}

function collisionObjects() {
    for(const element of asteroids){
        if(collision(element, ship)){
            gameOver();
        }
    }

    for (const element of enemys) {
        if(collision(element, ship)){
            gameOver();
        }
    }

    for (const element of projectilesEnemys) {
        if(collision(element, ship)){
            gameOver();
        }
    }

    loop1:
    for (let i = 0; i < ship.projectiles.length; i++) {
        for (let j = 0; j < enemys.length; j++) {
            if (collision(ship.projectiles[i], enemys[j])) {
                setTimeout(() => {
                    let text = new Label(ctx, "+20 puntos", enemys[j].position, "#36AAE9", fontWeith, font);
                    labels.push(text);
                    ship.projectiles.splice(i,1);
                    enemys.splice(j,1);
                    scoreCount += 20;
                    score.innerHTML = scoreCount;
                }, 0);
                break loop1;
            }            
        }
    }

    loop2:
    for(let i=0; i < ship.projectiles.length; i++){
        for(let j=0; j < asteroids.length; j++){
            if(collision(ship.projectiles[i], asteroids[j])){
                setTimeout(() => {
                    if (asteroids[j].type === 1) {
                        let text = new Label(ctx, "+10 puntos", asteroids[j].position, "#5CCB5F", fontWeith, font );
                        labels.push(text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                        scoreCount += 10;
                        score.innerHTML = scoreCount;
                    }else if (asteroids[j].type === 2) {
                        createMeteors( asteroids[j].position);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                    }else{
                        let text = new Label(ctx, "+5 puntos", asteroids[j].position, "white", fontWeith, font );
                        labels.push(text);
                        ship.projectiles.splice(i,1);
                        asteroids.splice(j,1);
                        scoreCount += 5;
                        score.innerHTML = scoreCount;
                    }
                }, 0);
                break loop2;
            }
        }
    }
}

function update() {
    if(menuStatus){
        background();
    }else if(play){
        background();
        collisionObjects();
        updateObject(ship, hitBox, canvas, asteroids, labels, enemys, projectilesEnemys);
    }
    
    requestAnimationFrame(update);
}

function gameOver() {
    hitBox = true;
    play = false;
    setTimeout(() => {
        menu.style.display = "flex";
        menuStatus = true;
    }, 1500);
}

update();
createStars();
setupWorkers();