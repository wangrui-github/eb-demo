var express = require("express");
var app = express();

app.get("/", function(req, res) {
    res.send("Hello IBM Cloud");
});

var port = (process.env.PORT || 3000);

console.log("app is listening on port: %s", port);

app.listen(port);
