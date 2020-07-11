// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");
const database = require("./db/db.json")
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// id variable
let id = database.length + 1;

// HTML Routing

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// API Routing
// Get notes
app.get("/api/notes", function (req, res) {
  res.json(database);
})

// Create notes
app.post("/api/notes", function (req, res) {
  req.body.id = id++;
  //console.log(req.body)
  database.push(req.body)
  fs.writeFile("./db/db.json", JSON.stringify(database), function (err) {
      if (err) throw err
  });
  res.json(database);

});

// Update Notes
app.patch('/api/notes/:id', function (req, res) {
  if (req.body._id && req.body._id != req.params.id) return res.status(400).json({ error: 'ID in the body is not matching ID in the URL' });
  delete req.body._id;
  req.collection.updateById(req.params.id, { $set: req.body }, function (e, results) {
      console.log('boo', e, results);
      res.json(results);
  });
});
// Delete all notes
app.delete("/api/notes/:id", function (req, res) {
  let getId = req.params.id

  for (let index = 0; index < database.length; index++) {
      if (database[index].id === parseInt(getId)) {
          database.splice(index, 1);
      }
  }
  fs.writeFile("./db/db.json", JSON.stringify(database), function (err) {
      if (err) throw err
  });
  res.json(database);

});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
