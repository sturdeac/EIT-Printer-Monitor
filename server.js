var express = require('express');
var request = require('request');
var path = require('path');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/'));

app.get('/getPrinterInfo', function(req, res) {
	var url = "http://137.112.31.45";
	request(url, function(error, response, html){
		if (error) throw error;
		else {
			res.json(html);
		}
	});
});

// set the home page route
app.get('*', function(req, res) {

    // ejs render automatically looks in the views folder
    res.sendFile(path.join(__dirname, 'printer.html'));
});

app.listen(port, function() {
    console.log('The printer monitor is running on http://localhost:' + port);
});