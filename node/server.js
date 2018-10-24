// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

/**
var mongoose   = require('mongoose');
mongoose.connect('mongodb://qupe:This1sMyMongoDB!@ds245132.mlab.com:45132/doit'); // connect to our database
*/

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

var Task     = require('./models/task');

var tasks = [];

var users = [];

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('A request arrived.');
    next(); // make sure we go to the next routes and don't stop here
});

// on routes that end in /tasks
// ----------------------------------------------------
router.route('/tasks')

    // create a task (accessed at POST http://localhost:8080/api/tasks)
    .post(function(req, res) {

        var task = new Object();      // create a new instance of the Task model
		task.id = req.body.id;
        task.name = req.body.name;  // set the Tasks name (comes from the request)
		task.state = req.body.state;
		task.creatorId = req.body.creatorId;
		task.ownerId = req.body.ownerId;
		
		tasks.push(task); 
		
		console.log('Tasks: ' + tasks);

		/**
        // save the task and check for errors
        task.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Task created!' });
        });
		*/
		 res.json({ message: 'Task created!' });

    })
	
	    // get all the tasks (accessed at GET http://localhost:8080/api/tasks)
    .get(function(req, res) {
       
        res.json(tasks);
      
    });
	
// on routes that end in /tasks/:task_id
// ----------------------------------------------------
router.route('/tasks/:task_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/tasks/:task_id)
    .get(function(req, res) {
		let task_id = req.params.task_id;
		for (let i=0; i < tasks.length; i++) {
			if (tasks[i].id == task_id) {
				res.json(tasks[i]);
				return;
			}
		}
		
		res.status(404)        // HTTP status 404: NotFound
			.send('Not found');

    })
	
	.put(function(req, res) {
		let task_id = req.params.task_id;
		for (let i=0; i < tasks.length; i++) {
			if (tasks[i].id == task_id) {
				if (req.body.name) {
					tasks[i].name = req.body.name;
				}
				if (req.body.state) {
					tasks[i].state = req.body.state;
				}
				if (req.body.creatorId) {
					tasks[i].creatorId = req.body.creatorId;
				}
				if(req.body.ownerId) {
					tasks[i].ownerId = req.body.ownerId;
				}
				res.json(tasks[i]);
				return;
			}
		}
	
	})
	
	.delete(function(req, res) {
		let task_id = req.params.task_id;
		let newTaskList = [];
		for (let i=0; i < tasks.length; i++) {
			if (tasks[i].id != task_id) {
				newTaskList.push(tasks[i]);
			}
		}
		
		tasks = newTaskList;
		
		res.status(204)       
					.send('No content');
		
	});
	
	// on routes that end in /tasks
// ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        var user = new Object();      // create a new instance of the User model
		user.id = req.body.id;
        user.name = req.body.name;  // set the User name (comes from the request)
				
		users.push(user); 
		
		console.log('Users: ' + users);

		/**
        // save the task and check for errors
        task.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Task created!' });
        });
		*/
		 res.json({ message: 'User created!' });

    })
	
	    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
       
        res.json(users);
      
    });
	
// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

    // get the user with that id (accessed at GET http://localhost:8080/api/users/:user_id)
    .get(function(req, res) {
		let user_id = req.params.user_id;
		for (let i=0; i < users.length; i++) {
			if (users[i].id == user_id) {
				res.json(users[i]);
				return;
			}
		}
		
		res.status(404)        // HTTP status 404: NotFound
			.send('Not found');

    })
	
	.put(function(req, res) {
		let user_id = req.params.user_id;
		for (let i=0; i < users.length; i++) {
			if (users[i].id == user_id) {
				if (req.body.name) {
					users[i].name = req.body.name;
				}
			
				res.json(users[i]);
				return;
			}
		}
	
	})
	
	.delete(function(req, res) {
		let user_id = req.params.user_id;
		let newUserList = [];
		for (let i=0; i < users.length; i++) {
			if (users[i].id != user_id) {
				newUserList.push(users[i]);
			}
		}
		
		users = newUserList;
		
		res.status(204)       
					.send('No content');
		
	});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
