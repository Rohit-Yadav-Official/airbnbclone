const express=require("express");
const router=express.Router();
const bodyParser = require('body-parser');
const app=express();
const mongoose= require("mongoose");
const path= require("path");
const Listing=require ("../models/listing.js");
const authsignup=require("../models/user.js");
const methodoverride= require("method-override");
const ejsMate=require("ejs-mate");
const {listingschema ,reviewschema}=require("../schema.js");
const bcrypt=require("bcrypt");
app.use(bodyParser.urlencoded({ extended: true }));



const validatelisting =  (req, res, next) => {
  const error= listingschema.validate(req.body);
  if (error) {
    let errmsg =error.details.map((el)=>el.message).join(",");
    throw new ExpressError(404,errmsg);


  }
  else{

    next();
  }
  
};


router.get("/", async(req,res)=>{

    const alllisting =await Listing.find({});
   //console.log(alllisting);
    res.render("listings/index.ejs",{alllisting});
});
router.get("/new",async (req,res)=>{
    res.render("listings/new.ejs");
});
router.post("/" ,validatelisting, async (req,res)=>{

  console.log('req.body:', req.body);
  console.log('req.body.listing:', req.body.listing);
  try {
    const newListing = new Listing({
      title: req.body['listing[title]'],
      description: req.body['listing[description]'],
      image: req.body['listing[image]'],
      price: req.body['listing[price]'],
      location: req.body['listing[location]'],
      country: req.body['listing[country]'],
    });

    await newListing.save();
    res.redirect("/listing");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating the listing.");
  }
});


router.get("/:id", async (req,res)=>{
  let{id}=req.params;
  const listing  = await Listing.findById(id).populate("review");
  res.render("listings/show.ejs",{listing});

});
router.get("/:id/edit" , async (req,res)=>{
    let{id}=req.params;
  const listing  = await Listing.findById(id); 
  res.render("listings/edit.ejs",{listing});
});
router.put("/:id",async(req,res)=>{

    try {
        // console.log(req.body); // Log the entire request body for debugging
         let{id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing})
        
        res.redirect("/listing");
       } catch (error) {
         console.error(error);
         res.status(500).send("Error creating the listing.");
       }

   

});
router.delete("/:id",async(req,res)=>{
  let {id}=req.params;
 await Listing.findByIdAndDelete(id);
  res.redirect("/listing");

});


module.exports = router;
