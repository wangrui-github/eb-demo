var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var Cloudant = require("cloudant");

var cloudant_creds = {
    account: process.env.DB_ACCOUNT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
};
var cloudant = Cloudant(cloudant_creds);
var db = cloudant.db.use("wfgchatbot");

app.get("/", function(req, res) {
    res.send("Hello IBM Cloud");
});

app.post("/wfgchatbot", bodyParser.json(), function(req, res) {
    if (!req.body.wfgchatbot) {
        res.sendStatus(400);
    } else {
        db.insert(req.body, function(err, doc) {
            if (!err) {
                res.setHeader("Content-Type", "application/json");
                res.send(doc);
            } else {
                console.log("Cloudant error: %s", err);
                res.status(err.statusCode).send(err.message);
            }
        });
    }
});

app.get("/wfgchatbot", function(req, res) {
    var db_query = {};
    db_query.selector = {
        "_id": {
            "$gt": "0"
	}
    };
    db_query.sort = [{ "_id": "asc" }];

    db.find(db_query, function(err, result) {
        if (err) {
            console.log("Cloudant error: " + err);
            res.status(err.statusCode).send(err.message);
        } else {
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(result.docs);
        }
    });
});

var port = (process.env.PORT || 3000);

console.log("app is listening on port: %s", port);

app.listen(port);
