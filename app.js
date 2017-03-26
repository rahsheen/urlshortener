var express = require('express');
var validURL = require('valid-url');
var shortid = require('shortid');
var mongodb = require('mongodb').MongoClient;

var port = process.env.PORT || 5000;

var app = express();

var myMware = function (req, res) {
	var oURL = req.originalUrl;
	var theURL = oURL.slice(5,oURL.length);

	if (validURL.isWebUri(theURL)) {
		res.status(200).send(JSON.stringify(theURL));
	} else {
		console.log(req.params.url);
		res.status(404).send("Invalid URL! --> " +theURLn);
	}
}

app.get('/new/*', myMware);

app.use(express.static('public'));

app.listen(port, function (err) {
	console.log('Server running on port ' + port);
});
