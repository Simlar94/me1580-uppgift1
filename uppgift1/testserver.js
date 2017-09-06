// Här skapar man variabler av alla moduler.
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var PouchDB = require('pouchdb');
var path = require('path');

//Här skapas en databasvariabel med koppling till databasen på localhost med porten 5984.
var database = new PouchDB("http://127.0.0.1:5984/games");

//Här skapas en tolkare för JSON-data.
app.use(bodyparser.json());

//Här skapas en tolkare för x-www-form-urlencoded.
app.use(bodyparser.urlencoded({ extended: true }));

//Här skapas en väg för statiska dokument som HTML/CSS/JS som samlas i mappen 'views'.
app.use(express.static(path.join(__dirname, 'views')));



/*
sync();

 Funktion för synkronisering av databaserna  
function sync() {
    var opts = {live: true};
    database.replicate.to(remotecouch, opts);
    database.replicate.from(remotecouch, opts);
}
*/

//GET-metod som hämtar ALLA dokument ifrån localhost:3000/games/.  
app.get ("/games", function(req, res){
    database.allDocs({include_docs: true}).then(function (result) {
        res.send(result.rows.map(function (item){
            return item.doc; //Svarar med och returnerar alla dokument.
        }));
    }, function (error){
        res.status(400).send(error); //Svarar med error om det blir error.
    });
});

//POST-metod som skickar ett nytt dokument till routen /games/.
app.post ("/games", function(req, res){
    database.post(req.body).then(function(result){
        res.send(result); // Svarar med resultat.
    });
});

//DELTE-metod som tar bort ett dokument med angivet id.
app.delete ("/games", function(req, res){
    database.get(req.body.id).then(function(result){
        return database.remove(result);
    }).then(function(result){
        res.send(result); // Svarar med resultat.
    });
});

//PUT-metod som uppdaterar ett dokument med angivet id.
app.put ("/games/:id", function(req, res){
    database.get(req.params.id).then(function(result){
        
        result.name = req.body.name;
        result.genre = req.body.genre;
        result.platform = req.body.platform;
        result.releaseyear = req.body.releaseyear;
        result.developer = req.body.developer;
        
        database.put(result);
        res.send(result); // Svarar med resultat.
    });
});



app.listen(3000); //Porten som servern lyssnar på.
console.log('server is running on port 3000.'); //Respons om servern körs.