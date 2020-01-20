/*****
    Moment 5 - Projekt
    JavaScriptbaserad webbutveckling, HT19
    Av Mathilda Edström, Webbutveckling HT18
*****/

// Require npm package
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var path = require("path");

const serverOptions = {
    poolsize: 100,
    socketOptions: {
        socketTimeoutMS: 6000000
    }
};

// Connect to mongoDB
mongoose.connect(
    //"mongodb://localhost:27017/notesDB",
    "mongodb+srv://dbUser:UserPassword@cluster0-grzkz.mongodb.net/notesDB?retryWrites=true&w=majority",
    {
        server: serverOptions,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

// Get scheme
let Todos = require("./scheme/todos.js");

// Create instans
var app = express();

// Set access
app.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE,OPTIONS");
    next();
});

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// REST-api
// GET /
app.get("/", function (req, res) {
    res.send('Visit /todos instead');
});

// GET todos
app.get("/todos", function (req, res) {
    let getCat = req.query.category;

    // By category
    if (getCat) {
        Todos.find({ category: getCat }, function (err, output) {
            if (err) {
                res.send(err);
            }
            // Output response in JSON
            res.json(output);
        })
    } else {
        Todos.find(function (err, output) {
            if (err) {
                res.send(err);
            }
            // Output response in JSON
            res.json(output);
        })
    }
});

// GET todos by id
app.get("/todos/:id", function (req, res) {
    // Id
    let getId = req.params.id;

    // Find todos item
    Todos.findById(getId, function (err, output) {
        if (err) {
            res.send(err);
        }

        // Output response in JSON
        res.json(output);
    })
});

// POST todos item
app.post("/todos/add", function (req, res) {
    // New instance
    let todos = new Todos();

    // Create new object
    todos.item = req.body.item;
    todos.created = new Date();
    todos.checked = false;
    todos.category = req.body.category;

    // Save to mongodb
    todos.save(function (err) {
        if (err) {
            res.send(err);
        }
    })

    // Redirect
    res.redirect("/");
});

// DELETE todos item by id
app.delete("/todos/delete/:id", function (req, res) {
    // Id
    let deleteId = req.params.id;

    // Delete todos item
    Todos.deleteOne({
        _id: deleteId
    }, function (err, output) {
        if (err) {
            res.send(err);
        }

        // Redirect
        res.redirect("/");
    });
});

// UPDATE todos item by id
app.put("/todos/update/:id", function (req, res) {
    // Id
    let updateId = req.params.id;

    // Update todos item
    Todos.findByIdAndUpdate(updateId, req.body, {
        new: true
    }, function (err, output) {
        if (err) {
            res.send(err);
        }

        // Redirect
        res.redirect("/");
    })
})

if (process.env.NODE_ENV === "production") {
    // Create searchway
    app.use(express.static(path.join(__dirname, 'public')));

    app.get(/.*/, (req, res) => res.sendFile(__dirname + "public/index.html"));
}

// Port for connection
var port = process.env.PORT || 3000;

// Connect to server
app.listen(port, function () {
    console.log(`Servern är startad på port ${port}`);
})