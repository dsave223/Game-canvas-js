self.onmessage = function(e) {
    if (e.data === 'start') {
        setInterval(() => {
            self.postMessage('generateAsteroid');
        }, 600);
    }
};
