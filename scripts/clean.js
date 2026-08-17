const fs = require('fs');

fs.rmSync('build', { recursive: true, force: true });
