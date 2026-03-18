module.exports = (app) => {
	const basicapi = require('../ctrl/basic.ctrl');
	var router = require('express').Router();
	console.log('load basic api');
	// select all
	router.get('/', basicapi.getAll);
	// select by id
	router.get('/getby', basicapi.getBy);
	// create
	router.post('/', basicapi.create);
	// update
	router.put('/', basicapi.update);
	// delete
	router.delete('/', basicapi.remove);

	app.use('/api/basic', router);

};