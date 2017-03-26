var express = require('express');

var port = process.env.PORT || 5000;

var app = express();

var validURL = function(str) {
	var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

	return re.test(str);
}

app.use(express.static('public'));

app.get('/:url', function(req, res) {
	var theURL = req.params.url;

	if(validURL(theURL)) {
		res.status(200).send(theURL);
	} else {
		res.status(201).send("Invalid URL!");
	}
});

app.listen(port, function(err) {
	console.log('Server running on port ' + port);
});
