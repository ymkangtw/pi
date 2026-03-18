module.exports = (app) => {
	const factorycodeapi = require('../ctrl/factorycode.ctrl');
	var router = require('express').Router();
	console.log('load factorycode api');
	// select all
	router.get('/', factorycodeapi.getAll);
	// select by id
	router.get('/getby', factorycodeapi.getBy);
	// create
	router.post('/', factorycodeapi.create);
	// update
	router.put('/', factorycodeapi.update);
	// delete
	router.delete('/', factorycodeapi.remove);

	app.use('/api/factorycode', router);

};