const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderer";
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// MongoDB connection
main().then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.error("DB Connection Error:", err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
app.get("/", (req, res) => {
  res.send("Hello, I am root!");
});

// Index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// Create route
app.post("/listings", wrapAsync(async (req, res) => {
    const { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({
      title,
      description,
      image,
      price,
      country,
      location,
    });
    await newListing.save();
    res.redirect("/listings");
}));

// Show route
app.get("/listings/:id", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/show.ejs", { listing });
}));

// Edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");
    res.render("listings/edit.ejs", { listing });
}));

// Update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

// Delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// for other all not define routes 
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).send(message);
});

// Start the server
app.listen(8080, () => {
  console.log("Server listening on port 8080");
});
