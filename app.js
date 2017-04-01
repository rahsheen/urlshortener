var express = require('express');
var validURL = require('valid-url');
var shortid = require('shortid');
var mongodb = require('mongodb').MongoClient;

var port = process.env.PORT || 5000;
var url = "mongodb://sheen:sheen123@ds149030.mlab.com:49030/sheeninc";

var app = express();

var shortRoute = function (req, res) {
	var theID = req.params.id;

	mongodb.connect(url, function (err, db) {
		if (err) throw err;

		var urlCollection = db.collection('urls');

		// See if we have a URL for this ID
		urlCollection.findOne({
			short: theID
		}).then(function (existsURL) {
			if (existsURL) {
				return res.redirect(301, existsURL.original);
			} else {
				res.status(404).end();
			}

			db.close();
		});
	});
};

var newRoute = function (req, res) {
	var oURL = req.originalUrl;
	var theURL = oURL.slice(5, oURL.length);

	if (validURL.isWebUri(theURL)) {

		mongodb.connect(url, function (err, db) {
			if (err) throw err;

			// See if the URL already exists
			var urlCollection = db.collection('urls');

			urlCollection.findOne({
				original: theURL
			}).then(function (existsURL) {

				if (existsURL) {
					// URL already in DB

					res.status(200).send(JSON.stringify(existsURL));

					db.close();
				} else {
					// Store URL in DB
					var theID = shortid.generate();

					var urlInfo = {
						original: theURL,
						short: theID
					};

					urlCollection.insert(urlInfo, function (err, data) {
						if (err) throw err;

						res.status(200).send(JSON.stringify(urlInfo));
						db.close();
					});
				}
			});
		});
	} else {
		var error = {
			"error": "Wrong URL format."
		};

		res.status(404).send(JSON.stringify(error));
	}
}

app.get('/new/*', newRoute);
app.get('/:id', shortRoute);

app.use(express.static('public'));

app.listen(port, function (err) {
	console.log('Server running on port ' + port);
});
