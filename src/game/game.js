import { Ship } from "../class/objects/ship.js";
import { checkCollisionObjects } from "../utils/collision.js";
import { updateShipEnemy, updateShipAsteroid, updateAsteroid, updateEnemy, updateShip, updateProjectile, updateLabel } from "../utils/update.js";

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

export function init(newCtx, newSpritesheet, newCanvas, newMenu, newScore, newFont, newFontWeight) {
    ctx = newCtx;
    canvas = newCanvas;
    menu = newMenu;
    score = newScore;
    font = newFont;
    fontWeight = newFontWeight;

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

function collisionObjects() {
    for(let j=0; j < asteroids.length; j++){
        if(checkCollisionObjects(asteroids[j], ship)){
            gameOver();
        }
    }

    for (let i = 0; i < enemys.length; i++) {
        if(collisionObjects(enemys[i], ship)){
            gameOver();
        }
    }

    for (let i = 0; i < projectilesEnemys.length; i++) {
        if(checkCollisionObjects(projectilesEnemys[i], ship)){
            gameOver();
        }
    }

    loop1:
    for (let i = 0; i < ship.projectiles.length; i++) {
        for (let j = 0; j < enemys.length; j++) {
            if (checkCollisionObjects(ship.projectiles[i], enemys[j])) {
                let projectile = ship.projectiles[i];
                let enemy = enemys[j];
                updateShipEnemy(labels, projectile, enemy);
                break loop1;
            }            
        }
    }

    loop2:
    for(let i=0; i < ship.projectiles.length; i++){
        for(let j=0; j < asteroids.length; j++){
            if(checkCollisionObjects(ship.projectiles[i], asteroids[j])){
                updateShipAsteroid();
                break loop2;
            }
        }
    }
}

function updateObject() {
    updateShip();
    updateAsteroid();
    updateEnemy();
    updateProjectile();
    updateLabel();
}

function background(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height );
    stars.forEach(star => {
        star.update();
    });
}

function updateMenu() {
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