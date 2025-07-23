const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderer';

const mongoose = require("mongoose");

main().then(()=>{
    console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.get("/", (req, res)=>{
    res.send("Hello I am root");
});


// index route 
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// new route 
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});


// create route 
app.post("/listings", async (req,res)=>{
    let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing({title, description, image, price, country, location});
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
});

// show route 
app.get("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

app.get("/listings/:id/edit", (req, res)=>{
    
})


app.listen(8080, ()=>{
    console.log(`Listening to port 8080`);
});