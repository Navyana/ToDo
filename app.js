const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//////////Momgoose///////////////// 

mongoose.connect("mongodb://localhost:27017/todoDb", 
{useNewUrlParser: true,
useUnifiedTopology:  true});

mongoose.set('useFindAndModify', false);

const itemsSchema ={
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name : "Hit + button to add an element"
});
const item2 = new Item({
    name : "<--Hit this to delete an item"
});

const defaultItems = [item1,item2];



app.get("/",function(req, res){
    
    var today = new Date();

    var options ={
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-us", options);

    Item.find({}, function(err, foundItems){
        if(foundItems.length == 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("Successfully added to database");
                }
                res.render("/")
        })
        }else{
            res.render("list", {
                kindOfDay : day,
                newListItems : foundItems
            });
        }  
    });
});

app.post("/", function(req, res){

 const itemName  = req.body.newItem;
 const item = new Item({
     name : itemName
 });
 item.save();
  res.redirect("/")
})

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("Successfully deleted the item");
            res.redirect("/")
        }
    });
});


app.listen(3000, function(){
    console.log("Server is running");
});