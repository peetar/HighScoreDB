var http = require("http");
var url = require("url");
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'peetar',
  password : 'root',
});

function start(route, handle) {
	connection.connect();
  function onRequest(request, response) {
  request.content ='';
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, connection, request);
  }
	var port = process.env.PORT || 8887;
  http.createServer(onRequest).listen(port);
  console.log("Server has started.");
}

exports.start = start;