var http = require('http');
var fs = require('fs');
 var contactPath = __dirname + '/contact/'

var server = http.createServer(handleRequest)

function handleRequest(req,res){
    var store = '';
    req.on("data", (chunk) => {
        chunk = chunk + store
    })
    req.on("end", () => {
        if(req.url === "/form" && req.method === "POST"){
           var username =  JSON.parse(store).username;
           fs.open(contactPath + username + '.json', 'wx', (err,fd) => {
               if(err) return console.log(err);
               fs.writeFile(fd, store , (err) => {
                   if(err) return console.log(err);
                   fs.close(fd, () => {
                       res.end(`${username} created succesfully`);
                   })
               })
           })
        }
      
    })

    if(req.method === "GET" && req.url === '/'){
        res.setHeader('Content-Type', 'text/html')
        fs.createReadStream('./index.html').pipe(res)
    }

    if(req.method === "GET" && req.url === '/about'){
        res.setHeader('Content-Type', 'text/html')
        fs.createReadStream('./about.html').pipe(res)
    }
    if(req.method === "GET" && req.url === '/contact'){
        res.setHeader('Content-Type', 'text/html')
        fs.createReadStream('./contact.html').pipe(res)
    }


}

server.listen(5000, () => {
    console.log("server is listening on port 5000");
})