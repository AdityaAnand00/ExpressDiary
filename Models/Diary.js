// here we will be creating our schema 

const mongooose = require('mongoose') ; 

// this is the method through which  we are gonna create our schema..
const diarySchema  = new mongooose.Schema({
    title:{
        type:String , 
        required : true
    } ,
    description:{
        type:String , 
        required : true
    } ,
    date:{
        type:Date ,
        required : true
    }
})
//this title , desc and date will be stored in the collection of the DB 
//now from the created schema we need to create  a model as well : so what model does is it helps us to interact with  the database ... 
module.exports =  mongooose.model('Diary' ,diarySchema) ;
// so it takes 2  params , first is name of the model,  and second is which schema its going to take .... and at last we are gonna export it . 
// "we are creating a model with the help of mongoose.model mtd , we are creating a model which is of name diary and we are creating a model based on diarySchema  and then exporting it  in our app.js file in order  to  do CRUD operations on it ., "