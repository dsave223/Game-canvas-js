self.onmessage = function(e) {
    const { enemyPosition, shipPosition } = e.data;
    
    const v1 = {
        x: shipPosition.x - enemyPosition.x,
        y: shipPosition.y - enemyPosition.y
    };
    
    const mag = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    
    const vU = {
        x: v1.x / mag,
        y: v1.y / mag
    };
    
    const angle = Math.atan2(vU.y, vU.x);
    
    const speed = 1;
    const newPosition = {
        x: enemyPosition.x + vU.x * speed,
        y: enemyPosition.y + vU.y * speed
    };
    
    self.postMessage({
        angle,
        newPosition
    });
};