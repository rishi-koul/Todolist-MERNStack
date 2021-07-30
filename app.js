// jshint esversion:6

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js")

const app = express()
let items = ["Buy Food", "Cook Food", "Eat Food"]

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true})

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema)


const item1 = new Item({
    name:"Welcome to your todolist"
})

const item2 = new Item({
    name:"Hit the + button to add a new item"
})

const item3 = new Item({
    name:"<-- Hit this checkbox to delete an item"
})

const defaultItems = [item1, item2, item3]

app.get("/", function(req, res){
    let day = date.getDate()

    Item.find({}, function(err, foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
            })
            res.redirect("/")
        }
        else{
            
        }
        res.render("list", {kindOfDay:day, newListItem:foundItems})
    })
}) 

app.post("/", function(req, res){
    
    const newItem = new Item({
        name: req.body.newItem
    })
    newItem.save()
    res.redirect("/")
})

app.get("/about", function(req, res){
    res.render("about")
})

app.post("/delete", function(req, res){
    const checkedItem = req.body.checkbox;
    Item.findByIdAndRemove(checkedItem, function(err){
        if(!err){
            console.log("Succesfully deleted");
            res.redirect("/");
        }
        else{
            console.log(err);
            console.log("hmmmmm");
        }
    })
})

app.listen(3000, function(){
    console.log("Server started at port 3000")
})