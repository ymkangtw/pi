module.exports = (app) => {
	const servicevalueapi = require('../ctrl/servicevalue.ctrl');
	var router = require('express').Router();
	console.log('load servicevalue api');
	// select all
	router.get('/', servicevalueapi.getAll);
	// select by id
	router.get('/getby', servicevalueapi.getBy);
	// create
	router.post('/', servicevalueapi.create);
	// update
	router.put('/', servicevalueapi.update);
	// delete
	router.delete('/', servicevalueapi.remove);

	app.use('/api/servicevalue', router);

};