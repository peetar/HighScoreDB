var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/logScore"] = requestHandlers.logScore;
handle["/getTopScore"] = requestHandlers.getTopScore;

server.start(router.route, handle);