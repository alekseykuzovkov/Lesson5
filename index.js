const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const tasks = require('./models/tasks');
const templating = require('consolidate');
const _ = require('underscore');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(express.static('js'));

//Точка входа
app.get('/', function(req, res) {
	res.render('main', {
		title: 'Список задач!'
	});
});

//API для асинхронного получения списка задач
app.get('/api/list', function(req, res) {
	tasks.list((err, tasks) => {
		if (err) {
			console.log(err);
			return;
		}
		res.send(JSON.stringify(tasks));
	});
});

//API для асинхронной работы с to-do list
app.post('/api', urlencodedParser, function(req, res) {
	if (_.has(req.body, 'task') && _.has(req.body, 'priority')) {
		if (_.has(req.body, 'change') ) {
			tasks.change(req.body.change, req.body.task, req.body.priority, (err) => {
				console.log(req.body);
				if (err) {
					console.log(err);
					return;
				}
				res.send('done');
			});
		}
		else {
			tasks.add(req.body.task, req.body.priority, (err, insertid) => {
				if (err) {
					console.log(err);
					return;
				}
				res.send('done');
			});
		}
		
	}
	else if (_.has(req.body, 'delete')) {
		console.log("delete "+req.body.delete);
		tasks.delete(req.body.delete, (err, insertid) => {
			if (err) {
				console.log(err);
				return;
			}
			res.send('done');
		});
	}
	else if (_.has(req.body, 'complete')) {
		tasks.complete(req.body.complete, (err) => {
			if (err) {
				console.log(err);
				return;
			}
			res.send('done');
		});
	}
});

app.listen(3000);

