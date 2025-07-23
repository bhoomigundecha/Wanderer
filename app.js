const express = require("express");
const app = express();


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

app.get("/", (req, res)=>{
    res.send("Hello I am root");
});

app.get("/listings", (req, res)=>{
    Listing.find({}).then((res)=>{
        console.log(res);
    });
});
app.listen(8080, ()=>{
    console.log(`Listening to port 8080`);
});