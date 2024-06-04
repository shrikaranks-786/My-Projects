const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to wanderlust");
})
.catch(()=>{
    console.log("not connected");
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initdb = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner : '6659f617fabebb91b9d6a7bd'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initdb();