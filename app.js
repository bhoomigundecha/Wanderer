const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderer';
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");

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
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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

app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async(req,res)=>{
    let {id} = req.params;
    console.log(req.body);
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})
// Delete the route 

app.delete("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080, ()=>{
    console.log(`Listening to port 8080`);
});