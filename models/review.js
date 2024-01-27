const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewschema= new Schema({
  
  rating:{type:Number,
        min:1,  max:5
},    
  createdAt :{
     type:Date,
     default:Date.now()
  },
comment :{type:String,
 required:[true, 'Please add a comment']}


});
module.exports=mongoose.model("review",reviewschema);


