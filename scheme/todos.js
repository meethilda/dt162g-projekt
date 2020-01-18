// Create scheme for home
var mongoose = require("mongoose");
var Scheme = mongoose.Schema;
mongoose.set('debug', true);

let todoScheme = new Scheme({
    item: String,
    created: Date,
    checked: Boolean,
    category: String
}, {collection: 'todos'});

module.exports = mongoose.model("Todos", todoScheme);