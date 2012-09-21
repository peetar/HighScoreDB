var querystring = require("querystring"),
	util = require('util');



function logScore(response,  request, connection) {
	var headerMethod = false;
	if (headerMethod) {
	console.log("Request handler 'logScore' was called.");
	console.log(request.headers.name);
	var iName = escape(request.headers.name);
	console.log(request.headers.score);
	var iScore = request.headers.score;
	connection.query("INSERT INTO `highScore`.`sampleGame` (`name`, `score`) VALUES ('"+iName+"', "+iScore+");", function(err, rows, fields) {
		getTopScore(response, request, connection);
		});
	}
	else {
	request.addListener("data", function(chunk) {
		request.content += chunk;
	});
	request.addListener("end", function() {
		var obj = JSON.parse(request.content);
		console.log(util.inspect(request.content,true,4));
		connection.query("INSERT INTO `highScore`.`sampleGame` (`name`, `score`) VALUES ('"+obj.name+"', "+obj.score+");", function(err, rows, fields) {
		getTopScore(response, request, connection);
		});
	});
	
	}
	
	
}

function getTopScore(response,  request, connection) {
	var iName = escape(request.headers.name);
	connection.query("SELECT score FROM highScore.sampleGame where name = '"+iName+"';" , function(err, rows, fields) {
		console.log("rows: " +typeof(rows));
		var topScore = 0;
		var totalScore = 0;
		var entries = 0;
		if (util.isArray(rows)) {
			console.log("array");
			entries = rows.length;
			for (i = 0; i<rows.length; i++ ) {
				totalScore += rows[i].score;
				console.log(rows[i].score);
				if (rows[i].score > topScore) {
					topScore = rows[i].score;
					}
			}
			
		}
		else {
			entries = 1;
			totalScore = topScore = rows;
		}
		var averageScore = totalScore/entries;
		console.log("topScore: " + topScore);
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<results><name>"+unescape(iName)+"</name><topscore>"+topScore+"</topscore><averageScore>"+averageScore+"</averageScore></results>");
		response.end();
	});
	
}


exports.logScore = logScore;
exports.getTopScore = getTopScore;