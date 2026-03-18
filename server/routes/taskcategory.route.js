module.exports = (app) => {
	const taskcategoryapi = require('../ctrl/taskcategory.ctrl');
	var router = require('express').Router();
	console.log('load taskcategory api');
	// select all
	router.get('/', taskcategoryapi.getAll);
	// select by id
	router.get('/getby', taskcategoryapi.getBy);
	// create
	router.post('/', taskcategoryapi.create);
	// update
	router.put('/', taskcategoryapi.update);
	// delete
	router.delete('/', taskcategoryapi.remove);

	app.use('/api/taskcategory', router);

};