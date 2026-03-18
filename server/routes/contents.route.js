module.exports = (app) => {
	const contentsapi = require('../ctrl/contents.ctrl');
	var router = require('express').Router();
	console.log('load contents api');
	// select all
	router.get('/', contentsapi.getAll);
	// select by id
	router.get('/getby', contentsapi.getBy);
	// create
	router.post('/', contentsapi.create);
	// update
	router.put('/', contentsapi.update);
	// delete
	router.delete('/', contentsapi.remove);

	app.use('/api/contents', router);

};