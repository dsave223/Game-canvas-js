export function collision(object01, object02) {
    let v1 = object01.position;
    let v2 = object02.position;

    let v3 ={
        x:v1.x - v2.x,
        y:v1.y - v2.y
    }

    let distance = Math.sqrt(v3.x*v3.x + v3.y*v3.y);

    if(distance < object01.image.radio + object02.image.radio)
        return true;
}