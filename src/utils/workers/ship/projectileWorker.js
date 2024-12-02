self.onmessage = function(e) {
    const { position, angle, timestamp } = e.data;
    
    const projectiles = [
        {
            x: position.x + Math.cos(angle) * 14,
            y: position.y + Math.sin(angle) * 14,
            angle: angle,
            timestamp: timestamp + 12,
        },
        {
            x: position.x - Math.cos(angle) * 15,
            y: position.y - Math.sin(angle) * 15,
            angle: angle,
            timestamp: timestamp + 12,
        }
    ];
    
    self.postMessage(projectiles);
};