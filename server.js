var express = require('express'); //Require Express NPM Module
var bodyParser = require('body-parser');
var _ = require('underscore'); //use the underscore variable of "_"

var app =  express();
var PORT = process.env.PORT || 3000; //Used env.PORT for Heroku
var todos = [];
var todoNextID = 1;

//Setting up Middleware
app.use(bodyParser.json());//anytime a JSON request comes in, Express parses it and we can access it via bodyParser

//Get Root
app.get('/', function(request, response){
	console.log("GET <root>");
	response.send('To Do API Root');
});

//GET /todos
app.get('/todos', function(request, response){
	console.log("GET /todos");
	response.json(todos);	
});


//GET /todos/:id
app.get('/todos/:id', function(request, response){
	console.log("GET /todos/:id");
	//response.send('Asking for todo with id of ' + request.params.id);
	
	var todoID = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number
	
		//Refactor using Underscore
	var matchedTodo = _.findWhere(todos, {id: todoID});
	
	if(typeof matchedTodo === 'undefined'){
		response.status(404).json({"error" : "No ToDo found with id of " + todoID + ". Cannot GET"});
	}else{
		response.json(matchedTodo);
	}	
});


// POST  /todos
app.post('/todos', function(request, response){
	console.log('POST /todos');
	//Save Body and reomve unwanted keys
	var body = _.pick(request.body, 'id', 'description', 'completed')
	
	//Validation for String or Boolean or Empty String and sanitize string
	if(!_.isString(body.description) ||  !_.isBoolean(body.completed) || (body.description.trim().length === 0)){
		response.status(404).send("Error 404");
	}else{
		body.id = todoNextID++;
		body.description = body.description.trim();
		todos.push(body);
		response.json(body);	
	}
	
});


//Delete /todos/:id
app.delete('/todos/:id', function(request, response){
	console.log("DELETE /todos/:id");
	
	var todoID = parseInt(request.params.id, 10);//all request are a string, you have to convert to a number
		
	//Refactor using Underscore
	var matchedTodo = _.findWhere(todos, {id: todoID});
	
	if(typeof matchedTodo === 'undefined'){
		response.status(404).json({"error:" : "No ToDo found with id of " + todoID + ". Cannot DELETE"});
	}else{
		todos = _.without(todos, matchedTodo);
		response.json(matchedTodo);
	}
		
});


app.listen(PORT, function(){
	console.log('Webserver listing on '+ PORT + '!')
	
});
