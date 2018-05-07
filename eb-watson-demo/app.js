var express = require("express");
var app = express();
var bodyParser = require("body-parser");

var username = process.env.USER;
var password = process.env.PASS;
var workspace = process.env.WORKSPACE;

app.get("/", function(req, res) {
    res.send("Hello IBM Cloud");
});

app.post("/message", bodyParser.json(), function(req, res) {
    if (!req.body.text) {
        res.sendStatus(400);
    } else {
        https = require("https");
        body = {
            "input": {
                "text": req.body.text
            }
        };
        var token = new Buffer(username + ":" + password).toString("base64");
        var options = {
            "host": "gateway.watsonplatform.net",
            "path": "/conversation/api/v1/workspaces/" + workspace + "/message?version=2018-02-16",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Basic " + token
            }
        };
        var watsonReq = https.request(options, function(watsonRes) {
            var resBody = "";
            watsonRes.on("data", function(chunk) {
                resBody += chunk;
            });
            watsonRes.on("end", function() {
                res.status(watsonRes.statusCode).send(JSON.parse(resBody));
            });
        });
        watsonReq.write(JSON.stringify(body));
        watsonReq.end();
    }
});

var port = (process.env.PORT || 3000);

console.log("app is listening on port: %s", port);

app.listen(port);
