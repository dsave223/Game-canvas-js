let lastShotTime = 0;
const shootCooldown = 2000;
const shootProbability = 0.1;

self.onmessage = function(e) {
    try {
        const currentTime = Date.now();
        const timeSinceLastShot = currentTime - lastShotTime;
        
        if (timeSinceLastShot > shootCooldown && Math.random() < shootProbability) {
            const { position, angle, timestamp } = e.data;
            const projectiles = [];
            const baseAngle = angle + Math.PI/2;
            
            for (let i = 0; i < 3; i++) {
                const angleOffset = (i - 1) * Math.PI / 18;
                projectiles.push({
                    x: position.x + Math.cos(baseAngle) * 14,
                    y: position.y + Math.sin(baseAngle) * 14,
                    angle: baseAngle + angleOffset,
                    timestamp: timestamp
                });
            }
            
            lastShotTime = currentTime;
            self.postMessage(projectiles);
        }
    } catch (error) {
        console.error('Error en el worker:', error);
        self.postMessage({ error: error.message });
    }
};