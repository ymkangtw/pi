module.exports = (app) => {
	const ordercategoryapi = require('../ctrl/ordercategory.ctrl');
	var router = require('express').Router();
	console.log('load ordercategory api');
	// select all
	router.get('/', ordercategoryapi.getAll);
	// select by id
	router.get('/getby', ordercategoryapi.getBy);
	// create
	router.post('/', ordercategoryapi.create);
	// update
	router.put('/', ordercategoryapi.update);
	// delete
	router.delete('/', ordercategoryapi.remove);

	app.use('/api/ordercategory', router);

};