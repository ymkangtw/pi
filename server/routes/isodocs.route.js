module.exports = (app) => {
	const isodocsapi = require('../ctrl/isodocs.ctrl');
	var router = require('express').Router();
	console.log('load isodocs api');
	// select all
	router.get('/', isodocsapi.getAll);
	// select by id
	router.get('/getby', isodocsapi.getBy);
	// create
	router.post('/', isodocsapi.create);
	// update
	router.put('/', isodocsapi.update);
	// delete
	router.delete('/', isodocsapi.remove);

	app.use('/api/isodocs', router);

};