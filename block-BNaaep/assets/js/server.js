var http = require('http');
var url = require('url');
const fs = require('fs');
var path = require('path');
var qs = require('querystring');
var userPath = path.join(__dirname, '../../', 'contacts/');
console.log(userPath);
const server = http.createServer(handleRequest);
function handleRequest(request, response) {
	let pathName = url.parse(request.url).pathname;
	var store = '';
	request.on('data', (chunk) => {
		store += chunk;
	});

	request.on('end', () => {
		if (request.method === 'POST' && request.url === '/form') {
			let username = qs.parse(store).username;
			let parsedData = qs.parse(store);
			let stringifiedData = JSON.stringify(parsedData);
			console.log(stringifiedData);
			fs.open(userPath + username + '.json', 'wx', (err, fd) => {
				if (err) response.end('User already exists');
				// fd  indicates newly created file inside contacts folder
				// once file is created, we can write content to file
				// since store has all the data of the user
				fs.writeFile(fd, stringifiedData, (err) => {
					// err indicated file was not written
					if (err) response.end('file not created');
					// if no error, file was written successfully
					// close the file
					fs.close(fd, (err) => {
						if (err) response.end('user cant be created');
						response.end(`${username} successfully created`);
					});
				});
			});
		}
	});

	if (request.method === 'GET' && pathName === '/') {
		response.setHeader('Content-Type', 'text/html');
		fs.readFile('../../index.html', (err, content) => {
			if (err) return console.log(err);
			response.end(content);
		});
	} else if (request.method === 'GET' && pathName === '/about') {
		response.setHeader('Content-Type', 'text/html');
		fs.readFile('../../about.html', (err, content) => {
			if (err) return console.log(err);
			response.end(content);
		});
	} else if (request.method === 'GET' && pathName === '/contact') {
		response.setHeader('Content-Type', 'text/html');
		fs.readFile('../../form.html', (err, content) => {
			if (err) return console.log(err);
			response.end(content);
		});
	} else if (request.url.split('.').pop() === 'js') {
		response.setHeader('Content-Type', 'text/css');
		fs.readFile('../js' + request.url, (err, content) => {
			if (err) return console.log(err);
			response.end(content);
		});
	} else if (request.url.split('.').pop() === 'jpg') {
		response.setHeader('Content-Type', 'image/jpg');
		fs.readFile('../images' + request.url, (err, content) => {
			if (err) return console.log(err);
			response.end(content);
		});
	}
}

server.listen(5000, () => {
	console.log('Server listening on port 5000');
});