export function updateObject(ship, hitBox, canvas, asteroids, labels, enemys, projectilesEnemys) {
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