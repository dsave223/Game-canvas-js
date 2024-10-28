import { Ship } from "../class/objects/ship.js";
import { updateShipEnemy } from "../utils/update.js";
import { updateShipAsteroid } from "../utils/update.js";

const ship = new Ship(ctx, spritesheet, canvas);

const asteroids = [];
const labels = [];
const enemys = [];
const projectilesEnemys = [];
const stars = [];

let hitBox = false;
let menuStatus = true;
let play =  false;
let scoreCount = 0;

export function init() {
    hitBox = false;
    asteroids.length = 0;
    labels.length = 0;
    enemys.length = 0;
    projectilesEnemys.length = 0;
    menu.style.display = "none";
    menuStatus =  false;
    play = true;
    scoreCount = 0
    score.innerHTML = scoreCount;
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
                
                break loop1;
            }            
        }
    }

    loop2:
    for(let i=0; i < ship.projectiles.length; i++){
        for(let j=0; j < asteroids.length; j++){
            if(collision(ship.projectiles[i], asteroids[j])){
                
                break loop2;
            }
        }
    }
}

function updateObject() {
    
}

function gameOver() {
    hitBox = true;
    play = false
    setTimeout(() => {
        menu.style.display = "flex"
        menuStatus = true;
    }, 1500);
}