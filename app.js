//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose")

const homeStartingContent = "This is my blog website. You can read, save and delete your blogs here.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser: true})

const blogSchema = {
  title: String,
  content: String
}

const Blog = mongoose.model("BlogList",blogSchema)

app.get("/",function(req,res){
  Blog.find({},function(err,results){
    res.render("home",{homeContent: homeStartingContent,newPosts: results})
})
})

app.get("/delete/:topic",(req,res)=>{
  Blog.deleteOne({title: req.params.topic},function(err){
    if(err)
    console.log("cannot delete");
    else{
    console.log("deleted");
    res.redirect("/")
  }})
})

app.get("/about",function(req,res){
  res.render("about",{aboutContent: aboutContent})
})

app.get("/contact",function(req,res){
  res.render("contact",{contactContent: contactContent})
})

app.get("/compose",function(req,res){
  res.render("compose")
})

app.get("/posts/:topic",(req,res)=>{
  Blog.find({},function(err,results){
    results.forEach(function(post){
      if(_.lowerCase(post.title)===_.lowerCase(req.params.topic))
      res.render("post",{title: post.title,content:post.content})
    })
})
})

app.post("/compose",function(req,res){
  const post = {
    title: req.body.postTitle,
    text: req.body.postText
  }

  posts.push(post)
  const newblog = new Blog({
    title: req.body.postTitle,
    content: req.body.postText
  })
  Blog.create(newblog,function(err){
    if(!err)
    console.log("Added");
})
  res.redirect("/")
})










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
