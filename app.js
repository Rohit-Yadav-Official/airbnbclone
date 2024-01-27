const express= require("express");
const bodyParser = require('body-parser');
const app=express();
const mongoose= require("mongoose");
const path= require("path");
const Listing=require ("./models/listing.js");
const Review=require ("./models/review.js");
const authsignup=require("./models/user.js");
const methodoverride= require("method-override");
const ejsMate=require("ejs-mate");
const bcrypt=require("bcrypt");
const listing=require("./router/listing.js");
app.use(bodyParser.urlencoded({ extended: true }));
const {listingschema ,reviewschema}=require("./schema.js");
const { expression } = require("joi");
 
app.engine("ejs",ejsMate);
app.use (methodoverride("_method"));

app.use(express.static(path.join(__dirname,"/public")));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const mongo_url="mongodb://127.0.0.1:27017/airbnb";
async function main(){
    await mongoose.connect(mongo_url , {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
} 
main().then(()=>{
    console.log("connect to db" );
}).catch((err)=>{
    console.log(err);
});


app.use("/listing",listing);


function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
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






app.get("/", (req,res)=>{
  res.render("auth/login.ejs");
});
app.post("/login",async(req,res)=>{
  const { email, password } = req.body;

  try {
    
    const user = await authsignup.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }
    console.log('Input password:', password);
    console.log('Stored hashed password:', user.password);

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isPasswordValid);
    
    if (isPasswordValid) {
      
      //req.session.user = user; 

      
      res.redirect('/listing');
    } else {
      
      res.status(401).send('Invalid password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }

});
app.get("/signup", (req,res)=>{
   res.render("auth/signup.ejs");
});
app.post("/signup",async (req,res)=>{
  const { name, email, password } = req.body;

  // Hash the password before storing it in the database
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const signup = new authsignup({
      name,
      email,
      password: hashedPassword, // Store the hashed password
    });

    await signup.save();
    res.redirect("/listing");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up.");
  }
});



app.post("/listing/:id/review" , wrapAsync( async (req,res) =>{

  
  let listing =await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review?.review);
   listing.review.push(newReview);
   newReview.save();
   listing.save();
   res.send("review send");
}));

app.listen(8085,()=>{
    console.log('server is lesting at 8080');
});