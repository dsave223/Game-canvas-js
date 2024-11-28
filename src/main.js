import { Asteroid } from "./class/objectSpace/asteroid.js";
import { Enemy } from "./class/ships/enemy.js";
import { Label } from "./class/atmosphere/label.js";
import { Ship } from "./class/ships/ship.js";
import { Star } from "./class/atmosphere/star.js";

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spritesheet = document.getElementById('spritesheet');

const menu = document.querySelector(".menu");
const score = document.querySelector(".score")
const btnMenu = document.querySelector(".play-game")

const ship = new Ship(ctx, spritesheet, canvas);

const asteroids = [];
const labels = [];
const enemys = [];
const projectilesEnemys = [];
const stars = [];

const font = window.getComputedStyle(document.body).fontFamily;
const fontWeith = window.getComputedStyle(document.body).fontWeight;

canvas.width  = 900;
canvas.height = 600;

let hitBox = false;
let menuStatus = true;
let play =  false;
let scoreCount = 0;

btnMenu.addEventListener( "click",()=>{
    init();
})

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
    scoreCount = 0
    score.innerHTML = scoreCount;
}

function background(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height );
    stars.forEach(star => {
        star.update();
    });
}

function generateEnemys() {
    setInterval(() => {
        let enemy = new Enemy(ctx, spritesheet, canvas, ship);
        enemy.generatePosition(canvas);
        enemys.push(enemy);
        setTimeout(() => {
            enemy.death = true;
        }, 3000);
    }, 7000);
}

function generateAsteroids() {
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

function createMeteors(position) {
    let count = Math.floor(Math.random()*(5 - 3 + 1)) + 3;
    for(let i=0; i < count; i++){
        let meteor = new Asteroid(ctx, spritesheet, canvas, position, 3);
        meteor.death = true;
        asteroids.push(meteor);
    }
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
            gameOver();
        }
    }

    for (let i = 0; i < enemys.length; i++) {
        if(collision(enemys[i], ship)){
            gameOver();
        }
    }

    for (let i = 0; i < projectilesEnemys.length; i++) {
        if(collision(projectilesEnemys[i], ship)){
            gameOver();
        }
    }

    loop1:
    for (let i = 0; i < ship.projectiles.length; i++) {
        for (let j = 0; j < enemys.length; j++) {
            if (collision(ship.projectiles[i], enemys[j])) {
                setTimeout(() => {
                    let text = new Label(ctx, "+20 puntos", enemys[j].position, "#36AAE9", fontWeith, font );
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
                        createMeteors(asteroids[j].position);
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

    enemys.forEach((enemy,i) =>{
        enemy.update(hitBox);
        enemy.createProjectile(projectilesEnemys);
        if(enemy.collision(canvas)){
            setTimeout(() => {
                enemys.splice(i,1);
            }, 0);
        }
    });

    projectilesEnemys.forEach((projectile) =>{
        projectile.update(hitBox);
    })
}

function update() {
    if(menuStatus){
        background();
    }else if(play){
        background();
        collisionObjects();
        updateObject();
    }
    
    requestAnimationFrame(update);
}

function gameOver() {
    hitBox = true;
    play = false
    setTimeout(() => {
        menu.style.display = "flex"
        menuStatus = true;
    }, 1500);
}

update();
createStars();
generateAsteroids();
generateEnemys();