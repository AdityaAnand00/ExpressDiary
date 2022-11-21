const express = require("express") ;
const bodyParser = require('body-parser') ; 
const mongooose = require('mongoose') ; 
const methodOverride = require('method-override') ; // after installing it here and calling it , we also need to wirte its middleware . 

const app = express() ;

const port = process.env.PORT || 3000 ; 

//set templating engine as ejs ;
app.set('view engine' ,'ejs') ; // this line tells that the view-engine that we are using is ejs .
// view engine  :View engines allow us to render web pages using template files. These templates are filled with actual data and served to the client

//serving static files : 
app.use(express.static('public'))  
// by writing above line i am doing my public folder as static folder , and all the static files from  now can we can keep it inside in public folder and by adding link rel href in our html  page we will be able to see our css in DOM . 

// body-parser middleware
// create application/json parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//middleware for method-override
app.use(methodOverride('_method')) ; //if u dont write middleware u will not be able to use this dependency

// to use the secret key  we must import our ,env file.
// in react we coonnects our database with our application with mongooose
const dotenv = require("dotenv"); 
dotenv.config() ;
mongooose.connect(process.env.MONGO_URL , {
    useNewUrlParser:true  ,
    useUnifiedTopology:true
}).then(console.log("MONGO DB CONNNECTION SUCCESSFUL"))
.catch(err =>console.log(err))
// we always rewuire this 2 true boolean condition , to connect to the mongoose .
// after the connection is successful , what we have to do is we have to tell our mongodb , in which way we are gonna store our data , and we call it as "SCHEMA"

//import Diary  schema model :
const Diary = require('./Models/Diary') ;
const { request } = require("express");
// now the model is exported and saved in variable Diary and with this keyword we can interact with our DB !



//Routing
// route for (/) : root path
app.get('/' , (req , res) =>{
    res.render('Home' , {value:"Hello World"}) ;
    // what res.render does  is : at the  moment we have an html file and it is saved as  .ejs file ,  so render does it convert the ejsfile to html file ,bcz browser only understands html file  not ejs file. 
}) ; 
//route for about page .
app.get('/about' , (req ,res) =>{
    res.render('About') ; 
}) ;
// in above  two  get methods , we were sending only a message or a small block of req , but to send whole of a html page  , we will be using something called templating engines : it is not a partof express , but we can use it to return html pages or web pages files . 
// there is also a differnce  between using  static html files  and using a templating engine  : the differnce is templating  engines can have access to data(DYNAMIC) and it can  show data into the webpages , but this is not the  case with html pages which are just  static . 

//route for "go to diary"
app.get('/diary' ,(req ,res) =>{
    //we need to fetch saved data from DB and so it to this route , so we use the model name and find funciton , this function will get me all the data from the collection "Diary"  into var "data", and this will then retutrn a promise , which we are consoling it . but instead of consoling it to the terminal we need to display it to our route. 
    // Diary.find().then(data => {
    //     console.log(data)
    // }).catch(err => console.log(err)) ;

    Diary.find().then(data =>{
        res.render('Diary' , {data : data}) ; 
    }).catch(err => console.log(err))  ; 
    
})
//route for adding records
app.get('/add' , (req,  res)=>{
    res.render('Add') ; 
})

//rotue for saving diary 
app.post('/add-to-diary' ,(req , res)=>{
    
    //save data on th DB , in order  to do this we just need to  instantiate  the data . 
    const Data = new Diary({
        title:req.body.title , 
        description:req.body.description ,
        date:req.body.date
    })//after taking all thedata we need to save  it and this save() mtd takes a promise ,,, which inturns take the callback fun. ,and the user needs to  be redirected to a certain path .
    Data.save().then(()=>{
        res.redirect('/diary') ; // this /diary is our route i.e.// localhost3000/diary bcz we want to  display the created values in to that page . 
        Diary
    }).catch(err=>console.log(err)) ; 

   /* read this block 1st then look for code written above...
    // inside this method , what we need to  do is write a code which will submit/save the data written in the form to our database ,  but before saving it to the database , we need to  get that  input here , we need those data to  here ,inorder to  make those data  travel to our DB , and for doing this we need to install another depedencies called  as "body parser" and what it let us do is , whatever things that we havw  filled in input feild or form  , it will help u get  that. 
    
    // res.send(req.body) ; 
    //by using body-parser , what happen is whatever data that we given in input container those values are contained in req.body and from that it is converted to json format and then we can almost do anything with those data. ex: res.send(req.body.title) returns only the title .
    */ 
}) ; 
//vvi: we are using a post method to submit the data filled in the form ,we can also do the same using get method ,but we donot consider that  , this is because , if u post some data using get method , the data will be shown in the searchbox of ur browser as a query , which should not be done bcz the data filled  in the form must be hidden . hence we must always use post method. 

//routes for displaying recods when we click on more button 
app.get('/diary/:id' , (req ,res) =>{
    // res.send(req.params.id) // this line prints the clicked diaries unique iD to the browser . but we are just not go to   display the id  on browser  , we are actually gona search the DB and find the data with that  ID ,
        Diary.findOne({
            _id:req.params.id
        }).then(data =>{
            res.render('Page' ,{data:data}) ; 
        }).catch(err=> console.log(err)) ;
// okay so findOne() function will give u jjust one record , but  in a rgument we need to  specify based on what thingwe are gonna find that  one thing , in this case its the ID . "_id" this is the way in which id is saved in mongoDb.
    })

// route for editing the diary i.e. open page again to edit.
app.get('/diary/edit/:id' , (req , res)=>{
    Diary.findOne({
        _id: req.params.id
    }).then(data =>{
        res.render('Edit' , {data:data}) ; 
    }).catch(err =>console.log(err)) ; 
    // so agian  the same approach we followed as we did it  in above function  : just finding that data that belongs to the follwoing id , and accordingly  rendring it  into a new page named as "Edit" and sending the data as well . 
    // {data:data} : the 1st data written here is the name of the variable that  we are going to use in the Edit.ejs file and 1st data refers to the function used in the  .then() callback function  
    //reason why we are sending  the data to the edit page is , since its a edit page , so we are gonna edit or continue  on writing the diary from where it was left lasst , so this is only possible if the data is already loaded  in the browser  so that user can further continue it 
})

// after editing the things of a diary  entry  , finally updating it to the DB .
app.put('/diary/edit/:id' , (req , res) => {
    // res.send(req.params.id)  now what  we are gonna do is with the help of this id   i am gonna update the DB
    Diary.findOne({
        _id:req.params.id
    }).then(data =>{
                data.title = req.body.title ;
                data.description = req.body.description ; 
                data.date = req.body.date ; 


                data.save().then(()=>{
                    res.redirect('/diary') ; 
                }).catch(err => console.log(err)) ; 
    }).catch(err=>console.log(err)) ; 
})

//deleting a entry  .
app.delete('/diary/delete/:id' , (req , res)  =>{
    Diary.remove({
        _id : req.params.id
    }).then(data =>{
        res.redirect('/diary') ; 
    }).catch(err => console.log(err)) ; 
})

//create a server
app.listen(port, () =>{console.log("Backend Server is Running")});  


