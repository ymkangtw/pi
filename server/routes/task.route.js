module.exports = (app) => {
	const taskapi = require('../ctrl/task.ctrl');
	var router = require('express').Router();
	console.log('load task api');
	// select all
	router.get('/', taskapi.getAll);
	// select by id
	router.get('/getby', taskapi.getBy);
	// create
	router.post('/', taskapi.create);
	// update
	router.put('/', taskapi.update);
	// delete
	router.delete('/', taskapi.remove);

	app.use('/api/task', router);

};