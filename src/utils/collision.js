export function checkCanvasCollision(object, canvas) {
    if((object.position.x - object.image.radio > canvas.width ||
        object.position.x + object.image.radio < 0 ||
        object.position.y - object.image.radio > canvas.height ||
        object.position.y + object.image.radio < 0) && object.death
    ){
        return true;
    }
    return false;
}

export function checkProjectileCanvasCollision(projectile, canvas) {
    if(
        projectile.position.x - projectile.image.radio > canvas.width || 
        projectile.position.x + projectile.image.radio < 0 ||
        projectile.position.y - projectile.image.radio > canvas.height ||
        projectile.position.y + projectile.image.radio < 0
    ){
        return true;
    }
    return false;
}

export function checkCollisionObjects(object01, object02) {
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