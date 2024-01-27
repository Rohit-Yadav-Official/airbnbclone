const mongoose=require("mongoose");
const initdata = require ("./data.js");
const listing=require("../models/listing.js");

const mongo_url="mongodb://127.0.0.1:27017/airbnb";

main().then(()=>{
    console.log("connect to db");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo_url);
} 
const initDB= async()=> {
  await listing.deleteMany({});
  await listing.insertMany(initdata.data);
  console.log("data was initlize");

};
initDB();