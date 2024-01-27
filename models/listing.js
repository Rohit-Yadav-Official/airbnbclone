const mongoose = require("mongoose");
const review = require("./review");


const listingschema=new mongoose.Schema({
  title :{ type: String,
      required: true,
    },
    description:{ type:String,
    required:true,},
    image: {
      type: String,
       required:true,
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
         : v ,
    },
  price:Number,
  location:String,
  country:String,
  review:[{

    type:mongoose.Schema.Types.ObjectId,
    ref:review
  }]
});
const listing= mongoose.model("listing",listingschema);``
module.exports=listing;