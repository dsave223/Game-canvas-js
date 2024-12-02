// src/utils/workers/enemy/trackingWorker.js
self.onmessage = function(e) {
    const { enemyPosition, shipPosition, speed, maxSpeed } = e.data;
        
    // Calcular vector de dirección
    const v1 = {
        x: shipPosition.x - enemyPosition.x,
        y: shipPosition.y - enemyPosition.y
    };
    
    // Calcular magnitud (distancia al objetivo)
    const distance = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    
    // Evitar división por cero
    if (distance === 0) {
        return; // No se mueve si está en la misma posición
    }
    
    // Calcular vector unitario
    const vU = {
        x: v1.x / distance,
        y: v1.y / distance
    };
    
    // Calcular ángulo
    const angle = Math.atan2(vU.y, vU.x);
    
    // Asegurar que la velocidad no exceda el máximo
    const currentSpeed = Math.min(speed, maxSpeed);
    
    // Calcular nueva posición
    const newPosition = {
        x: enemyPosition.x + vU.x * currentSpeed,
        y: enemyPosition.y + vU.y * currentSpeed
    };
    
    self.postMessage({
        angle,
        newPosition,
        currentSpeed
    });
};