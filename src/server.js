const http = require('http'),
	  router = require('./router/router.js');

http.createServer(router).listen(3000);
console.log('Server running 3000');
