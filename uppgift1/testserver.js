/* Här skapar man variabler av alla moduler */
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var PouchDB = require('pouchdb');
var path = require('path');

var database = new PouchDB("http://127.0.0.1:5984/games");

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true }));

//app.use(express.static(path.join(__dirname, 'views')));



/*
sync();

 Funktion för synkronisering av databaserna  
function sync() {
    var opts = {live: true};
    database.replicate.to(remotecouch, opts);
    database.replicate.from(remotecouch, opts);
}
*/


app.get ("/games", function(req, res){
    database.allDocs({include_docs: true}).then(function (result) {
        res.send(result.rows.map(function (item){
            return item.doc;
        }));
    }, function (error){
        res.status(400).send(error);
    });
});

app.post ("/games", function(req, res){
    database.post(req.body).then(function(result){
        res.send(result);
    });
});


app.delete ("/games", function(req, res){
    database.get(req.body.id).then(function(result){
        return database.remove(result);
    }).then(function(result){
        res.send(result);
    });
});




app.listen(3000);
console.log('server is running on port 3000.');