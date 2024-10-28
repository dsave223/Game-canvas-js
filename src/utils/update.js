
export function updateShipEnemy(params) {
    setTimeout(() => {
        let text = new Label(ctx, "+20 puntos", enemys[j].position, "#36AAE9", fontWeith, font );
        labels.push(text);
        ship.projectiles.splice(i,1);
        enemys.splice(j,1);
        scoreCount += 20;
        score.innerHTML = scoreCount;
    }, 0);
}

export function updateShipAsteroid(params) {
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
            console.log("seguardo:", text);
            ship.projectiles.splice(i,1);
            asteroids.splice(j,1);
            scoreCount += 5;
            score.innerHTML = scoreCount;
        }
    }, 0);
}

export function updateShip() {
    ship.update(hitBox);
}

export function updateAsteroid() {
    asteroids.forEach((asteroid, i)=>{
        asteroid.update(hitBox);
        if(asteroid.collision(canvas)){
            setTimeout(() => {
                asteroids.splice(i,1);
            }, 0);
        }
    });
}

export function updateLabel() {
    labels.forEach((label, i) => {
        label.update();
        if(label.opacity<=0){
            labels.splice(i, 1);
        }
    });
}

export function updateEnemy(params) {
    enemys.forEach((enemy,i) =>{
        enemy.update(hitBox);
        enemy.createProjectile(projectilesEnemys);
        if(enemy.collision(canvas)){
            setTimeout(() => {
                enemys.splice(i,1);
            }, 0);
        }
    });
}

export function updateProjectile(params) {
    projectilesEnemys.forEach((projectile) =>{
        projectile.update(hitBox);
    })
}
