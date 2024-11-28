self.onmessage = function(e) {
    if (e.data === 'start') {
        setInterval(() => {
            self.postMessage('generateEnemy');
        }, 3000);
    }
};