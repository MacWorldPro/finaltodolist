//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const dbUrl="mongodb+srv://ankush20386:3OljRtQxMH2xPkKQ@cluster0.nbjry1t.mongodb.net/todolistDB?retryWrites=true&w=majority";
const connectionParams={
  useNewUrlParser:true,
  useUnifiedTopology:true,
}
mongoose.connect(dbUrl,connectionParams);
const taskSchema={
  name:String
};

const Task=mongoose.model("Task",taskSchema);

const listschema={
  name:String,
  tasks:[taskSchema]
};

const List=mongoose.model("List",listschema);


const task1=new Task({
  name:"Coding"
});


const task2=new Task({
  name:"Web Development"
});


const task3=new Task({
  name:"Leetcode"
});


const defaultlist=[task1,task2,task3];


app.get("/", function(req, res) {

  async function show(){
    const data=await Task.find();
    if (data.length===0) {
      await Task.insertMany(defaultlist);
    }
    else {
      res.render("list", {listTitle: "Today", newListItems: data});
    }
  }
  show();
});

app.get("/:customListName",(req,res)=>{
  const listname=req.params.customListName;
  async function finda(){
    const data=await List.findOne({name:listname});
    if(!data)
    {
      const list=new List({
        name:listname,
        tasks:defaultlist
      });
      list.save();
      res.redirect("/"+listname);
    }
    else {
      res.render("list",{listTitle: data.name, newListItems: data.tasks});
    }
  }
  finda();
})

app.post("/", function(req, res){

  const item = req.body.newItem;
  const value=req.body.list;
  const taskName=new Task({
    name:item
  });
  if (value==="Today") {
    taskName.save();
    res.redirect("/");
  }
  else {
    async function findb(){
      const foundList=await List.findOne({name:value});
      foundList.tasks.push(taskName);
      foundList.save();
      res.redirect("/"+value);
    }
    findb();
  }
});

app.post("/delete",function(req,res){
  const todelitem=req.body.checkbox;
  console.log(todelitem);
  async function del(){
    await Task.findByIdAndRemove(todelitem);
    res.redirect("/");
  };
  del();
})



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
